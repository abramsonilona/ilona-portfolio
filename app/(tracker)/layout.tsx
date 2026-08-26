import type { Metadata, Viewport } from "next";
import "./tracker.css";
import { TrackerProvider } from "@/lib/tracker/store";
import BottomNav from "@/components/tracker/BottomNav";

export const metadata: Metadata = {
  title: "Points Tracker",
  description: "A simple, personal food point tracker.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf6f1",
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <TrackerProvider>
          <div className="mx-auto min-h-screen max-w-md pb-24">{children}</div>
          <BottomNav />
        </TrackerProvider>
      </body>
    </html>
  );
}
