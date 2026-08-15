import type { Metadata } from "next";
import "./globals.css";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    default: "Servixo Solutions KFT — Enterprise IT Services & Products",
    template: "%s | Servixo Solutions KFT",
  },
  description:
    "Premium B2B IT services and software products based in Budapest, Hungary. Cloud migration, custom software development, cybersecurity, and strategic IT consulting.",
  keywords: ["IT services", "cloud migration", "custom software", "cybersecurity", "Budapest", "Hungary", "B2B", "enterprise"],
  authors: [{ name: "Servixo Solutions KFT" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://servixo.hu",
    siteName: "Servixo Solutions KFT",
  },
};

import { dbFetchWithTimeout } from '@/lib/dbFetch';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch default theme from settings, fallback to 'light'
  let defaultTheme = "light";
  try {
    const themeSetting = await dbFetchWithTimeout(prisma.setting.findUnique({
      where: { key: "defaultTheme" },
    }), 2000);
    if (themeSetting?.value) {
      defaultTheme = themeSetting.value;
    }
  } catch (error) {
    console.error("Error fetching theme:", error);
  }

  const htmlClasses = `h-full antialiased ${defaultTheme === "dark" ? "dark" : ""}`.trim();

  return (
    <html lang="en" className={htmlClasses} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
