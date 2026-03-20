import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('nt_objektai').select('*');
    
    if (error) throw error;

    const mapped = (data || [])
      .filter(p => p.is_public !== false) // Filtruojame paslėptus objektus
      .map(p => {
       const gallery = p.nuotraukos_urls ? (typeof p.nuotraukos_urls === 'string' ? JSON.parse(p.nuotraukos_urls) : p.nuotraukos_urls) : [];
       const title = p.pavadinimas || "";
       
       const image = gallery[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"; 
       
       return {
         id: p.id,
         title: title,
         city: p.miestas || "Kaunas",
         address: p.address || "",
         price: Number(p.kaina) || 0,
         status: p.statusas || "Parduodama",
         description: p.aprasymas || "",
         gallery: gallery,
         image: image,
         area: p.plotas || 0,
         type: p.type || (title.toLowerCase().includes("butas") ? "Butas" : title.toLowerCase().includes("namas") ? "Namas" : title.toLowerCase().includes("sklypas") ? "Sklypas" : "Butas"),
         rooms: p.rooms || 0,
         floor: p.floor || "",
         year: p.year || 0,
         arai: p.arai || 0,
         heating: p.heating || "",
         privalumai: p.privalumai || [],
         slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
       };
    });

    return NextResponse.json(mapped, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error("API /api/properties Error:", err);
    return NextResponse.json({ error: "Nepavyko užkrauti objektų iš Supabase" }, { status: 500 });
  }
}
