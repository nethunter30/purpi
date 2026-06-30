import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import { sendMail } from "@/lib/email";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/contact - Retrieve all contact submissions (Admin only)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Secure endpoint check
    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error: any) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/contact - Submit new contact form (Public)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Save to Database
    const submission = await ContactSubmission.create({
      firstName,
      lastName,
      email,
      message,
      isRead: false,
    });

    // Send emails
    const fullName = `${firstName} ${lastName}`;
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // 1. Send Email Notification to Admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #0c0414; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .wrapper { width: 100%; background-color: #0c0414; padding: 40px 20px; box-sizing: border-box; }
            .card { max-width: 600px; margin: 0 auto; background-color: #140827; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); }
            .gradient-bar { height: 6px; background: linear-gradient(90deg, #a855f7 0%, #ec4899 100%); }
            .content { padding: 40px 32px; }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
            .logo span { color: #ec4899; }
            .title-container { text-align: center; margin-bottom: 32px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; }
            .badge { display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 6px 14px; border-radius: 9999px; margin-top: 10px; }
            .info-grid { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin-bottom: 28px; }
            .info-row { margin-bottom: 18px; }
            .info-row:last-child { margin-bottom: 0; }
            .label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
            .value { font-size: 15px; color: #cbd5e1; font-weight: 500; }
            .message-box { background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 10px; padding: 20px; font-size: 14px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; margin-bottom: 32px; }
            .btn-container { text-align: center; margin-bottom: 12px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 10px 20px rgba(168, 85, 247, 0.2); }
            .footer { border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 24px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 32px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="gradient-bar"></div>
              <div class="content">
                <div class="logo">enter<span>opia</span></div>
                <div class="title-container">
                  <div class="title">New Contact Submission</div>
                  <div class="badge">Inquiry Received</div>
                </div>
                
                <div class="info-grid">
                  <div class="info-row">
                    <div class="label">Name</div>
                    <div class="value">${fullName}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Email Address</div>
                    <div class="value">${email}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Submitted On</div>
                    <div class="value">${timestamp}</div>
                  </div>
                </div>
                
                <div class="label" style="margin-left: 4px; margin-bottom: 8px;">Message</div>
                <div class="message-box">${message}</div>
                
                <div class="btn-container">
                  <a href="mailto:${email}?subject=Re: Your inquiry with enteropia" class="btn">Reply to Submitter</a>
                </div>
                
                <div class="footer">
                  This message was sent automatically from the enteropia Contact Portal.<br>
                  &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Send Styled Confirmation Email to User
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #0c0414; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .wrapper { width: 100%; background-color: #0c0414; padding: 40px 20px; box-sizing: border-box; }
            .card { max-width: 600px; margin: 0 auto; background-color: #140827; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); }
            .gradient-bar { height: 6px; background: linear-gradient(90deg, #a855f7 0%, #ec4899 100%); }
            .content { padding: 40px 32px; }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
            .logo span { color: #ec4899; }
            .title-container { text-align: center; margin-bottom: 28px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; }
            .subtitle { font-size: 12px; color: #a78bfa; margin-top: 6px; text-transform: uppercase; letter-spacing: 1.5px; }
            .greeting { font-size: 16px; color: #ffffff; font-weight: 600; margin-bottom: 14px; }
            .body-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px; }
            .summary-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin-bottom: 28px; }
            .summary-title { font-size: 11px; color: #c084fc; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; }
            .summary-row { margin-bottom: 10px; font-size: 13px; color: #cbd5e1; }
            .summary-row:last-child { margin-bottom: 0; }
            .summary-row strong { color: #ffffff; }
            .contact-info { background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 18px; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5; }
            .contact-info a { color: #c084fc; text-decoration: none; font-weight: 600; }
            .footer { border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 24px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; margin-top: 32px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="gradient-bar"></div>
              <div class="content">
                <div class="logo">enter<span>opia</span></div>
                <div class="title-container">
                  <div class="title">Thank You For Reaching Out</div>
                  <div class="subtitle">Next-Gen Digital Solutions</div>
                </div>
                
                <div class="greeting">Hi ${firstName},</div>
                
                <div class="body-text">
                  We have successfully received your inquiry. Our specialized tech and management team is already reviewing your request. We will get back to you with a comprehensive response within 24 business hours.
                </div>
                
                <div class="summary-card">
                  <div class="summary-title">Your Submission Details</div>
                  <div class="summary-row"><strong>Date:</strong> ${timestamp}</div>
                  <div class="summary-row"><strong>Inquirer:</strong> ${fullName}</div>
                  <div class="summary-row" style="margin-top: 14px; line-height: 1.6; font-style: italic; color: #e2e8f0; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); padding: 12px; border-radius: 6px;">
                    "${message}"
                  </div>
                </div>
                
                <div class="body-text" style="margin-bottom: 28px;">
                  If you have any urgent files or additional information to share in the meantime, feel free to reply directly to this email or reach us through the support channels below.
                </div>
                
                <div class="contact-info">
                  Have questions? Reach us directly at<br>
                  <strong>Email:</strong> <a href="mailto:info@enteropia.com">info@enteropia.com</a> &nbsp;|&nbsp; 
                  <strong>Hotline:</strong> <a href="tel:+919900112530">+91 9900112530</a>
                </div>
                
                <div class="footer">
                  This is an automated confirmation of your request. Please do not modify the subject line if replying.<br>
                  &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Trigger async email sends
    const emailPromises = [];

    // 1. Send to Company Admin Email (ADMIN_EMAIL from .env or info@enteropia.com)
    const adminEmail = process.env.ADMIN_EMAIL || "info@enteropia.com";
    emailPromises.push(
      sendMail({
        to: adminEmail,
        subject: `[New Contact Message] Submission from ${fullName}`,
        html: adminEmailHtml,
        fromName: `${fullName} <${email}>`,
        replyTo: email,
      })
    );

    // 3. Send Styled Confirmation to the User
    emailPromises.push(
      sendMail({
        to: email,
        subject: `We've received your inquiry - enteropia`,
        html: userEmailHtml,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json(
      { success: true, message: "Thank you for reaching out! We've sent a confirmation email, and our team will get in touch shortly." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact submission:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
