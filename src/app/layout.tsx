import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
