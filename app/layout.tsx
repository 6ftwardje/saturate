import type { Metadata } from "next";
import "./globals.css";
import { SaturateBrandBackdrop } from "@/components/SaturateBrandBackdrop";

export const metadata: Metadata = {
  title: "Saturate Academy",
  description: "From videographer to profitable creative partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="font-sans antialiased font-light bg-[#000000] text-white">
        <SaturateBrandBackdrop />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
