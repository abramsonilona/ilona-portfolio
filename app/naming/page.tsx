import NamingClient from "./NamingClient";

export const metadata = {
  title: "Naming | אילונה אברמסון",
  description: "תהליך הניימינג: מ-DNA המותג ועד לשם שנשאר.",
  robots: { index: false, follow: false },
};

export default function NamingPage() {
  return <NamingClient />;
}
