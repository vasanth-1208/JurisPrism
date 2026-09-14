import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DisclaimerBanner from "../components/layout/DisclaimerBanner";

export const metadata: Metadata = {
  title: "JurisPrism | Legal Document Intelligence & Decision Preparation",
  description:
    "AI-powered legal document analysis and decision navigation. Understand obligations, illuminate high-risk clauses, extract deadline timelines, and generate attorney preparation kits.",
  keywords: [
    "legal document analysis",
    "contract review",
    "AI legal assistant",
    "plain language legal",
    "decision navigator",
    "attorney preparation kit",
    "legal tech",
  ],
  authors: [{ name: "JurisPrism Intelligence" }],
  openGraph: {
    title: "JurisPrism | Legal Document Intelligence & Decision Preparation",
    description: "Transform complex contracts into plain language, illuminated risks, and structured attorney briefing packages.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
