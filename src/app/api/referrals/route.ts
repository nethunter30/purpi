import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReferralSubmission from "@/models/ReferralSubmission";
import { sendMail } from "@/lib/email";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/referrals - Retrieve all referral submissions (Admin only)
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

    const submissions = await ReferralSubmission.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error: any) {
    console.error("Error fetching referral submissions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/referrals - Submit new referral (Public)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerUpiOrBank,
      clientBusinessName,
      clientContactName,
      clientEmail,
      clientPhone,
      projectScope,
    } = body;

    // Validation
    if (
      !referrerName ||
      !referrerEmail ||
      !referrerUpiOrBank ||
      !clientBusinessName ||
      !clientContactName ||
      !clientEmail ||
      !projectScope
    ) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referrerEmail) || !emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide valid email addresses" },
        { status: 400 }
      );
    }

    // Save to Database
    const submission = await ReferralSubmission.create({
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerUpiOrBank,
      clientBusinessName,
      clientContactName,
      clientEmail,
      clientPhone,
      projectScope,
      status: "Pending",
      isRead: false,
    });

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // 1. Admin Email Template
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0214; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #140624; border: 1px solid #4a1d82; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
            .header { border-bottom: 1px solid rgba(139, 92, 246, 0.2); padding-bottom: 20px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 2px; }
            .logo span { color: #a855f7; }
            .title { font-size: 20px; color: #ffffff; margin-top: 10px; font-weight: 600; }
            .badge { display: inline-block; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; margin-bottom: 20px; }
            .section-title { font-size: 13px; color: #a855f7; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px; }
            .field-group { margin-bottom: 14px; }
            .label { font-size: 11px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
            .value { font-size: 14px; color: #f1f5f9; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); padding: 10px; border-radius: 6px; }
            .message-box { font-size: 13px; color: #f1f5f9; background: rgba(59, 130, 246, 0.03); border: 1px solid rgba(59, 130, 246, 0.15); padding: 14px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; }
            .footer { margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 20px; transition: background 0.2s; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">enter<span>opia</span></div>
              <div class="title">New Referral Program Submission</div>
            </div>
            
            <div class="badge">Referral Received</div>
            
            <div class="section-title">Referrer Information (Partner)</div>
            <div class="field-group">
              <div class="label">Name</div>
              <div class="value">${referrerName}</div>
            </div>
            <div class="field-group">
              <div class="label">Email</div>
              <div class="value">${referrerEmail}</div>
            </div>
            <div class="field-group">
              <div class="label">Phone</div>
              <div class="value">${referrerPhone || "Not Provided"}</div>
            </div>
            <div class="field-group">
              <div class="label">UPI ID / Bank Details</div>
              <div class="value">${referrerUpiOrBank}</div>
            </div>

            <div class="section-title">Referred Client Information</div>
            <div class="field-group">
              <div class="label">Business Name</div>
              <div class="value">${clientBusinessName}</div>
            </div>
            <div class="field-group">
              <div class="label">Contact Person</div>
              <div class="value">${clientContactName}</div>
            </div>
            <div class="field-group">
              <div class="label">Client Email</div>
              <div class="value">${clientEmail}</div>
            </div>
            <div class="field-group">
              <div class="label">Client Phone</div>
              <div class="value">${clientPhone || "Not Provided"}</div>
            </div>
            
            <div class="field-group">
              <div class="label">Project Scope / Requirements</div>
              <div class="message-box">${projectScope}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="mailto:${clientEmail}?subject=IT & Software Solutions inquiry - enteropia" class="btn">Reach Out to Client</a>
            </div>
            
            <div class="footer">
              This message was sent automatically from the enteropia Partner Portal.<br>
              &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Referrer Confirmation Email Template
    const referrerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0214; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #140624; border: 1px solid #4a1d82; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
            .header { border-bottom: 1px solid rgba(139, 92, 246, 0.2); padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
            .logo { font-size: 26px; font-weight: bold; color: #3b82f6; letter-spacing: 3px; margin-bottom: 6px; }
            .logo span { color: #a855f7; }
            .tagline { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
            .greeting { font-size: 20px; color: #ffffff; font-weight: 600; margin-top: 10px; margin-bottom: 14px; text-align: center; }
            .body-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px; }
            .summary-card { background: rgba(59, 130, 246, 0.03); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .summary-title { font-size: 11px; color: #60a5fa; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid rgba(59, 130, 246, 0.1); padding-bottom: 6px; }
            .summary-item { font-size: 13px; color: #e2e8f0; margin-bottom: 6px; }
            .summary-item strong { color: #ffffff; }
            .step-container { margin: 24px 0; }
            .step { display: flex; align-items: flex-start; margin-bottom: 16px; }
            .step-num { width: 24px; height: 24px; border-radius: 12px; background: #2563eb; color: #fff; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
            .step-content { font-size: 13px; color: #cbd5e1; line-height: 1.5; }
            .step-title { font-weight: 600; color: #ffffff; margin-bottom: 2px; }
            .contact-info { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 16px; font-size: 13px; color: #94a3b8; text-align: center; }
            .contact-info a { color: #60a5fa; text-decoration: none; }
            .footer { margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">enter<span>opia</span></div>
              <div class="tagline">Referral Partner Program</div>
            </div>
            
            <div class="greeting">Thank you for your referral, ${referrerName}!</div>
            
            <div class="body-text">
              We appreciate you recommending enteropia. Our enterprise accounts team is reviewing the referral details and will reach out to the client.
            </div>
            
            <div class="summary-card">
              <div class="summary-title">Submission Receipt</div>
              <div class="summary-item"><strong>Date Submitted:</strong> ${timestamp}</div>
              <div class="summary-item"><strong>Referred Client:</strong> ${clientBusinessName} (${clientContactName})</div>
              <div class="summary-item"><strong>Estimated Commission:</strong> 10% on signed contract value</div>
              <div class="summary-item"><strong>Your Payment ID:</strong> ${referrerUpiOrBank}</div>
            </div>

            <div class="greeting" style="font-size: 16px; text-align: left; margin-bottom: 8px;">What Happens Next?</div>
            <div class="step-container">
              <div class="step">
                <div class="step-num">1</div>
                <div class="step-content">
                  <div class="step-title">Initial Outreach</div>
                  We connect with the referred contact to understand their IT, software, or cloud requirements.
                </div>
              </div>
              <div class="step">
                <div class="step-num">2</div>
                <div class="step-content">
                  <div class="step-title">Proposal & Contract</div>
                  We design a tailored engineering proposal and execute the contract.
                </div>
              </div>
              <div class="step">
                <div class="step-num">3</div>
                <div class="step-content">
                  <div class="step-title">Your Commission Payment</div>
                  As soon as the client pays their invoice, your 10% commission is immediately paid directly to your registered Bank/UPI account. No caps!
                </div>
              </div>
            </div>
            
            <div class="contact-info">
              Have questions about your referral or tracking? Reach us at<br>
              <strong>Email:</strong> <a href="mailto:info@enteropia.com">info@enteropia.com</a> &nbsp;|&nbsp; 
              <strong>Hotline:</strong> <a href="tel:+919900112530">+91 9900112530</a>
            </div>
            
            <div class="footer">
              This is an automated confirmation of your referral submission.<br>
              &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // Trigger async email sends
    const emailPromises = [];

    // 1. Send to Admin Gmail
    emailPromises.push(
      sendMail({
        to: "hello.enteropia@gmail.com",
        subject: `[New Referral Submission] Partner ${referrerName} referred ${clientBusinessName}`,
        html: adminEmailHtml,
      })
    );

    // 2. Send to GoDaddy Company Email (ADMIN_EMAIL from .env)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== "hello.enteropia@gmail.com") {
      emailPromises.push(
        sendMail({
          to: process.env.ADMIN_EMAIL,
          subject: `[New Referral Submission] Partner ${referrerName} referred ${clientBusinessName}`,
          html: adminEmailHtml,
        })
      );
    }

    // 3. Send confirmation to the referrer
    emailPromises.push(
      sendMail({
        to: referrerEmail,
        subject: `Thank you for your referral to enteropia!`,
        html: referrerEmailHtml,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json(
      {
        success: true,
        message: "Referral submitted successfully! A confirmation email has been sent, and we'll track progress to pay your commission.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating referral submission:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit referral form" },
      { status: 500 }
    );
  }
}
