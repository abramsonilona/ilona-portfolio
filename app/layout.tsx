import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "אילונה אברמסון | מיתוג מילולי",
  description: "אסטרטגיית מיתוג מילולי — שיום, סלוגנים, טון דיבור, קופי. 15 שנות ניסיון בעיתונות ואסטרטגיה.",
  keywords: ["מיתוג מילולי", "קופי", "שיום", "אסטרטגיה", "ברנדינג"],
  alternates: { canonical: "https://ilona-abramson.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head />
      <body>
        <Navigation />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
      </body>
    </html>
  );
}
