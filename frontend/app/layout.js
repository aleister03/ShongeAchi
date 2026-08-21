import { Barlow } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata = {
  title: "Shonge Achi",
  description: "Elderly wellbeing monitoring platform",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-[family-name:var(--font-barlow)]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
