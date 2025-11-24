import "./globals.css";
import React, { Suspense } from "react";
import Header from "../components/Header";
import dynamic from "next/dynamic";

// Lazy load Footer only on the client
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: "60vh" }}>
          {children}
        </main>
        {/* Lazy-load Footer, rendered client-side only */}
        <Footer />
      </body>
    </html>
  );
}