// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper"; // 👈 Client Component import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard App",
  description: "My Next.js dashboard layout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#141421", color: "white" }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
