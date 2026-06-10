// Place at: src/app/privacy-policy/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy | enteropia",
    description:
        "Read enteropia's Privacy Policy to understand how we collect, use, and protect your personal information.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
    subtitle?: string;
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
        id: "information-we-collect",
        title: "1. Information We Collect",
        content: [
            {
                subtitle: "1.1 Information You Provide",
                text: "We collect information you voluntarily provide when you contact us, request a consultation, submit a form, or engage with our services. This includes your name, email address, phone number, company name, and any other details you choose to share.",
            },
            {
                subtitle: "1.2 Information Collected Automatically",
                text: "When you visit our website, we automatically collect certain technical information such as your IP address, browser type, device type, operating system, referring URLs, and pages visited. This data is collected using cookies and similar tracking technologies.",
            },
            {
                subtitle: "1.3 Communications Data",
                text: "If you contact us via email or our contact form, we retain records of that correspondence to provide you with support and improve our services.",
            },
        ],
    },
    {
        id: "how-we-use",
        title: "2. How We Use Your Information",
        content: [
            {
                text: "We use the information we collect for the following purposes:",
                list: [
                    "To respond to your inquiries and provide requested services",
                    "To send service-related communications, updates, and notifications",
                    "To improve our website's functionality, performance, and user experience",
                    "To analyse usage patterns and understand how visitors interact with our platform",
                    "To comply with applicable legal obligations and enforce our agreements",
                    "To send marketing communications where you have provided consent",
                ],
            },
        ],
    },
    {
        id: "sharing",
        title: "3. Sharing Your Information",
        content: [
            {
                text: "We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following limited circumstances:",
                list: [
                    "With trusted service providers who assist in operating our website, subject to strict confidentiality obligations",
                    "When required by law, regulation, or legal process",
                    "To protect the rights, property, or safety of enteropia, our clients, or others",
                    "In connection with a merger, acquisition, or sale of business assets, with appropriate notice",
                ],
            },
        ],
    },
    {
        id: "cookies",
        title: "4. Cookies & Tracking Technologies",
        content: [
            {
                text: "We use cookies and similar technologies to enhance your experience. These include:",
                list: [
                    "Essential cookies required for basic website functionality",
                    "Analytics cookies to understand how our site is used (e.g. page views, traffic sources)",
                    "Preference cookies to remember your settings and customisations",
                ],
            },
            {
                text: "You may disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website.",
            },
        ],
    },
    {
        id: "data-retention",
        title: "5. Data Retention",
        content: [
            {
                text: "We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. When your data is no longer needed, we securely delete or anonymise it.",
            },
        ],
    },
    {
        id: "your-rights",
        title: "6. Your Rights",
        content: [
            {
                text: "Depending on your location and applicable data protection laws, you may have the following rights:",
                list: [
                    "Right to access — request a copy of the personal data we hold about you",
                    "Right to correction — request that we correct inaccurate or incomplete data",
                    "Right to erasure — request deletion of your personal data",
                    "Right to restriction — request that we limit how we process your data",
                    "Right to object — object to certain types of data processing",
                    "Right to data portability — receive your data in a structured, commonly used format",
                    "Right to withdraw consent — where processing is based on consent, withdraw it at any time",
                ],
            },
            {
                text: "To exercise any of these rights, please contact us at info@enteropia.com.",
            },
        ],
    },
    {
        id: "security",
        title: "7. Data Security",
        content: [
            {
                text: "We implement industry-standard technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. These include encrypted data transmission, access controls, and regular security audits.",
            },
        ],
    },
    {
        id: "third-party",
        title: "8. Third-Party Links",
        content: [
            {
                text: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.",
            },
        ],
    },
    {
        id: "children",
        title: "9. Children's Privacy",
        content: [
            {
                text: "Our website and services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have done so inadvertently, please contact us and we will delete it.",
            },
        ],
    },
    {
        id: "changes",
        title: "10. Changes to This Policy",
        content: [
            {
                text: "We may update this Privacy Policy periodically. When we make material changes, we will update the effective date at the top of this page. We encourage you to review this policy regularly.",
            },
        ],
    },
    {
        id: "contact",
        title: "11. Contact Us",
        content: [
            {
                text: "If you have any questions or requests regarding this Privacy Policy, please contact us:",
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

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-gray-200">
            {/* ── Hero ── */}
            <section className="border-b border-violet-500/15 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.12),transparent)] px-6 py-20 text-center">
                <span className="mb-5 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
                    Legal
                </span>
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Privacy Policy
                </h1>
                <p className="mx-auto mb-5 max-w-lg text-base leading-relaxed text-gray-400">
                    Your privacy matters to us. This policy explains how enteropia
                    collects, uses, and safeguards your personal information.
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
                        enteropia (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
                        committed to protecting the privacy of individuals who visit{" "}
                        <a
                            href="https://enteropia.com"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            enteropia.com
                        </a>{" "}
                        and interact with our services. This policy describes how we
                        collect, use, disclose, and protect your personal information in
                        accordance with applicable data protection laws.
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
                                    {block.subtitle && (
                                        <h3 className="mb-2 mt-4 text-sm font-medium text-violet-300">
                                            {block.subtitle}
                                        </h3>
                                    )}
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
                            href="/terms"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Terms of Service
                        </Link>{" "}
                        for the rules governing use of our site and services.
                    </div>
                </article>
            </div>
        </main>
    );
}