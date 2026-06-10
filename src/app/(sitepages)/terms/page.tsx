// Place at: src/app/terms/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service | enteropia",
    description:
        "Read enteropia's Terms of Service — the rules and guidelines governing use of our website and services.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
    text?: string;
    list?: string[];
    contactDetails?: boolean;
}

interface Section {
    id: string;
    title: string;
    content: ContentBlock[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const sections: Section[] = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: [
            {
                text: 'By accessing or using the enteropia website at enteropia.com (the "Site") or any services provided by enteropia ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our Site or Services.',
            },
            {
                text: "These Terms apply to all visitors, users, and clients. We reserve the right to update or modify these Terms at any time. Continued use of the Site after any changes constitutes acceptance of the revised Terms.",
            },
        ],
    },
    {
        id: "services",
        title: "2. Description of Services",
        content: [
            {
                text: "enteropia provides enterprise software engineering, cloud-native infrastructure, IT infrastructure, cybersecurity, digital transformation, and related technology consulting services. The specific scope, deliverables, timelines, and fees for any engagement are defined in separate written agreements.",
            },
        ],
    },
    {
        id: "use",
        title: "3. Permitted Use",
        content: [
            {
                text: "You agree to use the Site and Services only for lawful purposes and in accordance with these Terms. You must not:",
                list: [
                    "Use the Site in any way that violates applicable local, national, or international law",
                    "Transmit unsolicited or unauthorised advertising or promotional material",
                    "Attempt to gain unauthorised access to any part of the Site or its related systems",
                    "Introduce viruses, malware, or any other harmful code or material",
                    "Scrape, crawl, or extract data from the Site without prior written permission",
                    "Impersonate any person or entity, or misrepresent your affiliation",
                    "Engage in any conduct that restricts or inhibits others from using the Site",
                ],
            },
        ],
    },
    {
        id: "ip",
        title: "4. Intellectual Property",
        content: [
            {
                text: "All content on the Site — including text, graphics, logos, icons, images, software, and code — is the property of enteropia or its licensors and is protected by applicable intellectual property laws.",
            },
            {
                text: "You may not reproduce, distribute, modify, or exploit any content from the Site without our prior written permission. Work product developed for clients under a separate agreement is governed by that agreement's IP provisions.",
            },
        ],
    },
    {
        id: "disclaimer",
        title: "5. Disclaimer of Warranties",
        content: [
            {
                text: 'The Site and its content are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. enteropia expressly disclaims all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
            },
            {
                text: "We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.",
            },
        ],
    },
    {
        id: "liability",
        title: "6. Limitation of Liability",
        content: [
            {
                text: "To the fullest extent permitted by applicable law, enteropia and its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Site or Services.",
            },
            {
                text: "Our total liability for any claim shall not exceed the amount paid by you to enteropia in the twelve months preceding the claim, or INR 1,000, whichever is greater.",
            },
        ],
    },
    {
        id: "indemnification",
        title: "7. Indemnification",
        content: [
            {
                text: "You agree to indemnify, defend, and hold harmless enteropia and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of your use of the Site, your violation of these Terms, or your infringement of any third-party rights.",
            },
        ],
    },
    {
        id: "third-party",
        title: "8. Third-Party Links & Services",
        content: [
            {
                text: "The Site may contain links to third-party websites not owned or controlled by enteropia. We assume no responsibility for the content, privacy policies, or practices of any third-party sites and encourage you to review their terms.",
            },
        ],
    },
    {
        id: "confidentiality",
        title: "9. Confidentiality",
        content: [
            {
                text: "Non-public information shared with enteropia in the context of a business enquiry or client engagement will be treated as confidential and not disclosed to third parties without consent, except as required by law. Specific confidentiality terms for client engagements are governed by the applicable service agreement.",
            },
        ],
    },
    {
        id: "governing-law",
        title: "10. Governing Law & Jurisdiction",
        content: [
            {
                text: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Bengaluru, Karnataka, India.",
            },
        ],
    },
    {
        id: "termination",
        title: "11. Termination",
        content: [
            {
                text: "We reserve the right to terminate or suspend your access to the Site at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Site will immediately cease.",
            },
        ],
    },
    {
        id: "changes",
        title: "12. Changes to Terms",
        content: [
            {
                text: "We may revise these Terms at any time by updating this page. Changes are effective immediately upon posting. Your continued use of the Site following any changes constitutes acceptance of the updated Terms.",
            },
        ],
    },
    {
        id: "contact",
        title: "13. Contact Us",
        content: [
            {
                text: "If you have any questions about these Terms of Service, please reach out to us:",
                contactDetails: true,
            },
        ],
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContactCard() {
    return (
        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
            {[
                { label: "Company", value: "enteropia" },
                {
                    label: "Email",
                    value: (
                        <a
                            href="mailto:info@enteropia.com"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            info@enteropia.com
                        </a>
                    ),
                },
                {
                    label: "Alt Email",
                    value: (
                        <a
                            href="mailto:hello.enteropia@gmail.com"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            hello.enteropia@gmail.com
                        </a>
                    ),
                },
                {
                    label: "Phone",
                    value: (
                        <a
                            href="tel:+919900112530"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            +91 9900112530
                        </a>
                    ),
                },
                { label: "Location", value: "Bengaluru, Karnataka, India" },
            ].map((row, i) => (
                <div
                    key={i}
                    className="flex gap-4 border-b border-white/5 py-2 text-sm last:border-0"
                >
                    <span className="w-24 shrink-0 font-medium text-gray-500">
                        {row.label}
                    </span>
                    <span className="text-gray-300">{row.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-gray-200">
            {/* ── Hero ── */}
            <section className="border-b border-violet-500/15 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.12),transparent)] px-6 py-20 text-center">
                <span className="mb-5 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
                    Legal
                </span>
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Terms of Service
                </h1>
                <p className="mx-auto mb-5 max-w-lg text-base leading-relaxed text-gray-400">
                    Please read these terms carefully before using the enteropia website
                    or engaging with our services.
                </p>
                <p className="text-sm text-gray-500">Effective Date: January 1, 2026</p>
            </section>

            {/* ── Layout ── */}
            <div className="mx-auto grid max-w-5xl gap-14 px-6 py-16 md:grid-cols-[200px_1fr] lg:gap-20">
                {/* Sidebar TOC */}
                <aside className="hidden md:block">
                    <div className="sticky top-28">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                            On This Page
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            {sections.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="border-l-2 border-violet-500/20 py-1.5 pl-3 text-[13px] leading-snug text-gray-400 transition-colors hover:border-violet-400 hover:text-violet-300"
                                >
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Article */}
                <article className="min-w-0">
                    <p className="mb-10 border-b border-white/5 pb-8 text-sm leading-7 text-gray-400">
                        These Terms of Service govern your use of the enteropia website and
                        services. By accessing our site or engaging with our services, you
                        agree to be legally bound by these terms. enteropia is registered
                        and operated from Bengaluru, Karnataka, India.
                    </p>

                    {sections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="mb-10 border-b border-white/5 pb-10"
                        >
                            <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
                                {section.title}
                            </h2>

                            {section.content.map((block, i) => (
                                <div key={i}>
                                    {block.text && (
                                        <p className="mb-3 text-sm leading-7 text-gray-400">
                                            {block.text}
                                        </p>
                                    )}
                                    {block.list && (
                                        <ul className="my-3 space-y-2.5">
                                            {block.list.map((item, j) => (
                                                <li
                                                    key={j}
                                                    className="flex items-start gap-3 text-sm leading-6 text-gray-400"
                                                >
                                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {block.contactDetails && <ContactCard />}
                                </div>
                            ))}
                        </section>
                    ))}

                    <div className="mt-10 rounded-xl border border-violet-500/15 bg-violet-500/5 p-5 text-sm text-gray-400">
                        Also read our{" "}
                        <Link
                            href="/privacy-policy"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Privacy Policy
                        </Link>{" "}
                        to understand how we handle your personal data.
                    </div>
                </article>
            </div>
        </main>
    );
}