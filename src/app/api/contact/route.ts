import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import { sendMail } from "@/lib/email";
import { isAuthenticated } from "@/lib/auth";

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

    // 1. Send Email Notification to Admin (enteropia.dev@gmail.com)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0214; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #140624; border: 1px solid #4a1d82; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
            .header { border-bottom: 1px solid rgba(139, 92, 246, 0.2); padding-bottom: 20px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: bold; color: #a855f7; letter-spacing: 2px; }
            .title { font-size: 20px; color: #ffffff; margin-top: 10px; font-weight: 600; }
            .badge { display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; rounded-full: 9999px; border-radius: 9999px; margin-bottom: 20px; }
            .field-group { margin-bottom: 18px; }
            .label { font-size: 12px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 15px; color: #f1f5f9; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; }
            .message-box { font-size: 14px; color: #f1f5f9; background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); padding: 16px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; }
            .footer { margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .btn { display: inline-block; background: #a855f7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-top: 20px; transition: background 0.2s; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">enteropia</div>
              <div class="title">New Contact Submission</div>
            </div>
            
            <div class="badge">Inquiry Received</div>
            
            <div class="field-group">
              <div class="label">Name</div>
              <div class="value">${fullName}</div>
            </div>
            
            <div class="field-group">
              <div class="label">Email Address</div>
              <div class="value">${email}</div>
            </div>

            <div class="field-group">
              <div class="label">Submitted On</div>
              <div class="value">${timestamp}</div>
            </div>
            
            <div class="field-group">
              <div class="label">Message</div>
              <div class="message-box">${message}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re: Your inquiry with enteropia" class="btn">Reply to Submitter</a>
            </div>
            
            <div class="footer">
              This message was sent automatically from the enteropia Contact Portal.<br>
              &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
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
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0214; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #140624; border: 1px solid #4a1d82; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
            .header { border-bottom: 1px solid rgba(139, 92, 246, 0.2); padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
            .logo { font-size: 26px; font-weight: bold; color: #a855f7; letter-spacing: 3px; margin-bottom: 6px; }
            .tagline { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
            .greeting { font-size: 20px; color: #ffffff; font-weight: 600; margin-top: 10px; margin-bottom: 14px; text-align: center; }
            .body-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px; }
            .summary-card { background: rgba(139, 92, 246, 0.04); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .summary-title { font-size: 12px; color: #a855f7; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid rgba(139, 92, 246, 0.1); padding-bottom: 6px; }
            .summary-item { font-size: 13px; color: #e2e8f0; margin-bottom: 8px; }
            .summary-item strong { color: #ffffff; }
            .contact-info { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 16px; font-size: 13px; color: #94a3b8; text-align: center; }
            .contact-info a { color: #c084fc; text-decoration: none; }
            .footer { margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">enteropia</div>
              <div class="tagline">Next-Gen Digital Solutions</div>
            </div>
            
            <div class="greeting">Thank you for reaching out, ${firstName}!</div>
            
            <div class="body-text">
              We have successfully received your inquiry. Our specialized tech and management team is already reviewing your message, and we will get back to you with a comprehensive response within 24 business hours.
            </div>
            
            <div class="summary-card">
              <div class="summary-title">Your Submission Details</div>
              <div class="summary-item"><strong>Date:</strong> ${timestamp}</div>
              <div class="summary-item"><strong>Inquirer:</strong> ${fullName}</div>
              <div class="summary-item" style="margin-top: 12px; line-height: 1.5;">
                <strong>Message:</strong><br>
                <span style="color: #cbd5e1; font-style: italic;">"${message}"</span>
              </div>
            </div>

            <div class="body-text">
              If you have any urgent details or assets to share in the meantime, feel free to reply directly to this email or call our direct line listed below.
            </div>
            
            <div class="contact-info">
              Have questions? Reach us directly at<br>
              <strong>Email:</strong> <a href="mailto:enteropia.dev@gmail.com">enteropia.dev@gmail.com</a> &nbsp;|&nbsp; 
              <strong>Hotline:</strong> <a href="tel:+919900112530">+91 9900112530</a>
            </div>
            
            <div class="footer">
              This is an automated confirmation of your request. Please do not modify the subject line if replying.<br>
              &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // Trigger async email sends
    await Promise.all([
      sendMail({
        to: "enteropia.dev@gmail.com",
        subject: `[New Contact Message] Submission from ${fullName}`,
        html: adminEmailHtml,
      }),
      sendMail({
        to: email,
        subject: `We've received your inquiry - enteropia`,
        html: userEmailHtml,
      }),
    ]);

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
