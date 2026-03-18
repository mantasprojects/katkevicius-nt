import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nemokama NT Konsultacija | Mantas Katkevičius",
  description: "Rezervuokite laiką profesionaliai nekilnojamojo turto konsultacijai.",
};

export default function KonsultacijaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
