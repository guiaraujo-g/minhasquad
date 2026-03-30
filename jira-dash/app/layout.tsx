import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Produtividade Jira",
  description: "Dashboard SSR de produtividade (AL, N3, INTS, IOAM)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
