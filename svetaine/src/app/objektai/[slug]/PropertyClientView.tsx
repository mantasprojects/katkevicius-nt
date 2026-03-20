"use client";

import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Building, BedDouble, Bath, Square, Calendar, Share, Heart, LandPlot, X, Camera } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { OfferPriceModal } from "@/components/modal/OfferPriceModal";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const PropertyMap = dynamic(() => import("@/components/objects/PropertyMap"), { ssr: false });

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
import Turnstile from "@/components/ui/Turnstile";
import { notFound } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

const createGeoJSONCircle = (center: [number, number], radiusInKm: number, points: number = 64) => {
  const [lng, lat] = center;
  const coords = [];
  const distanceX = radiusInKm / (111.32 * Math.cos(lat * Math.PI / 180));
  const distanceY = radiusInKm / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {}
  };
};



/* ─── Fullscreen Lightbox su framer-motion ─────────────────────────── */
function GalleryLightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const goPrev = useCallback(() => { setDirection(-1); setIndex(i => (i + images.length - 1) % images.length); }, [images.length]);
  const goNext = useCallback(() => { setDirection(1); setIndex(i => (i + 1) % images.length); }, [images.length]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => { 
    touchStartX.current = e.touches[0].clientX; 
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY; 
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => { 
    touchEndX.current = e.touches[0].clientX; 
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    
    // Swipe down to close
    if (diffY < -80 && Math.abs(diffY) > Math.abs(diffX)) {
      onClose();
      return;
    }
    
    // Swipe left/right
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) goNext();
      else goPrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Premium Blurred Background Layer for Lightbox */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[index]} 
          alt="" 
          className="w-full h-full object-cover blur-2xl opacity-40 scale-105 saturate-150" 
        />
      </div>
      {/* Close */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-5 left-5 z-50 text-white/80 text-sm font-bold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        {index + 1} / {images.length}
      </motion.div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 md:left-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Image instantly switching without animation */}
      <div className="max-w-[100vw] max-h-[100vh] flex items-center justify-center z-10" onClick={e => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`Nuotrauka ${index + 1}`}
          width={1920}
          height={1080}
          unoptimized={true}
          className="max-w-full max-h-[100vh] object-contain select-none object-center relative z-10"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
        />
      </div>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 md:right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </motion.div>
  );
}

