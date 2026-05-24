export interface IndustryItem {
    id: string;
    title: string;
    description: string;
    iconName: string;
    link: string;
}

export const industries: IndustryItem[] = [
    {
        id: "small-medium-business",
        title: "Small & Medium Business",
        description: "Cost-effective IT solutions that grow with your business. From basic infrastructure to advanced cloud services.",
        iconName: "Building2",
        link: "/solutions"
    },
    {
        id: "education",
        title: "Education",
        description: "Secure campus networks, student device management, and digital classroom solutions for schools and universities.",
        iconName: "GraduationCap",
        link: "/solutions"
    },
    {
        id: "healthcare",
        title: "Healthcare",
        description: "HIPAA-compliant IT infrastructure with patient data protection, secure access, and 24/7 system availability.",
        iconName: "ShieldPlus",
        link: "/solutions"
    },
    {
        id: "retail",
        title: "Retail",
        description: "Multi-location POS systems, inventory management integration, and secure payment processing infrastructure.",
        iconName: "ShoppingCart",
        link: "/solutions"
    },
    {
        id: "startups",
        title: "Startups",
        description: "Cloud-native foundations with scalable architecture, DevOps tooling, and rapid deployment capabilities.",
        iconName: "Rocket",
        link: "/solutions"
    },
    {
        id: "manufacturing",
        title: "Manufacturing",
        description: "Industrial IoT integration, OT security, and robust network infrastructure for smart factory operations.",
        iconName: "Factory",
        link: "/solutions"
    },
    {
        id: "banking-finance",
        title: "Banking & Finance",
        description: "Regulatory-compliant security, high-availability infrastructure, and secure transaction processing systems.",
        iconName: "Landmark",
        link: "/solutions"
    },
    {
        id: "professional-services",
        title: "Professional Services",
        description: "Secure client data management, collaboration tools, and remote work infrastructure for consulting firms.",
        iconName: "Briefcase",
        link: "/solutions"
    },
    {
        id: "logistics-transport",
        title: "Logistics & Transport",
        description: "Fleet management systems, warehouse automation, and real-time tracking infrastructure.",
        iconName: "Truck",
        link: "/solutions"
    },
    {
        id: "hospitality",
        title: "Hospitality",
        description: "Property management systems, guest WiFi, POS integration, and booking platform infrastructure.",
        iconName: "Utensils",
        link: "/solutions"
    }
];