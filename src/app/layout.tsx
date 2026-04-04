import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://blogoai.thissidemayur.me"; 
const SITE_NAME = "blogoAI";
const SITE_TITLE = "blogoAI — 6-Agent AI Blog Generator";
const DESCRIPTION =
  "Enter a topic. Six AI agents think, research, plan, write, edit, and review your blog post automatically. Built with OpenAI Agents SDK by Mayur Pal.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const AUTHOR = "Mayur Pal";
const AUTHOR_URL = "https://thissidemayur.me";
const TWITTER = "@thissidemayur";
const KEYWORDS = [
  "AI blog generator",
  "multi-agent AI",
  "OpenAI agents",
  "automated blog writing",
  "AI content creation",
  "Next.js SaaS",
  "Mayur Pal",
  "thissidemayur",
];


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: AUTHOR, url: AUTHOR_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,

  // ── Canonical ──────────────────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: DESCRIPTION,
    images: [
      {
        // ── Basic ──────────────────────────────────────────────────────────────────

        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "blogoAI — 6-Agent AI Blog Generator by Mayur Pal",
      },
    ],
    locale: "en_IN",
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: TWITTER,
    creator: TWITTER,
    title: SITE_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  // ── Manifest ───────────────────────────────────────────────────────────────
  manifest: "/manifest.json",

  // ── Verification (add when you have these) ─────────────────────────────────
  verification: {
    google: "sJj8c0OOiGxeG8QUOsYH5fGynv8D51LNCoghV34xOMw",
    yandex: "37ffaceba88b786d",
    other: {
      me: "https://thissidemayur.me",
    },
  },

  // ── App metadata ───────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  category: "Technology",
};

// ── JSON-LD structured data ───────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Website entity
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: "en-IN",
      author: {
        "@id": `${SITE_URL}/#person`,
      },
    },
    // SoftwareApplication entity
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "1 free blog generation on signup",
      },
      author: {
        "@id": `${SITE_URL}/#person`,
      },
      creator: {
        "@id": `${SITE_URL}/#person`,
      },
      featureList: [
        "6 specialized AI agents",
        "Live web research via Tavily",
        "Real-time streaming blog generation",
        "Real-time streaming output",
        "QA scoring with auto-retry",
        "Markdown export",
      ],
    },
    // Person entity — Mayur Pal
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mayur Pal",
      url: AUTHOR_URL,
      jobTitle: "Full-Stack & DevOps Engineer",
      description:
        "CSE student at Lovely Professional University building high-performance applications with Go, Next.js, and Postgres.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Lovely Professional University",
        url: "https://www.lpu.in",
      },
      sameAs: [
        "https://thissidemayur.me",
        "https://github.com/thissidemayur",
        "https://x.com/thissidemayur",
        "https://linkedin.com/in/thissidemayur",
        "mailto:thissidemayur@gmail.com",
      ],
      knowsAbout: [
        "Go",
        "TypeScript",
        "Next.js",
        "Docker",
        "AI Agents",
        "OpenAI SDK",
        "PostgreSQL",
        "DevOps",
        "Mayur Pal"
      ],
    },
  ],
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Theme color — matches the app background */}
        <meta name="theme-color" content="#09090b" />
        <meta name="color-scheme" content="dark" />

        {/* Mobile web app */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

        {/* Prevent phone number detection */}
        <meta name="format-detection" content="telephone=no" />

        {/* Geo targeting — India */}
        <meta name="geo.region" content="IN-PB" />
        <meta name="geo.placename" content="Jalandhar, Punjab, India" />

        {/* Author attribution — shows up in searches */}
        <meta name="author" content={AUTHOR} />
        <meta name="designer" content={AUTHOR} />
        <meta name="developer" content={AUTHOR} />
        <link rel="author" href={AUTHOR_URL} />
        <link rel="me" href={`https://github.com/thissidemayur`} />
        <link rel="me" href={`https://x.com/thissidemayur`} />
        <link rel="me" href={`https://linkedin.com/in/thissidemayur`} />
        <link rel="me" href={`https://thissidemayur.me`} />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
          <Toaster theme="dark" position="top-right" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
