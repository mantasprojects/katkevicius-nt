import { Metadata } from "next";
import ObjektaiClientView from "./ObjektaiClientView";
import { getProperties } from "@/utils/properties";

export const metadata: Metadata = {
  title: "NT Objektai | Mantas Katkevičius NT platforma",
  description: "Aktualūs parduodami ir nuomojami nekilnojamojo turto objektai. Naršykite katalogą ir raskite tai, ko ieškote.",
};

export default async function ObjektaiPage() {
  const properties = await getProperties();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Header */}
      <section className="bg-background pt-12 text-center pb-12 border-b border-border">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-sans font-weight font-bold text-foreground tracking-tight">
            Parduodami objektai
          </h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container px-4 mx-auto max-w-7xl">
          <ObjektaiClientView initialProperties={properties} />
        </div>
      </section>
    </div>
  );
}
