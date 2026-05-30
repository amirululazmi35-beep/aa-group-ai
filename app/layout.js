import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AA AI GROUP - Premium AI Digital Ecosystem Platform",
  description: "Beli aplikasi premium, video pendidikan AI, servis digital, dan akses keahlian premium secara automatik.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
