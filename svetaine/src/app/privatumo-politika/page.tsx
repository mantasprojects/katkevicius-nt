"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "1",
      title: "Duomenų valdytojas ir kontaktai",
      content: (
        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
          <p><span className="font-bold text-slate-800">Duomenų valdytojas:</span> www.katkevicius.lt</p>
          <p className="mt-2"><span className="font-bold text-slate-800">El. paštas:</span> <a href="mailto:info@katkevicius.lt" className="text-primary hover:underline font-bold">info@katkevicius.lt</a></p>
          <p className="mt-2"><span className="font-bold text-slate-800">Tel.:</span> <a href="tel:+37064541892" className="text-primary hover:underline font-bold">+370 645 41892</a></p>
          <p className="mt-4 text-slate-500 italic text-sm">Dėl klausimų apie asmens duomenų tvarkymą ar norėdami pasinaudoti savo teisėmis, susisiekite nurodytais kontaktais.</p>
        </div>
      )
    },
    {
      id: "2",
      title: "Kada taikoma ši Privatumo politika?",
      content: (
        <p>Ši Privatumo politika taikoma, kai:</p>
      ),
      list: [
        "lankotės Svetainėje;",
        "susisiekiate su mumis telefonu, el. paštu ar per užklausos formas;",
        "teikiate užklausas dėl paslaugų, konsultacijų ar vertinimo;",
        "sudarote ar ketinate sudaryti sutartį, naudojatės paslaugomis."
      ]
    },
    {
      id: "3",
      title: "Naudojamos sąvokos",
      content: (
        <div className="space-y-4">
          <p><span className="font-bold text-slate-800">Asmens duomenys</span> – bet kokia informacija apie fizinį asmenį, kurio tapatybė yra nustatyta arba gali būti nustatyta.</p>
          <p><span className="font-bold text-slate-800">Duomenų subjektas (Jūs)</span> – Svetainės lankytojas, klientas arba asmuo, pateikęs užklausą.</p>
          <p><span className="font-bold text-slate-800">Duomenų tvarkymas</span> – bet koks veiksmas su asmens duomenimis (rinkimas, saugojimas, naudojimas, perdavimas ir kt.).</p>
          <p><span className="font-bold text-slate-800">Tiesioginė rinkodara</span> – informacijos apie paslaugas ir pasiūlymus teikimas el. paštu, telefonu ar kitomis tiesioginio susisiekimo priemonėmis, kai tai leidžia teisės aktai.</p>
        </div>
      )
    },
    {
      id: "4",
      title: "Kokius asmens duomenis galime rinkti?",
      content: (
        <p>Priklausomai nuo to, kaip naudojatės Svetaine ir kokias paslaugas renkatės, galime tvarkyti šių kategorijų duomenis:</p>
      ),
      list: [
        "<strong>Identifikaciniai duomenys</strong> (kai tai būtina): vardas, pavardė, gyvenamosios vietos adresas, kiti pateikti identifikavimo duomenys.",
        "<strong>Kontaktiniai duomenys</strong>: telefono numeris, el. pašto adresas, adresas, kiti kontaktai, kuriuos pateikiate.",
        "<strong>Užklausos ir komunikacijos duomenys</strong>: susirašinėjimo turinys, užklausų istorija, pateikta informacija apie objektą ir poreikius.",
        "<strong>Sutartiniai / paslaugų teikimo duomenys</strong>: sutarties informacija, suteiktos paslaugos, susitarimai, sąskaitos.",
        "<strong>Finansiniai duomenys</strong> (tik kai būtina paslaugai ar teisinei prievolei): mokėjimų informacija, sąskaitų duomenys, finansiniai įsipareigojimai ar kita informacija, kurią pateikiate paslaugos tikslams.",
        "<strong>Techniniai ir naršymo duomenys</strong>: IP adresas, naršyklės tipas, įrenginio informacija, lankymosi laikas, puslapių peržiūros, slapukų (cookies) duomenys."
      ],
      footer: "Pastaba: neprašome pateikti perteklinių duomenų. Visada rekomenduojame dalintis tik tuo, kas reikalinga paslaugai ar užklausai įgyvendinti."
    },
    {
      id: "5",
      title: "Iš kur gauname duomenis?",
      content: (
        <p>Dažniausiai duomenis gauname:</p>
      ),
      list: [
        "tiesiogiai iš Jūsų, kai pildote formas, rašote, skambinate ar kaitip susisiekiate;",
        "išt viešų šaltinių ar registrų, kai tai būtina paslaugai teikti ar teisės aktų numatytoms pareigoms vykdyti (pvz., dokumentų patikrai);",
        "iš partnerių, kai Jūs jiems pateikiate savo duomenis ir prašote perduoti kontaktus dėl paslaugų (pvz., rekomendacijos atveju)."
      ]
    },
    {
      id: "6",
      title: "Kokiais tikslais ir kokiu teisiniu pagrindu tvarkome duomenis?",
      content: (
        <p>Asmens duomenis tvarkome tik tiek, kiek būtina, ir tik teisėtais pagrindais.</p>
      ),
      subsections: [
        {
          subtitle: "6.1. Užklausų administravimas ir komunikacija",
          text: "Tikslas: atsakyti į užklausas, pateikti informaciją, susisiekti dėl paslaugų.",
          legal: "Teisinis pagrindas: BDAR 6 str. 1 d. b p. (sutarties sudarymas / ikisutartiniai veiksmai) arba 6 str. 1 d. f p. (teisėtas interesas)."
        },
        {
          subtitle: "6.2. Paslaugų teikimas ir sutarčių vykdymas",
          text: "Tikslas: konsultacijos, tarpininkavimas, vertinimas, kitos paslaugos, sutarties vykdymas, atsiskaitymai.",
          legal: "Teisinis pagrindas: BDAR 6 str. 1 d. b p. (sutartis)."
        },
        {
          subtitle: "6.3. Teisinių pareigų vykdymas",
          text: "Tikslas: teisės aktų reikalavimų laikymasis, dokumentų tvarkymas, atsiskaitymo dokumentai, atsakymai institucijoms.",
          legal: "Teisinis pagrindas: BDAR 6 str. 1 d. c p. (teisinė prievolė)."
        },
        {
          subtitle: "6.4. Svetainės veikimo ir saugumo užtikrinimas, analitika",
          text: "Tikslas: užtikrinti Svetainės funkcionalumą, saugumą, analizuoti lankomumą ir tobulinti Svetainę.",
          legal: "Teisinis pagrindas: BDAR 6 str. 1 d. f p. (teisėtas interesas), o kai kuriais atvejais – sutikimas (slapukams)."
        },
        {
          subtitle: "6.5. Tiesioginė rinkodara",
          text: "Tikslas: siųsti naujienas, pasiūlymus ar informaciją apie paslaugas.",
          legal: "Teisinis pagrindas: BDAR 6 str. 1 d. a p. (sutikimas) arba teisės aktų leidžiami atvejai."
        }
      ],
      footer: "Sutikimą tiesioginei rinkodarai galite bet kada atšaukti, parašydami el. paštu info@katkevicius.lt."
    },
    {
      id: "7",
      title: "Naudotojo teisės",
      content: (
        <p>Jūs turite teisę:</p>
      ),
      list: [
        "susipažinti su tvarkomais savo asmens duomenimis;",
        "reikalauti ištaisyti netikslius ar papildyti neišsamius duomenis;",
        "reikalauti ištrinti duomenis (kai taikoma);",
        "apriboti duomenų tvarkymą (kai taikoma);",
        "prieštarauti duomenų tvarkymui, kai jis grindžiamas teisėtu interesu;",
        "atšaukti sutikimą, kai duomenys tvarkomi sutikimo pagrindu;",
        "pateikti skundą Valstybinei duomenų apsaugos inspekcijai (VDAI)."
      ]
    },
    {
      id: "8",
      title: "Slapukų (Cookies) politika",
      content: (
        <div className="space-y-4">
          <p>Svetainė naudoja slapukus, kad užtikrintų jos veikimą ir pagerintų naršymo patirtį.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Būtinieji slapukai</p>
              <p className="text-sm text-slate-500">Reikalingi Svetainės veikimui ir pagrindinėms funkcijoms. Be jų Svetainė gali veikti netinkamai.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Analitiniai slapukai</p>
              <p className="text-sm text-slate-500">Padeda suprasti, kako lankytojai naudoja Svetaine. Tokie slapukai naudojami tik gavus sutikimą.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/60 rounded-full blur-3xl opacity-50 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-100/80 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 pt-32 pb-24">
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-[#111827] flex items-center gap-2 font-bold rounded-xl">
              <ArrowLeft className="w-4 h-4" /> Grįžti į pradžią
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <FileText className="w-4 h-4 mr-2" /> Teisinė informacija
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold text-[#111827] mb-6 tracking-tight leading-none">
            Privatumo <span className="text-primary italic font-light">politika</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
            Ši Privatumo politika paaiškina, kaip interneto svetainė www.katkevicius.lt renka, naudoja ir saugo asmens duomenis.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-indigo-500" />

          <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
            
            <section className="border-b border-slate-100 pb-8">
              <p className="text-slate-500">
                Ši Privatumo politika paaiškina, kaip interneto svetainė www.katkevicius.lt (toliau – Svetainė) renka, naudoja ir saugo asmens duomenis, kokiu pagrindu jie tvarkomi, kam gali būti perduodami, kiek laiko saugomi ir kokias teises turi duomenų subjektai.
              </p>
              <p className="mt-4 text-slate-500">
                Tvarkydami asmens duomenis, laikomės 2016 m. balandžio 27 d. Europos Parlamento ir Tarybos reglamento (ES) 2016/679 (Bendrasis duomenų apsaugos reglamentas, toliau – BDAR) bei taikomų Lietuvos Respublikos teisės aktų.
              </p>
            </section>

            {sections.map((section) => (
              <div key={section.id} className="group">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary font-black text-sm flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    {section.id}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4 group-hover:text-primary transition-colors tracking-tight">
                      {section.title}
                    </h2>
                    {section.content}
                    
                    {section.subsections && (
                      <div className="mt-4 space-y-4">
                        {section.subsections.map((sub, i) => (
                          <div key={i} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
                            <p className="font-bold text-slate-800 mb-1 text-sm">{sub.subtitle}</p>
                            <p className="text-sm text-slate-500">{sub.text}</p>
                            <p className="text-xs text-slate-400 mt-1 font-bold">{sub.legal}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.list && (
                      <ul className="mt-4 space-y-2 list-disc pl-5 text-slate-500">
                        {section.list.map((item, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    )}

                    {section.footer && (
                      <p className="mt-4 text-slate-400 italic text-sm">{section.footer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </motion.div>

      </div>
    </div>
  );
}
