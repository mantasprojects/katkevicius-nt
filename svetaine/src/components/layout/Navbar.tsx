"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getMenuItems = () => [
  { name: "Pradžia", href: "/" },
  { name: "Parduodami objektai", href: "/objektai" },
  { 
    name: "Paslaugos", 
    children: [
      { name: "Pardavimas", href: "/pardavimas" },
      { name: "Pirkimas", href: "/pirkimas" },
      { name: "Nuoma", href: "/nuoma" },
    ] 
  },
  { 
    name: "Informacija", 
    children: [
      { name: "Tinklaraštis", href: "/naudinga-informacija" },
      { name: "Atsiliepimai", href: "/atsiliepimai" },
      { name: "D.U.K.", href: "/duk" },
    ] 
  },
];

const getMobileLinks = () => [
  { name: "Pradžia", href: "/" },
  { name: "Parduodami objektai", href: "/objektai" },
  { name: "Pardavimas", href: "/pardavimas" },
  { name: "Pirkimas", href: "/pirkimas" },
  { name: "Nuoma", href: "/nuoma" },
  { name: "Tinklaraštis", href: "/naudinga-informacija" },
  { name: "Atsiliepimai", href: "/atsiliepimai" },
  { name: "D.U.K.", href: "/duk" },
];

function NavDropdown({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div 
      className="relative flex items-center h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-primary transition-colors cursor-pointer relative py-4">
        {item.name}
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen ? "rotate-180 text-primary" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[80%] left-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 w-52 z-50 flex flex-col gap-1"
          >
            <div className="absolute top-0 left-6 w-3 h-3 bg-white border-l border-t border-slate-100 rotate-45 -translate-y-1.5" />
            {item.children.map((sub: any) => (
              <Link 
                key={sub.href} 
                href={sub.href}
                className="p-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group/sub"
              >
                {sub.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const MENU_ITEMS = getMenuItems();
  const MOBILE_LINKS = getMobileLinks();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-[500] w-full bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8 h-20 md:h-24 flex items-center justify-between max-w-[1400px]">
          <Link href="/" className="flex items-center relative z-[210] shrink-0">
            <Image 
              src="/logomantas.png" 
              alt="Mantas Katkevičius NT platforma" 
              width={260} 
              height={70} 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105 duration-300" 
              priority
            />
          </Link>
          
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {MENU_ITEMS.map((item) => (
              item.children ? (
                <NavDropdown item={item} key={item.name} />
              ) : (
                <Link key={item.href} href={item.href || "/"} className="text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-primary transition-colors whitespace-nowrap relative group">
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-4 relative z-[210]">
            <Button asChild className="hidden lg:inline-flex shadow-xl shadow-primary/20 bg-primary hover:bg-slate-900 text-white font-bold px-8 h-12 rounded-xl transition-all hover:-translate-y-0.5">
              <Link href="/konsultacija">Nemokama konsultacija</Link>
            </Button>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-900 transition-all focus:outline-none group active:scale-95"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-5">
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                  isOpen ? "rotate-45 translate-y-2" : "translate-y-0"
                )}></span>
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out translate-y-2",
                  isOpen ? "opacity-0" : "opacity-100"
                )}></span>
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                  isOpen ? "-rotate-45 translate-y-2" : "translate-y-4"
                )}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[400] bg-white/98 backdrop-blur-3xl flex flex-col pt-[120px] md:pt-[160px] pb-10 px-6 overflow-y-auto"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-900 transition-all focus:outline-none z-20"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col h-full container mx-auto max-w-4xl relative z-10">
              <nav className="flex flex-col gap-6 mt-4">
                {MOBILE_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black text-slate-950 hover:text-primary active:text-primary transition-all flex items-center group tracking-tight"
                    >
                      {link.name}
                      <ArrowRight className="w-10 h-10 ml-8 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-auto pt-16"
              >
                <div className="w-full h-px bg-slate-200 mb-12"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-12">
                  <div className="space-y-4">
                    <p className="text-slate-500 text-sm font-black mb-4 uppercase tracking-[0.2em]">Susisiekime tiesiogiai</p>
                    <a href="tel:+37064541892" className="text-3xl sm:text-4xl font-black text-slate-950 block hover:text-primary transition-colors tracking-tight">+370 645 41892</a>
                    <a href="mailto:info@katkevicius.lt" className="text-xl font-bold text-slate-600 hover:text-slate-950 transition-colors">info@katkevicius.lt</a>
                  </div>
                  
                  <Link href="/konsultacija" className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
                    <Button size="lg" className="w-full h-20 px-12 bg-primary hover:bg-slate-950 text-white font-black text-2xl rounded-2xl transition-all shadow-2xl shadow-primary/30">
                      Nemokama konsultacija
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] -z-0" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-blue-500/5 blur-[100px] -z-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
