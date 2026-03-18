import { Metadata } from "next";
import PardavimasClient from "./PardavimasClient";

export const metadata: Metadata = {
  title: "Pardavimas | Mantas Katkevičius NT platforma",
  description: "Aiški strategija, stipri prezentacija ir pardavimo vidurkis - vos 6 savaitės. Sužinokite, kaip parduosime Jūsų NT.",
};

export default function PardavimasPage() {
  return <PardavimasClient />;
}
