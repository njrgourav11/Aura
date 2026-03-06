import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "FreelanceOS";
const APP_URL = "https://www.freelanceos.app";
const APP_DESCRIPTION =
  "FreelanceOS is the all-in-one freelancer operating system. Create contracts, send invoices, track payments, manage clients, and run analytics — all from one powerful platform. The best Bonsai, HoneyBook, and Dubsado alternative.";
const KEYWORDS = [
  // Core product
  "freelance software", "freelancer os", "freelance management tool", "freelance platform",
  "freelance business tool", "all in one freelance tool",
  // Contracts
  "freelance contract generator", "online contract maker", "service agreement template",
  "freelance contract software", "client contract generator", "digital contract signing",
  // Invoicing
  "freelance invoice generator", "invoice software for freelancers", "online invoice maker",
  "free invoice generator", "professional invoice template", "invoice tracking software",
  "billing software for freelancers",
  // Payments
  "freelance payment tracking", "get paid as freelancer", "payment reconciliation",
  "freelance payment software", "razorpay invoicing",
  // CRM
  "freelance CRM", "client management software", "freelance client portal",
  "client relationship management freelancers",
  // Analytics
  "freelance revenue tracker", "freelance income tracker",
  "freelance tax calculator", "freelance financial dashboard",
  // Competitor alternatives
  "bonsai alternative", "honeybook alternative", "dubsado alternative",
  "wave apps alternative", "freshbooks alternative", "quickbooks alternative",
  "and.co alternative", "invoice ninja alternative", "fiverr workspace alternative",
  // Target audience
  "freelancer tools 2025", "tools for freelancers", "software for freelancers",
  "tools for creative agencies", "tools for consultants", "tools for independent contractors",
  "tools for solopreneurs", "freelance agency software", "small business invoicing",
  // Long-tail
  "best freelance management software 2025", "free freelance invoicing software",
  "how to create freelance contracts", "freelance business operating system",
  "manage freelance clients online", "automated invoicing for freelancers",
  "freelance project management tool",
];

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: "FreelanceOS — The All-In-One Freelancer Operating System",
    template: `%s | FreelanceOS`,
  },
  description: APP_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "FreelanceOS", url: APP_URL }],
  creator: "FreelanceOS",
  publisher: "FreelanceOS",
  category: "Business Software",
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: APP_NAME,
    title: "FreelanceOS — Contracts, Invoices & Client Management for Freelancers",
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FreelanceOS — The Freelancer Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceOS — The Freelancer Operating System",
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: "@FreelanceOS",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "b4e94f568e47eb12",
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-50 min-h-screen antialiased overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
