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
            .gradient-bar { height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #a855f7 100%); }
            .content { padding: 40px 32px; }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
            .logo span { color: #3b82f6; }
            .title-container { text-align: center; margin-bottom: 32px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; }
            .badge { display: inline-block; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 6px 14px; border-radius: 9999px; margin-top: 10px; }
            .section-title { font-size: 12px; color: #a855f7; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 28px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px; }
            .info-grid { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; }
            .info-row { margin-bottom: 14px; }
            .info-row:last-child { margin-bottom: 0; }
            .label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 14px; color: #cbd5e1; font-weight: 500; }
            .message-box { background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 10px; padding: 20px; font-size: 14px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; margin-bottom: 32px; }
            .btn-container { text-align: center; margin-bottom: 12px; margin-top: 28px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2); }
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
                  <div class="title">New Referral Submission</div>
                  <div class="badge">Referral Received</div>
                </div>
                
                <div class="section-title">Referrer Information (Partner)</div>
                <div class="info-grid">
                  <div class="info-row">
                    <div class="label">Name</div>
                    <div class="value">${referrerName}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Email Address</div>
                    <div class="value">${referrerEmail}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Phone</div>
                    <div class="value">${referrerPhone || "Not Provided"}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">UPI ID / Bank Details</div>
                    <div class="value">${referrerUpiOrBank}</div>
                  </div>
                </div>

                <div class="section-title">Referred Client Information</div>
                <div class="info-grid">
                  <div class="info-row">
                    <div class="label">Business Name</div>
                    <div class="value">${clientBusinessName}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Contact Person</div>
                    <div class="value">${clientContactName}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Client Email</div>
                    <div class="value">${clientEmail}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">Client Phone</div>
                    <div class="value">${clientPhone || "Not Provided"}</div>
                  </div>
                </div>
                
                <div class="section-title">Project Scope / Requirements</div>
                <div class="message-box">${projectScope}</div>
                
                <div class="btn-container">
                  <a href="mailto:${clientEmail}?subject=IT & Software Solutions inquiry - enteropia" class="btn">Reach Out to Client</a>
                </div>
                
                <div class="footer">
                  This message was sent automatically from the enteropia Partner Portal.<br>
                  &copy; ${new Date().getFullYear()} enteropia. All rights reserved.
                </div>
              </div>
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #0c0414; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .wrapper { width: 100%; background-color: #0c0414; padding: 40px 20px; box-sizing: border-box; }
            .card { max-width: 600px; margin: 0 auto; background-color: #140827; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); }
            .gradient-bar { height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #a855f7 100%); }
            .content { padding: 40px 32px; }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
            .logo span { color: #3b82f6; }
            .title-container { text-align: center; margin-bottom: 28px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; }
            .subtitle { font-size: 12px; color: #a78bfa; margin-top: 6px; text-transform: uppercase; letter-spacing: 1.5px; }
            .greeting { font-size: 16px; color: #ffffff; font-weight: 600; margin-bottom: 14px; }
            .body-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px; }
            .summary-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin-bottom: 28px; }
            .summary-title { font-size: 11px; color: #60a5fa; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; }
            .summary-row { margin-bottom: 10px; font-size: 13px; color: #cbd5e1; }
            .summary-row:last-child { margin-bottom: 0; }
            .summary-row strong { color: #ffffff; }
            .step-container { margin: 28px 0; }
            .step { display: flex; align-items: flex-start; margin-bottom: 18px; }
            .step:last-child { margin-bottom: 0; }
            .step-num { width: 24px; height: 24px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%); color: #fff; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px; margin-right: 14px; flex-shrink: 0; }
            .step-content { font-size: 13px; color: #cbd5e1; line-height: 1.5; }
            .step-title { font-weight: 600; color: #ffffff; margin-bottom: 3px; }
            .contact-info { background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 18px; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5; }
            .contact-info a { color: #60a5fa; text-decoration: none; font-weight: 600; }
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
                  <div class="title">Thank You For Your Referral</div>
                  <div class="subtitle">Referral Partner Program</div>
                </div>
                
                <div class="greeting">Hi ${referrerName},</div>
                
                <div class="body-text">
                  We appreciate you recommending enteropia. Our enterprise accounts team is already reviewing the referral details and will reach out to the client.
                </div>
                
                <div class="summary-card">
                  <div class="summary-title">Submission Receipt</div>
                  <div class="summary-row"><strong>Date Submitted:</strong> ${timestamp}</div>
                  <div class="summary-row"><strong>Referred Client:</strong> ${clientBusinessName} (${clientContactName})</div>
                  <div class="summary-row"><strong>Estimated Commission:</strong> 10% on signed contract value</div>
                  <div class="summary-row"><strong>Your Payment ID:</strong> ${referrerUpiOrBank}</div>
                </div>
 
                <div class="greeting" style="font-size: 16px; text-align: left; margin-bottom: 12px; margin-top: 24px;">What Happens Next?</div>
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
                      <div class="step-title">Your Commission Payout</div>
                      As soon as the client pays their invoice, your 10% commission is immediately paid directly to your registered Bank/UPI account. No caps!
                    </div>
                  </div>
                </div>
                
                <div class="contact-info" style="margin-top: 28px;">
                  Have questions about your referral or tracking? Reach us at<br>
                  <strong>Email:</strong> <a href="mailto:info@enteropia.com">info@enteropia.com</a> &nbsp;|&nbsp; 
                  <strong>Hotline:</strong> <a href="tel:+919900112530">+91 9900112530</a>
                </div>
                
                <div class="footer">
                  This is an automated confirmation of your referral submission.<br>
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
        subject: `[New Referral Submission] Partner ${referrerName} referred ${clientBusinessName}`,
        html: adminEmailHtml,
        fromName: `${referrerName} <${referrerEmail}>`,
        replyTo: referrerEmail,
      })
    );

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