export function PropertyClientView({ initialProperty, slug }: { initialProperty: any, slug: string }) {
  const [property, setProperty] = useState(initialProperty);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProperty);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorHeader, setErrorHeader] = useState("");

  useEffect(() => {
    if (!initialProperty) {
      const stored = localStorage.getItem("nt_properties_v_final_master_v1");
      if (stored) {
        const properties = JSON.parse(stored);
        const found = properties.find((p: any) => p.slug === slug);
        if (found) {
          setProperty(found);
          setIsLoading(false);
          return;
        }
      }
      setIsNotFound(true);
      setIsLoading(false);
    }
  }, [initialProperty, slug]);

  // Preload all gallery images on mount for instant lightbox
  useEffect(() => {
    if (!property) return;
    const imgs = property.gallery && property.gallery.length > 0
      ? property.gallery
      : [property.image];
    imgs.forEach((src: string) => {
      const img = new (window as any).Image();
      img.src = src;
    });
  }, [property]);

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      property: property.title,
      pageUrl: window.location.href,
      b_name: formData.get("b_name") as string,
      turnstileToken: turnstileToken,
    };

    try {
      setErrorHeader("");
      const res = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Užklausa neperėjo saugumo patikros.");
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'objekto_uzklausa', {
          'property_title': property.title
        });
      }

      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'form_submit',
          'property_title': property.title
        });
      }
      
      setTurnstileToken("");
      
      setTimeout(() => {
        setIsSuccess(false);
        (e.target as HTMLFormElement).reset();
      }, 3000);

    } catch (err: any) {
      console.error("Nepavyko išsiųsti užklausos:", err);
      setErrorHeader(err.message || "Užklausa neperėjo saugumo patikros.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

  if (isNotFound || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <h1 className="text-4xl font-bold text-[#111827] mb-4">404 - {'Objektas nerastas'}</h1>
        <p className="text-slate-500 mb-8">{'Atsiprašome, bet ieškomas nekilnojamojo turto objektas neegzistuoja.'}</p>
        <Link href="/objektai">
          <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white h-12 px-8 rounded-xl font-bold">Grįžti į paiešką</Button>
        </Link>
      </div>
    );
  }

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "image": property.image,
    "description": property.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": property.price,
      "availability": property.status === "Parduodama" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    }
  };

  const galleryImages = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [
        property.image,
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600607687931-cebf0746e50e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      ];

  const remainingPhotos = galleryImages.length - 3;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* JSON-LD injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container px-4 mx-auto max-w-7xl pt-8 pb-4">
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/objektai" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-[#2563EB] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-3" />Grįžti į paiešką</Link>
          <div className="flex items-center gap-2">
            <FacebookShareButton url={`https://katkevicius.lt/objektai/${property.slug}?fb=1`} className="hover:-translate-y-1 transition-transform">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton url={`https://katkevicius.lt/objektai/${property.slug}?wa=1`} title={property.title} className="hover:-translate-y-1 transition-transform mr-4">
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-md shadow-sm text-white ${
                property.status === "Parduodama" ? "bg-emerald-600" : 
                property.status === "Parduota" ? "bg-slate-800" : "bg-[#2563EB]"
              }`}>
                {property.status}
              </span>
              <span className="flex items-center text-slate-500 text-sm font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 mr-1.5 text-[#2563EB]" /> {property.city}{property.address ? `, ${property.address}` : ''}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-[#111827] tracking-tight leading-tight">
              {property.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Gallery Grid — Edge-to-Edge array on mobile, contained grid on desktop */}
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:container md:px-0 md:mx-auto md:max-w-7xl mb-0 md:mb-16 overflow-hidden">
        
        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-[2px] bg-[#111827] h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden border border-[#111827]">
          {/* Main large image */}
          <div 
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer"
            onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
          >
            <Image 
              src={galleryImages[0]} 
              alt="Pagrindinė nuotrauka" 
              fill
              priority
              className={`object-cover group-hover:scale-[1.02] transition-transform duration-700 z-10 ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`} 
              sizes="50vw"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1200, 800))}`}
            />
          </div>

          {/* Second image */}
          {galleryImages.length > 1 && (
            <div 
              className="col-span-2 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
            >
              <Image 
                src={galleryImages[1]} 
                alt="Antra nuotrauka" 
                fill
                priority={true}
                className={`object-cover group-hover:scale-[1.02] transition-transform duration-700 z-10 ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`} 
                sizes="50vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`}
              />
            </div>
          )}

          {/* Third image — with photo count overlay */}
          {galleryImages.length > 2 && (
            <div 
              className="col-span-2 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
            >
              <Image 
                src={galleryImages[2]} 
                alt="Trečia nuotrauka" 
                fill
                priority={true}
                className={`object-cover group-hover:scale-[1.02] transition-transform duration-700 z-10 ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`} 
                sizes="50vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 z-20 flex flex-col items-center justify-center transition-all duration-300">
                <Camera className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-extrabold text-2xl tracking-tight">
                  {remainingPhotos > 0 ? `+${remainingPhotos}` : ""}
                </span>
                <span className="text-white/80 font-bold text-sm uppercase tracking-widest mt-1">Žiūrėti galeriją</span>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE GRID PREVIEW / EXPANDABLE */}
        <div className="flex flex-col md:hidden w-full gap-1 mb-8">
          {!isMobileExpanded ? (
            <>
              {/* Main Image */}
              <div 
                className="w-full aspect-[4/3] relative cursor-pointer group"
                onClick={() => setIsMobileExpanded(true)}
              >
                <Image 
                  src={galleryImages[0]} 
                  alt="Pagrindinė nuotrauka" 
                  fill
                  priority
                  className={`object-cover ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`} 
                  sizes="100vw"
                />
                {/* Camera/Zoom Icon on Main Image */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white">
                  <Camera className="w-5 h-5" />
                </div>
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-1 px-4">
                  {galleryImages.slice(1, 5).map((src: string, i: number) => {
                    const isLast = i === 3;
                    const remainingForMobile = galleryImages.length - 5; // 1 Main + 4 Thumbs = 5 shown
                    
                    return (
                      <div 
                        key={i} 
                        className="aspect-square relative cursor-pointer"
                        onClick={() => setIsMobileExpanded(true)}
                      >
                        <Image 
                          src={src} 
                          alt={`Nuotrauka ${i + 2}`} 
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                        {isLast && remainingForMobile > 0 && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-extrabold text-lg">
                            +{remainingForMobile}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-[1px] bg-[#000000] animate-fadeIn">
              {galleryImages.map((src: string, i: number) => (
                <div key={i} className="w-full leading-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={src} 
                    alt={`Nuotrauka ${i + 1}`}
                    loading={i < 3 ? "eager" : "lazy"} 
                    className={`w-full h-auto object-cover block ${property.status !== "Parduodama" ? "grayscale-[30%]" : ""}`} 
                  />
                </div>
              ))}
              {/* Optional Collapse Button for good UX */}
              <div className="p-4 bg-white flex justify-center">
                <Button 
                  onClick={() => {
                    setIsMobileExpanded(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 10);
                  }} 
                  className="bg-[#111827] text-white"
                >
                  Suskleisti nuotraukas
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
      
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Actions Below Gallery */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-t border-slate-100 py-6 mb-16 gap-6">
          <div className="flex items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              Kaina: {property.price.toLocaleString("lt-LT")} €
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <OfferPriceModal currentPrice={property.price} propertyTitle={property.title} />
            <a href="tel:+37064541892" className="inline-flex items-center justify-center bg-[#1E3A8A] hover:bg-[#111827] text-white px-8 h-14 rounded-xl text-base font-bold shadow-xl shadow-[#1E3A8A]/20 transition-all hover:-translate-y-1 w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {'Pakalbėkime'}
            </a>
          </div>
        </div>

        {/* Fullscreen Lightbox with framer-motion */}
        <AnimatePresence>
          {isOpen && (
            <GalleryLightbox
              images={galleryImages}
              startIndex={photoIndex}
              onClose={closeLightbox}
            />
          )}
        </AnimatePresence>
      </div>


      {/* Main Content & Sidebar */}
      <section className="pb-24 bg-white border-t border-slate-100 pt-16">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* Main Details */}
            <div className="flex-1">
              
              {/* Core Stats */}
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5 mb-16">
                <StaggerItem>
                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full aspect-square">
                    <Square className="w-8 h-8 text-[#1E3A8A] mb-3" />
                    <span className="font-extrabold text-[#111827] text-2xl tracking-tight">{property.area} <span className="text-xl">m²</span></span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Plotas</span>
                  </div>
                </StaggerItem>
                {property.arai > 0 && (
                  <StaggerItem>
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full aspect-square">
                      <LandPlot className="w-8 h-8 text-[#1E3A8A] mb-3" />
                      <span className="font-extrabold text-[#111827] text-2xl tracking-tight">{property.arai} <span className="text-xl">a</span></span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Sklypas</span>
                    </div>
                  </StaggerItem>
                )}
                {property.details?.floor && (
                  <StaggerItem>
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full aspect-square">
                      <Building className="w-8 h-8 text-[#1E3A8A] mb-3" />
                      <span className="font-extrabold text-[#111827] text-2xl tracking-tight">{property.details.floor}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Aukštas</span>
                    </div>
                  </StaggerItem>
                )}
                {(property.year || property.details?.year) && (
                  <StaggerItem>
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full aspect-square">
                      <Calendar className="w-8 h-8 text-[#1E3A8A] mb-3" />
                      <span className="font-extrabold text-[#111827] text-2xl tracking-tight">{property.year || property.details?.year}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Metai</span>
                    </div>
                  </StaggerItem>
                )}
              </StaggerContainer>

              {/* Privalumai */}
              {(property.privalumai && property.privalumai.length > 0) && (
                <div className="mb-16">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#111827] mb-8 tracking-tight">Privalumai</h3>
                  <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8">
                    {property.privalumai.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center text-slate-700 font-medium">
                        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mr-4 flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apie objektą */}
              <div className="mb-16">
                <h3 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6 tracking-tight">Apie objektą</h3>
                <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {property.description}
                </div>
              </div>

            </div>

            {/* Sticky Sidebar Form */}
            <div className="w-full lg:w-[420px] lg:sticky lg:top-24 h-fit">
              <div className="bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-3xl p-8 md:p-10">
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E3A8A] flex-shrink-0 relative shadow-md">
                    <Image 
                      src="/uploads/1773775458388-profilio.png" 
                      alt="Mantas Katkevičius" 
                      fill
                      className="object-cover object-top" 
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg text-[#111827]">Mantas Katkevičius</p>
                    <p className="text-slate-500 text-sm font-semibold mb-1">Jūsų NT pardavimų ekspertas</p>
                    <a href="tel:+37064541892" className="text-[#2563EB] font-bold tracking-tight hover:underline block">+370 645 41892</a>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Domina šis objektas?</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">Palikite užklausą ir aš su jumis susisieksiu kuo greičiau.</p>
                
                <form className="space-y-4" onSubmit={handleInquirySubmit}>
                  {errorHeader && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                      ⚠️ {errorHeader}
                    </div>
                  )}

                  {/* Honeypot */}
                  <input type="text" name="b_name" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                  <div>
                    <Label htmlFor="name" className="sr-only">Vardas</Label>
                    <Input id="name" name="name" required className="h-14 md:text-base rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]" placeholder={'Jūsų vardas'} onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Prašome įvesti savo vardą')} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="sr-only">Telefonas</Label>
                    <Input id="phone" name="phone" required type="tel" className="h-14 md:text-base rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]" placeholder={'+370 600 00000'} onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Prašome įvesti telefono numerį')} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')} />
                  </div>
                    <div>
                      <Label htmlFor="message" className="sr-only">Žinutė</Label>
                      <textarea 
                        id="message" 
                        name="message"
                        className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-4 text-base focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-sans transition-all resize-none"
                        defaultValue={`Laba diena, mane sudomino šis objektas: "${property.title}".`}
                      />
                    </div>
                  <div className="flex flex-col items-center gap-2">
                    <Button disabled={isSubmitting || isSuccess || (!turnstileToken && typeof window !== "undefined" && window.location.hostname !== "localhost")} type="submit" className={`w-full h-14 text-white text-base font-bold shadow-xl shadow-[#1E3A8A]/20 transition-all hover:scale-105 active:scale-95 ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#1E3A8A] hover:bg-[#111827] hover:-translate-y-1'}`}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {'Siunčiama...'}
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        {'Išsiųsta!'}
                      </span>
                    ) : (
                      'Siųsti užklausą'
                    )}
                  </Button>
                  </div>
                  <div className="w-full mt-2">
                    <Turnstile onVerify={setTurnstileToken} />
                  </div>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Map Section */}
      {property.latitude && property.longitude && (
        <section className="bg-[#F8FAFC] py-16 border-t border-slate-100">
           <div className="container px-4 mx-auto max-w-7xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#111827] mb-8 tracking-tight">Lokacija</h3>
              <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-slate-100 shadow-xl relative">
                  <PropertyMap 
                     latitude={property.latitude} 
                     longitude={property.longitude} 
                     isExact={property.is_exact_location} 
                  />
              </div>
           </div>
        </section>
      )}
    </div>
  );
}
