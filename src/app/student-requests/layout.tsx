import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests - MGS VIDYALA",
  description: "View your feature requests, bug reports, and other request types.",
};

export default function RequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 