import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Mantas Katkevičius | Nekilnojamojo turto ekspertas",
  description: "Nekilnojamojo turto pardavimo, pirkimo ir nuomos paslaugos Kauno regione. Aiški strategija, tikslūs sprendimai ir profesionali eiga.",
  keywords: ["Nekilnojamas turtas", "Butai Kaune", "NT Brokeris", "Mantas Katkevičius", "Parduoti butą"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className={cn("font-sans", geist.variable)}>
      <GoogleTagManager gtmId="GTM-MQV3859Z" />
      <body
        className={`${inter.variable} min-h-screen flex flex-col font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://katkevicius.lt/#service",
              "name": "Mantas Katkevičius | NT Brokeris Kaunas",
              "description": "Profesionalios nekilnojamojo turto paslaugos Kauno regione. Aiški strategija, tikslūs sprendimai ir sklandus procesas – nuo paieškos iki sėkmingo sandorio.",
              "image": "https://katkevicius.lt/uploads/1773775458388-profilio.png",
              "telephone": "+370 645 41892",
              "email": "info@katkevicius.lt",
              "url": "https://katkevicius.lt",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kaunas",
                "addressRegion": "Kauno m. sav.",
                "addressCountry": "LT"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 54.8985,
                "longitude": 23.9036
              },
              "openingHours": "Mo,Tu,We,Th,Fr 09:00-18:00",
              "priceRange": "$$"
            })
          }}
        />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        <GoogleAnalytics gaId="G-J6Y6S7VTDH" />

        <Script id="ga-custom-events" strategy="lazyOnload">
          {`
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];

            // Track Phone clicks
            document.addEventListener('click', function(e) {
              const anchor = e.target.closest('a');
              if (anchor && anchor.href && anchor.href.startsWith('tel:')) {
                // GA4 Event
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'skambutis_brokeriui', {
                    'event_category': 'Engagement',
                    'event_label': anchor.href
                  });
                }
                // GTM Event
                window.dataLayer.push({
                  'event': 'phone_call_click',
                  'phone_number': anchor.href
                });
              }
            });

            // Track Calendly Scheduling
            window.addEventListener('message', function(e) {
              if (e.data && e.data.event === 'calendly.event_scheduled') {
                // GA4 Event
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'konsultacijos_rezervacija');
                }
                // GTM Event
                window.dataLayer.push({
                  'event': 'consultation_click'
                });
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
