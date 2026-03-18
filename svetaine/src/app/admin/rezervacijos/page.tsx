"use client";

import { useState, useEffect } from "react";
import { Check, Calendar, Clock, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  topic: string;
  status: "Nauja" | "Patvirtinta" | "Įvykdyta";
}

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: "1", name: "Jonas Jonaitis", phone: "+370 612 34567", date: "2024-05-15", time: "14:30", topic: "Noriu parduoti butą Centre", status: "Nauja" },
  { id: "2", name: "Ona Petrauskienė", phone: "+370 698 76543", date: "2024-05-16", time: "10:00", topic: "Domina kotedžas Kauno r.", status: "Patvirtinta" },
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Klaida kraunant užklausas:", err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Patvirtinta" as const }),
      });

      if (res.ok) {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Patvirtinta" as const } : r));
      }
    } catch (err) {
      console.error("Klaida patvirtinant:", err);
    }
  };

  if (!isMounted) return null;


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">Konsultacijų Rezervacijos</h1>
        <p className="text-slate-500 font-medium">Valdykite klientų užklausas ir planuojamus susitikimus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reservations.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
            {r.status === "Nauja" && <div className="absolute top-0 right-0 w-2 h-full bg-[#2563EB]" />}
            {r.status === "Patvirtinta" && <div className="absolute top-0 right-0 w-2 h-full bg-green-500" />}

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                  r.status === 'Nauja' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {r.status}
                </span>
                <h3 className="text-xl font-bold text-[#111827] flex items-center">
                  <User className="w-5 h-5 mr-2 text-slate-400" /> {r.name}
                </h3>
                <p className="text-slate-500 font-medium">{r.phone}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end text-[#111827] font-extrabold mb-1">
                  <Calendar className="w-4 h-4 mr-1.5 text-[#2563EB]" /> {r.date}
                </div>
                <div className="flex items-center justify-end text-slate-500 font-medium">
                  <Clock className="w-4 h-4 mr-1.5" /> {r.time}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex-1">
              <div className="flex font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4 mr-2" /> Tema / Žinutė
              </div>
              <p className="text-[#111827] font-medium leading-relaxed">{r.topic}</p>
            </div>

            {r.status === "Nauja" && (
              <Button onClick={() => handleApprove(r.id)} className="w-full bg-[#111827] hover:bg-[#1E3A8A] text-white rounded-xl h-12 shadow-lg">
                <Check className="w-5 h-5 mr-2" /> Patvirtinti laiką
              </Button>
            )}
            {r.status === "Patvirtinta" && (
              <div className="w-full text-center py-3 text-sm font-bold text-green-600 bg-green-50 rounded-xl">
                Susitikimas patvirtintas
              </div>
            )}
          </div>
        ))}
        {reservations.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-500 font-medium bg-white rounded-3xl border border-dashed border-slate-300">
            Šiuo metu naujų rezervacijų nėra.
          </div>
        )}
      </div>
    </div>
  );
}
