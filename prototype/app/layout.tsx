import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAG-NETic Platform Prototype",
  description: "Prototype for the MAG-NETic platform website, spaces, events, community, and administration flows.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
