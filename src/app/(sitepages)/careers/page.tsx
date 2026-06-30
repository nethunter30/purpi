import React from "react";
import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers & Referral Program | enteropia",
  description:
    "Join the enteropia Partner and Referral Program. Refer businesses needing software development, cloud, or cybersecurity solutions and earn 15-day payouts of 10% commission on signed contracts.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is eligible to participate in the Referral Program?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anyone! Whether you are an existing client, a freelance consultant, an IT professional, or simply someone who knows a business needing high-quality technology solutions, you can submit referrals and earn commissions."
        }
      },
      {
        "@type": "Question",
        "name": "How is the 10% commission calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive exactly 10% of the total signed contract value for the client's initial contract. For example, if a referred business signs a software development contract worth ₹5,00,000, your commission will be ₹50,000."
        }
      },
      {
        "@type": "Question",
        "name": "When and how do I get paid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commissions are paid within 15 days of when the referred client completes their first payment. Payments are sent directly to your registered UPI ID or Bank Account as specified in the referral form."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a limit to how many clients I can refer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, there are absolutely no referral limits or caps on your earnings. You can refer as many qualified businesses as you like, and you will earn a 10% commission on every single one that signs a contract with us."
        }
      },
      {
        "@type": "Question",
        "name": "What qualifies as a 'Qualified Client'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A qualified client is any registered business or startup that has active requirements for software development, IT infrastructure engineering, cloud services, or digital transformation, and proceeds to sign a project contract with enteropia."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CareersClient />
    </>
  );
}
