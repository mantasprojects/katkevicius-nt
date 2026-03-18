import { Metadata } from "next";
import NuomaClient from "./NuomaClient";

export const metadata: Metadata = {
  title: "Nuoma | Mantas Katkevičius NT platforma",
  description: "Atranka ir sutartys be rizikų: patikimi nuomininkai ilgalaikei nuomai. Profesionalus administravimas.",
};

export default function NuomaPage() {
  return <NuomaClient />;
}
