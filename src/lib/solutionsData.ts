export interface SolutionItem {
    id: string;
    title: string;
    description: string;
    image: string;
    iconName: string;
    features: string[];
    startingPrice: string;
    learnMoreUrl: string;
}

export const solutions: SolutionItem[] = [
    {
        id: "small-business-it",
        title: "Small Business IT Starter",
        description: "Complete IT infrastructure package designed for growing businesses with 10-50 employees. Includes server setup, network configuration, email, and basic security.",
        image: "/illustrations/software-solutions.png",
        iconName: "Server",
        features: [
            "Server setup & management",
            "Office network configuration",
            "Email & collaboration tools",
            "Basic firewall & security",
            "Remote support (business hours)"
        ],
        startingPrice: "₹35,000",
        learnMoreUrl: "/#contact"
    },
    {
        id: "school-education-network",
        title: "School & Education Network",
        description: "Secure campus-wide IT infrastructure with student device management, content filtering, and compliance with educational data protection requirements.",
        image: "/illustrations/networking-security.png",
        iconName: "GraduationCap",
        features: [
            "Campus network design",
            "Student device management",
            "Content filtering & monitoring",
            "Lab computer management",
            "Staff email & collaboration"
        ],
        startingPrice: "₹50,000",
        learnMoreUrl: "/#contact"
    },
    {
        id: "hospital-it-security",
        title: "Hospital IT Security",
        description: "HIPAA-grade healthcare IT infrastructure with advanced security, patient data protection, and 24/7 system availability for critical care environments.",
        image: "/illustrations/app-solutions.png",
        iconName: "ShieldAlert",
        features: [
            "HIPAA compliance framework",
            "Patient data encryption",
            "24/7 system monitoring",
            "Disaster recovery",
            "Secure remote access for staff"
        ],
        startingPrice: "₹1,49,000",
        learnMoreUrl: "/#contact"
    },
    {
        id: "retail-chain-infrastructure",
        title: "Retail Chain Infrastructure",
        description: "Multi-location retail IT management with POS systems, inventory integration, secure payment processing, and centralized management.",
        image: "/illustrations/digital-media.png",
        iconName: "Store",
        features: [
            "Multi-location network",
            "POS system integration",
            "Payment security (PCI-DSS)",
            "CCTV & security systems",
            "Centralized management"
        ],
        startingPrice: "₹75,000",
        learnMoreUrl: "/#contact"
    },
    {
        id: "startup-cloud-foundation",
        title: "Startup Cloud Foundation",
        description: "Cloud-native IT foundation for startups with scalable architecture, CI/CD pipelines, and cost-optimized cloud resource management.",
        image: "/illustrations/cloud-infrastructure.png",
        iconName: "Rocket",
        features: [
            "Cloud first architecture",
            "CI/CD pipeline setup",
            "Scalable infrastructure",
            "DevOps tooling",
            "Cost optimization"
        ],
        startingPrice: "₹85,000",
        learnMoreUrl: "/#contact"
    }
];