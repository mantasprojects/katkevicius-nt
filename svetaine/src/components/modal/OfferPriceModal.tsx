"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeEuro, CheckCircle2, X } from "lucide-react";
import Turnstile from "@/components/ui/Turnstile";

interface OfferPriceModalProps {
  currentPrice: number;
  propertyTitle: string;
}

export function OfferPriceModal({ currentPrice, propertyTitle }: OfferPriceModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Manual validation for the custom checkbox
    if (!termsAccepted) {
      setShowTermsError(true);
      return;
    }

    setIsSubmitting(true);
    setShowTermsError(false);

    const formData = new FormData(e.currentTarget);
    const offeredPrice = Number(formData.get("offerPrice"));
    const inquiryData = {
      name: formData.get("buyerName") as string,
      phone: formData.get("buyerPhone") as string,
      email: formData.get("buyerEmail") as string,
      message: `Siūloma kaina: ${offeredPrice.toLocaleString("lt-LT")} € (dabartinė: ${currentPrice.toLocaleString("lt-LT")} €)`,
      property: propertyTitle,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      turnstileToken: turnstileToken,
    };

    // LocalStorage Caches disabled per user request


    // Send email via API
    try {
      await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
    } catch (err) {
      console.error("Nepavyko išsiųsti pasiūlymo:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after close animation
    setTimeout(() => {
      setIsSuccess(false);
      setTermsAccepted(false);
      setShowTermsError(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#1E3A8A] hover:bg-[#111827] text-white text-base font-bold shadow-xl shadow-[#1E3A8A]/20 transition-all hover:-translate-y-1 flex items-center justify-center cursor-pointer"
          />
        }
      >
        <BadgeEuro className="w-5 h-5 mr-2" /> Siūlyti kainą
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border-b border-slate-100 p-6 text-center relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <DialogTitle className="text-2xl font-extrabold text-[#111827] mb-2 tracking-tight">
            Siūlyti kainą
          </DialogTitle>
          <div className="text-3xl font-extrabold text-[#2563EB] tracking-tight mb-2">
            {currentPrice.toLocaleString("lt-LT")} €
          </div>
          <p className="text-sm font-medium text-slate-500 line-clamp-1">{propertyTitle}</p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-10 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#111827] mb-2">Pasiūlymas išsiųstas!</h3>
              <p className="text-slate-500 font-medium mb-6">
                Susisieksiu su jumis artimiausiu metu.
              </p>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="h-12 px-8 rounded-xl border-slate-200 font-bold cursor-pointer"
              >
                Uždaryti
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="offerPrice" className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Jūsų siūloma kaina *
                </Label>
                <div className="relative">
                  <Input
                    id="offerPrice"
                    name="offerPrice"
                    type="number"
                    required
                    defaultValue={currentPrice}
                    className="h-14 pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] text-lg font-bold"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerName" className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Vardas *
                </Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Jūsų vardas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerPhone" className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Telefono numeris *
                </Label>
                <Input
                  id="buyerPhone"
                  name="buyerPhone"
                  type="tel"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="+370 600 00000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerEmail" className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  El. paštas *
                </Label>
                <Input
                  id="buyerEmail"
                  name="buyerEmail"
                  type="email"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="vardas@pavyzdys.lt"
                />
              </div>

              {/* Native checkbox to avoid validation issues */}
              <div className="flex flex-row items-start space-x-3 p-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) setShowTermsError(false);
                  }}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer accent-[#2563EB]"
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="terms" className="text-xs font-medium text-slate-500 cursor-pointer">
                    Sutinku su privatumo politika ir duomenų tvarkymo taisyklėmis.
                  </label>
                  {showTermsError && (
                    <p className="text-xs text-red-500 font-medium animate-in fade-in duration-200">
                      Privalote sutikti su privatumo politika.
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Turnstile onVerify={setTurnstileToken} />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost")}
                className="w-full h-14 bg-[#1E3A8A] hover:bg-[#111827] text-white text-base font-bold shadow-xl shadow-[#1E3A8A]/20 transition-all mt-4 rounded-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Siunčiama...
                  </span>
                ) : (
                  "Siųsti pasiūlymą"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
