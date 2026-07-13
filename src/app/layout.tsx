import type { Metadata } from "next";
import "boxicons/css/boxicons.min.css";
import "./globals.css";
import { MainLayout } from "../components/MainLayout";

export const metadata: Metadata = {
  title: "WJEXSTUDIO OS - Next Generation",
  description: "The premium, agentic operating system. A sleek and high-performance foundation.",
};

import { Providers } from "../components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
