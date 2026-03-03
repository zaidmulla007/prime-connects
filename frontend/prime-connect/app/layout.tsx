import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import ConsultationModal from "./components/ConsultationModal";
import { LanguageProvider } from "./context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Connect | Doors & Cabinets Solutions",
  description: "Multinational manufacturer of doors, panels, and cabinetry serving commercial, residential, hospitality, education, and healthcare projects. 25+ years of excellence.",
  keywords: "doors, cabinets, panels, manufacturing, UAE, China, construction, interior",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
          <ConsultationModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
