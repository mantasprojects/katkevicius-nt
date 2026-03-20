import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PropertyClientView } from "./PropertyClientView";
import { createClient } from "@/utils/supabase/server";

// Read directly on server from Supabase
const getProperty = async (slug: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('nt_objektai').select('*');
    if (error) throw error;

    const matched = (data || []).find(p => {
       const mappedSlug = (p.pavadinimas || "").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
       return mappedSlug === slug;
    });

    if (!matched) return null;

    // Paslėpti objektai neturi būti matomi viešai
    if (matched.is_public === false) return null;

    const gallery = matched.nuotraukos_urls ? (typeof matched.nuotraukos_urls === 'string' ? JSON.parse(matched.nuotraukos_urls) : matched.nuotraukos_urls) : [];

    return {
      id: matched.id,
      title: matched.pavadinimas,
      city: matched.miestas || "Kaunas",
      price: Number(matched.kaina) || 0,
      description: matched.aprasymas || "",
      image: gallery[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      gallery: gallery,
      status: matched.statusas || "Parduodama",
      area: matched.plotas || 0,
      latitude: matched.latitude,
      longitude: matched.longitude,
      address: matched.address || "",
      is_exact_location: matched.is_exact_location || false,
      rooms: matched.rooms || 0,
      floor: matched.floor || "",
      year: matched.year || 0,
      arai: matched.arai || 0,
      heating: matched.heating || "",
      type: matched.type || "Butas",
      privalumai: matched.privalumai || [],
      slug: slug
    };
  } catch (err) {
    console.error("Failed to load property on server:", err);
    return null;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  
  const siteUrl = "https://katkevicius.lt";
  const defaultTitle = 'Objektas | Mantas Katkevičius NT';
  const defaultDesc = 'Nekilnojamojo turto objektas – profesionalus tarpininkavimas, pardavimas ir nuoma.';

  if (!property) {
    return { 
      title: defaultTitle,
      description: defaultDesc
    };
  }
  
  const title = property.title;
  const city = property.city;
  const address = property.address;
  const description = property.description;

  // SEO Formatas: [Objekto Pavadinimas] pardavimui [City], Kaunas | Mantas Katkevičius
  const metaTitle = `${title} pardavimui ${city === 'Kaunas' ? 'Kaune' : city} | Mantas Katkevičius`;
  const metaDescription = `Parduodamas ${title.toLowerCase()} ${city === 'Kaunas' ? 'Kaune' : city}, ${address}. Plotas: ${property.area} m². Kaina: ${property.price.toLocaleString("lt-LT")} €. Profesionalios NT paslaugos Kauno regione.`;
  const ogImage = property.image;
  
  return {
    title: metaTitle,
    description: metaDescription.substring(0, 155),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/objektai/${slug}`,
      type: "article",
      siteName: "Mantas Katkevičius NT",
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export default async function SinglePropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  
  if (!property) {
    notFound();
  }

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "image": property.image,
    "url": `https://katkevicius.lt/objektai/${slug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "streetAddress": property.address,
      "addressCountry": "LT"
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "EUR"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      <PropertyClientView initialProperty={property} slug={slug} />
    </>
  );
}
