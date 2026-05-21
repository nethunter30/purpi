// eslint-disable-next-line
import dotenv from 'dotenv';
import { resolve } from 'path';
import * as readline from 'readline';

// Load environment variables FIRST
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisified question function
function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

// Hidden password input (no stars printed)
function questionSecret(query: string): Promise<string> {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        stdout.write(query);

        if ((stdin as any).setRawMode) {
            (stdin as any).setRawMode(true);
        }

        let password = '';

        stdin.resume();
        stdin.setEncoding('utf8');

        const onData = (char: string) => {
            for (let i = 0; i < char.length; i++) {
                const c = char[i];

                switch (c) {
                    case '\n':
                    case '\r':
                    case '\u0004': // Ctrl+D
                        stdin.pause();
                        if ((stdin as any).setRawMode) {
                            (stdin as any).setRawMode(false);
                        }
                        stdout.write('\n');
                        stdin.removeListener('data', onData);
                        resolve(password);
                        return;

                    case '\u0003': // Ctrl+C
                        stdout.write('\n');
                        process.exit();

                    case '\u007f': // Backspace
                    case '\b':
                    case '\u0008':
                        if (password.length > 0) {
                            password = password.slice(0, -1);
                        }
                        break;

                    default:
                        // Only add printable characters
                        if (c >= ' ' && c <= '~') {
                            password += c;
                        }
                        break;
                }
            }
        };

        stdin.on('data', onData);
    });
}

async function createAdmin() {
    try {
        console.log('Create Superadmin User\n');

        const username = await question('Username: ');
        const email = await question('Email: ');
        const password = await questionSecret('Password: ');
        const passwordConfirm = await questionSecret('Password (again): ');

        rl.close();

        // Validate inputs
        if (!username || !password || !email) {
            console.error('\nError: All fields are required (Username, Email, Password)');
            process.exit(1);
        }

        if (password !== passwordConfirm) {
            console.error('\nError: Passwords do not match');
            process.exit(1);
        }

        if (password.length < 6) {
            console.error('\nError: Password must be at least 6 characters');
            process.exit(1);
        }

        // Import AFTER env variables are loaded
        const { default: dbConnect } = await import("@/lib/db");
        const { default: Admin } = await import("@/models/admin/Admin");

        await dbConnect();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            console.error('\nError: User with this username already exists');
            process.exit(1);
        }

        // Check if email already exists
        const existingEmail = await Admin.findOne({ email });

        if (existingEmail) {
            console.error('\nError: User with this email already exists');
            process.exit(1);
        }

        // Create admin
        await Admin.create({
            username,
            password,
            role: "superadmin",
            email,
        });

        console.log('\nSuperadmin user created successfully with email: ' + email);

    } catch (error) {
        console.error('\nError creating admin:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

createAdmin();