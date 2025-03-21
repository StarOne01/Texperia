import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Anta } from "next/font/google"; 
const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Texperia",
  description: "Texperia 2025 is happening at SNS College of Technology, Coimbatore, hosted by the Department of Electrical and Electronics Engineering (EEE). This exciting technical event will bring together engineering students and professionals to explore, innovate, and showcase skills in electrical and electronics engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
                    {/* Update the footer with coordinator contacts */}
                    <footer className="relative z-10 py-16 border-t border-blue-900/30 bg-gradient-to-b from-transparent to-blue-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <h3
                className={`text-2xl font-bold mb-4 text-blue-300 ${anta.className}`}
              >
                TEXPERIA
              </h3>
              <p className="text-blue-200/70 mb-6">
                Where technology meets imagination. Join us for an electrifying
                celebration of innovation and engineering excellence.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📘</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📸</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📺</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>🐦</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">
                Student Coordinators
              </h3>
              <ul className="space-y-2">
                <li>
                  <p className="text-blue-200/70">Mr. Abishek. R</p>
                  <p className="text-blue-200/50 text-sm">+91 90038 94744</p>
                </li>
                <li>
                  <p className="text-blue-200/70">Ms.Aboorva.V </p>
                  <p className="text-blue-200/50 text-sm">+91  88383 83199</p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">
                Staff Coordinators
              </h3>
              <ul className="space-y-2">
                <li>
                  <p className="text-blue-200/70">Mr.R.Satheesh kumar AP/EEE</p>
                </li>
                <li>
                  <p className="text-blue-200/70">Mrs.B.Christyjuliet AP/EEE</p>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-blue-300/70">
            TEXPERIA © {new Date().getFullYear()} | made with 💙 by{" "} <a href="https://starone01.github.io" target="_blank" className="text-blue-300 hover:text-blue-200 transition-colors">StarOne01</a>
          </p>
        </div>
      </footer>
      </body>

    </html>
  );
}
