"use client";

import { useState, useEffect } from "react";
import { Check, User, Mail, Phone, Home, BadgeEuro, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  propertyTitle: string;
  currentPrice: number;
  offeredPrice: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  status: "Naujas" | "Peržiūrėtas" | "Atmestas" | "Priimtas";
}

const MOCK_OFFERS: Offer[] = [
  {
    id: "def456",
    propertyTitle: "Modernus butas centre",
    currentPrice: 285000,
    offeredPrice: 270000,
    name: "Lukas Petrauskas",
    phone: "+370 600 12345",
    email: "lukas.p@pavyzdys.lt",
    date: "2024-05-18",
    status: "Naujas"
  }
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("nt_offers");
    if (saved) {
      setOffers(JSON.parse(saved));
    } else {
      setOffers(MOCK_OFFERS);
      localStorage.setItem("nt_offers", JSON.stringify(MOCK_OFFERS));
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: Offer["status"]) => {
    const updated = offers.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOffers(updated);
    localStorage.setItem("nt_offers", JSON.stringify(updated));
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">Klientų Kainos Pasiūlymai</h1>
        <p className="text-slate-500 font-medium">Peržiūrėkite ir valdykite pasiūlytas kainas jūsų objektams.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const discount = offer.currentPrice - offer.offeredPrice;
          const discountPercentage = ((discount / offer.currentPrice) * 100).toFixed(1);

          return (
            <div key={offer.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
              {offer.status === "Naujas" && <div className="absolute top-0 right-0 w-2 h-full bg-[#2563EB]" />}
              {offer.status === "Priimtas" && <div className="absolute top-0 right-0 w-2 h-full bg-green-500" />}
              {offer.status === "Atmestas" && <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />}
              {offer.status === "Peržiūrėtas" && <div className="absolute top-0 right-0 w-2 h-full bg-slate-400" />}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                    offer.status === 'Naujas' ? 'bg-blue-100 text-blue-700' : 
                    offer.status === 'Priimtas' ? 'bg-green-100 text-green-700' :
                    offer.status === 'Atmestas' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {offer.status}
                  </span>
                  <div className="flex items-center text-[#111827] font-bold text-lg mb-1">
                    <Home className="w-5 h-5 mr-2 text-[#2563EB]" />
                    {offer.propertyTitle}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{offer.date}</p>
                </div>
              </div>

              {/* Price Details Block */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Objekto Kaina</p>
                    <p className="text-xl font-bold text-[#111827] line-through decoration-slate-300">
                      {offer.currentPrice.toLocaleString("lt-LT")} €
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider font-bold text-[#2563EB] mb-1">Siūloma Kaina</p>
                    <p className="text-2xl font-extrabold text-[#2563EB] flex items-center justify-end">
                      <BadgeEuro className="w-5 h-5 mr-1" />
                      {offer.offeredPrice.toLocaleString("lt-LT")} €
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600">Skirtumas:</span>
                  <span className="font-bold text-red-500 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    - {discount.toLocaleString("lt-LT")} € ({discountPercentage}%)
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-slate-100 pt-5 mb-6">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">Pirkėjo Kontaktinė Informacija</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-slate-700 font-medium text-sm">
                    <User className="w-4 h-4 mr-2 text-slate-400" /> {offer.name}
                  </div>
                  <div className="flex items-center text-slate-700 font-medium text-sm">
                    <Phone className="w-4 h-4 mr-2 text-slate-400" /> {offer.phone}
                  </div>
                  <div className="flex items-center text-slate-700 font-medium text-sm col-span-1 sm:col-span-2">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" /> {offer.email}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {offer.status === "Naujas" ? (
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus(offer.id, "Atmestas")} 
                    className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-12"
                  >
                    Atmesti
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus(offer.id, "Priimtas")} 
                    className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white rounded-xl h-12 shadow-lg"
                  >
                    <Check className="w-4 h-4 mr-2" /> Priimti
                  </Button>
                </div>
              ) : (
                <div className="w-full text-center py-3 text-sm font-bold mt-auto rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                  Pasiūlymas apdorotas
                </div>
              )}
            </div>
          );
        })}
        {offers.length === 0 && (
          <div className="col-span-1 xl:col-span-2 text-center py-16 text-slate-500 font-medium bg-white rounded-3xl border border-dashed border-slate-300">
            Šiuo metu kainų pasiūlymų nėra.
          </div>
        )}
      </div>
    </div>
  );
}
