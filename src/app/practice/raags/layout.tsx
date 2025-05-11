import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raags | Practice",
  description: "Learn about the Raags used in Gurbani Kirtan",
};

export default function RaagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 