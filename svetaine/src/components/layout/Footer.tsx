import { Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default function Footer() {
  let settings: any = { footer: {}, socials: {} };
  try {
    const filePath = path.join(process.cwd(), "src/data/website-settings.json");
    if (fs.existsSync(filePath)) {
      settings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load footer settings:", err);
  }

  const phone = settings.footer?.phone || "+370 645 41892";
  const email = settings.footer?.email || "info@katkevicius.lt";
  const linkedin = settings.socials?.linkedin || "https://www.linkedin.com/in/mantas-katkevičius1/";
  const facebook = settings.socials?.facebook || "https://www.facebook.com/katkeviciusnt";
  const instagram = settings.socials?.instagram || "https://www.instagram.com/mantas.katkevicius";

  return (
    <footer className="bg-[#030712] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      
      <div className="absolute bottom-0 right-0 w-[40%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          <div className="md:col-span-4 flex flex-col items-start">
             <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
               <Image 
                 src="/logomantas.png" 
                 alt="Mantas Katkevičius NT" 
                 width={240} 
                 height={65} 
                 className="h-11 sm:h-12 w-auto object-contain brightness-0 invert" 
                 priority
               />
             </Link>
             <p className="text-slate-400 text-base leading-relaxed font-medium mb-8 max-w-sm">
               Profesionalios nekilnojamojo turto paslaugos Kauno regione. Aiški strategija, tikslūs sprendimai ir sklandus procesas – nuo paieškos iki sėkmingo sandorio.
             </p>
             
             <div className="flex gap-4">
               {[
                 { icon: Facebook, href: facebook, label: "Facebook" },
                 { icon: Instagram, href: instagram, label: "Instagram" },
                 { icon: Linkedin, href: linkedin, label: "LinkedIn" }
               ].map((social, i) => (
                 <a 
                   key={i}
                   href={social.href} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-13 h-13 rounded-[1.25rem] bg-slate-900/40 border border-slate-800/40 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-white hover:border-white transition-all duration-500 hover:-translate-y-1.5 shadow-lg hover:shadow-white/10 p-3.5"
                   aria-label={social.label}
                 >
                   <social.icon size={22} className="transition-transform duration-500 group-hover:scale-110" />
                 </a>
               ))}
             </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-sans font-black mb-8 text-slate-500 text-xs uppercase tracking-[0.25em]">Paslaugos</h4>
            <div className="flex flex-col gap-4">
              <Link href="/pirkimas" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300 inline-flex items-center group">NT Pirkimas</Link>
              <Link href="/pardavimas" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300 inline-flex items-center group">NT Pardavimas</Link>
              <Link href="/nuoma" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300 inline-flex items-center group">NT Nuoma</Link>
              <Link href="/konsultacija" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300 inline-flex items-center group">Konsultacija</Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-sans font-black mb-8 text-slate-500 text-xs uppercase tracking-[0.25em]">Katalogas</h4>
            <div className="flex flex-col gap-4">
              <Link href="/objektai" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300">Parduodami objektai</Link>
              <Link href="/naudinga-informacija" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300">Tinklaraštis</Link>
              <Link href="/atsiliepimai" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300">Atsiliepimai</Link>
              <Link href="/duk" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300">D.U.K.</Link>
              <Link href="/kontaktai" className="text-slate-300 hover:text-white font-bold text-base transition-all hover:translate-x-1 duration-300">Susisiekti</Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-sans font-black mb-8 text-slate-500 text-xs uppercase tracking-[0.25em]">Kontaktai</h4>
            <div className="bg-gradient-to-br from-slate-900/40 via-[#0A0E1A]/40 to-slate-900/20 backdrop-blur-md border border-slate-800/40 p-8 rounded-[2.5rem] hover:border-slate-700/60 transition-all duration-500 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex flex-col gap-7 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Telefonas</p>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-xl font-bold text-white hover:text-primary transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">El. paštas</p>
                    <a href={`mailto:${email}`} className="text-xl font-bold text-white hover:text-primary transition-colors break-all">{email}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-slate-500">
          <p className="mb-6 md:mb-0 italic opacity-80 text-center md:text-left">© {new Date().getFullYear()} Mantas Katkevičius. Visos teisės saugomos.</p>
          <div className="flex gap-8">
            <Link href="/privatumo-politika">
              <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-widest text-[10px]">Privatumo politika</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
