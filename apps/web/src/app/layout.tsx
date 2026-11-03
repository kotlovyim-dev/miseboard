import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { fetchRole } from "@/lib/role/fetch-role";
import { Providers } from "./providers";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MiseBoard",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${geistMono.variable}`}
    >
      <body>
        <Providers role={await fetchRole()}>{children}</Providers>
      </body>
    </html>
  );
}
