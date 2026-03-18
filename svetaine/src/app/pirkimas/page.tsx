import { Metadata } from "next";
import PirkimasClient from "./PirkimasClient";

export const metadata: Metadata = {
  title: "Pirkimas | Mantas Katkevičius NT platforma",
  description: "Nuodugnus pirkimo procesas, asmeninis dėmesys ir saugumo garantija Jūsų naujamiems namams. Nuo paieškos iki sandorio.",
};

export default function PirkimasPage() {
  return <PirkimasClient />;
}

