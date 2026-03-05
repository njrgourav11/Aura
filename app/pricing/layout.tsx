import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing — Freelance Software Plans for Every Freelancer & Agency",
    description:
        "FreelanceOS pricing starts at $9/month. Compare Starter, Pro, and Agency plans. The most affordable Bonsai and HoneyBook alternative for freelancers, consultants, and creative agencies. Start free, no credit card required.",
    keywords: [
        "freelance software pricing",
        "invoice software pricing",
        "freelance contract software price",
        "bonsai pricing alternative",
        "honeybook pricing alternative",
        "dubsado alternative pricing",
        "affordable freelance tools",
        "freelance CRM cost",
        "freelancer app pricing",
        "client management software cost",
    ],
    alternates: {
        canonical: "https://www.freelanceos.app/pricing",
    },
    openGraph: {
        title: "FreelanceOS Pricing — Plans for Freelancers & Agencies",
        description:
            "Affordable freelance management software starting at $9/month. Contracts, invoices, client portal, and analytics. Better than Bonsai, HoneyBook, and Dubsado.",
        url: "https://www.freelanceos.app/pricing",
        type: "website",
    },
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
