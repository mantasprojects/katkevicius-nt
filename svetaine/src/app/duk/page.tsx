"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight, MessageSquare, TrendingUp, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const faqsAnswersText = [
  "Nekilnojamojo turto pardavimų ekspertas padeda klientams priimti tikslius sprendimus pardavimo, pirkimo ar nuomos procesuose. Jis gerai išmano rinkos situaciją, kainodarą ir derybas.",
  "Pirmoji konsultacija ir preliminarus turto vertinimas yra visiškai nemokami. Tai patogi galimybė gauti įžvalgas apie rinkos situaciją be įsipareigojimų.",
  "Teisingai nustatyta nekilnojamojo turto kaina yra vienas svarbiausių sėkmingo sandorio veiksnių. Svarbu įvertinti vietą, plotą, būklę ir rinkos duomenis.",
  "Nors 100% garantijos duoti negalima, užtikrinamas aiškus planas: konkurencinga kainodara, kokybiška prezentacija, tikslinė reklama ir derybų valdymas.",
  "Ruošiant NT pardavimui, svarbu išgryninti erdvę, užtikrinti švarą, atlikti smulkius pataisymus ir sukurti gerą pirmąjį įspūdį nuotraukose."
];

const faqsLt = [
  {
    question: "Kodėl verta kreiptis į nekilnojamojo turto pardavimų ekspertą?",
    answer: (
      <div className="space-y-4">
        <p>
          Nekilnojamojo turto pardavimų ekspertas – tai NT srities specialistas, padedantis klientams priimti tikslius sprendimus pardavimo, pirkimo ar nuomos procesuose. Jis gerai išmano rinkos situaciją, kainodarą, pirkėjų elgseną bei efektyviausius sandorio organizavimo sprendimus.
        </p>
        <p>Žinoma, savo turtą galite parduoti ir savarankiškai, tačiau šiame procese dažnai kyla praktinių klausimų:</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Kaip nustatyti teisingą kainą ir ją pagrįsti pirkėjui?</li>
          <li>Jei būstas parduodamas labai greitai, ar tai nereiškia, kad kaina buvo per maža?</li>
          <li>Kokie veiksmai realiai gali padidinti turto vertę prieš parduodant?</li>
          <li>Kur ir kaip efektyviausiai reklamuoti objektą, kad jis sulauktų daugiau susidomėjimo?</li>
          <li>Kaip išvengti teisinių ir finansinių rizikų sudarant sandorį (avansas, sutartys, mokesčiai, paskola ir kt.)?</li>
        </ul>
        <p>
          NT pardavimų ekspertas padeda atsakyti į šiuos klausimus ir užtikrina, kad procesas vyktų sklandžiai, aiškiai ir su maksimaliai palankiu rezultatu.
        </p>
      </div>
    ),
  },
  {
    question: "Kokia yra nekilnojamojo turto vertinimo ir konsultacijos kaina?",
    answer: (
      <div className="space-y-4">
        <p>
          <strong>Pirmoji konsultacija ir preliminarus turto vertinimas yra visiškai nemokami.</strong> Tai patogi galimybė gauti aiškias įžvalgas apie rinkos situaciją, galimą pardavimo strategiją ir jūsų turto vertės rėžius – be jokių įsipareigojimų.
        </p>
        <p>
          Rekomenduojama susitikti – per trumpą laiką gausite daug praktiškos ir naudingos informacijos, kuri padės priimti teisingus sprendimus.
        </p>
      </div>
    ),
  },
  {
    question: "Kaip nustatyti NT kainą?",
    answer: (
      <div className="space-y-4">
        <p>
          Teisingai nustatyta nekilnojamojo turto kaina yra vienas svarbiausių sėkmingo sandorio veiksnių. Per didelė kaina dažnai sumažina pirkėjų susidomėjimą ir prailgina pardavimo laiką, o per maža – gali reikšti prarastą vertę.
        </p>
        <p>
          Norint nustatyti realią ir konkurencingą kainą, svarbu įvertinti objekto vietą, plotą, būklę, įrengimą, sklypo parametrus (jei aktualu), dokumentų situaciją bei panašių objektų kainas rinkoje. Taip pat reikšmę turi paklausa konkrečiame segmente ir tai, kaip objektas yra pozicionuojamas bei pateikiamas pirkėjams.
        </p>
        <p>
          Jeigu norite kainą pagrįsti tiksliai, verta pasitelkti NT pardavimų ekspertą, kuris remiasi rinkos duomenimis ir patirtimi, padeda išvengti brangių klaidų ir parenka kainą, kuri pritraukia pirkėjus bei išlaiko Jūsų objekto vertę.
        </p>
      </div>
    ),
  },
  {
    question: "Kaip užtikrinamas sėkmingas pardavimas?",
    answer: (
      <div className="space-y-4">
        <p>
          Nekilnojamojo turto pardavimo rezultatą lemia rinka, kaina, objekto patrauklumas ir pirkėjų aktyvumas, todėl 100 % garantijos sąžiningai negali pažadėti niekas.
        </p>
        <p>
          Tačiau galima garantuoti aiškų planą, skaidrų procesą ir maksimalias pastangas, kad objektas būtų parduodamas teisingai: parenkama konkurencinga kainodara, paruošiama kokybiška prezentacija, pasirenkami efektyviausi reklamos kanalai, valdoma komunikacija su pirkėjais ir derybos.
        </p>
        <p>
          Kai sprendimai priimami remiantis duomenimis, o procesas yra nuoseklus ir kontroliuojamas, tikimybė parduoti greičiau ir už geresnę kainą tampa ženkliai didesnė.
        </p>
      </div>
    ),
  },
  {
    question: "Kaip paruošti NT pardavimui?",
    answer: (
      <div className="space-y-4">
        <p>
          Ruošiant nekilnojamąjį turtą pardavimui, svarbiausia sukurti švarų, šviesų ir „lengvai įsivaizduojamą“ vaizdą pirkėjui. Šie žingsniai padeda padidinti susidomėjimą ir sutrumpinti pardavimo laiką:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600">
          <li>
            <strong>Išgryninkite erdvę.</strong> Pašalinkite nereikalingus daiktus ir vizualinį triukšmą – kuo mažiau chaoso, tuo didesnė erdvės vertės pojūtis.
          </li>
          <li>
            <strong>Švara ir tvarka – be kompromisų.</strong> Tvarkingi kambariai, švarūs langai, virtuvė ir sanitariniai mazgai daro didžiausią įspūdį.
          </li>
          <li>
            <strong>Smulkūs pataisymai.</strong> Lašantis čiaupas, klibanti rankena, nutrupėjusi sienos vieta ar neveikianti lemputė – detalės, kurios pirkėjui signalizuoja apie bendrą būklę.
          </li>
          <li>
            <strong>Šviesa ir kvapas.</strong> Gerai apšviestos patalpos atrodo didesnės, o neutralus kvapas padeda išlaikyti teigiamą pirmą įspūdį.
          </li>
          <li>
            <strong>Sukūrkite pirmąjį įspūdį.</strong> Nuotraukos ir pirmos 2–3 eilutės skelbime lemia, ar pirkėjas išvis susisieks. Kokybiška prezentacija yra būtina.
          </li>
        </ol>
      </div>
    ),
  },
];

const faqsEn = [
  {
    question: "Why should you contact a real estate sales expert?",
    answer: (
      <div className="space-y-4">
        <p>
          A real estate sales expert is a specialist who helps clients make accurate decisions in sale, purchase, or rental processes. They know the market, pricing, buyer behavior, and the most effective deal organization solutions.
        </p>
        <p>Of course, you can sell your property independently, but practical questions often arise:</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>How to set the correct price and justify it to the buyer?</li>
          <li>If the home sells very fast, does it mean the price was too low?</li>
          <li>What actions can really increase property value before selling?</li>
          <li>Where and how to advertise most effectively to get more interest?</li>
          <li>How to avoid legal and financial risks (deposit, contracts, taxes, loan, etc.)?</li>
        </ul>
        <p>
          An RE expert helps answer these questions and ensures the process runs smoothly with maximum favorable results.
        </p>
      </div>
    ),
  },
  {
    question: "What is the price of property valuation and consultation?",
    answer: (
      <div className="space-y-4">
        <p>
          <strong>The first consultation and preliminary valuation are completely free.</strong> This is a convenient opportunity to get clear insights into the market, potential strategy, and value range - without obligations.
        </p>
      </div>
    ),
  },
  {
    question: "How to set the RE price?",
    answer: (
      <div className="space-y-4">
        <p>
          Correctly set price is key to a successful deal. Overpricing reduces interest; underpricing means lost value.
        </p>
        <p>
          Location, size, condition, documentation, and neighborhood comparable sales are evaluated. Demand and positioning also matter.
        </p>
        <p>
          An expert relies on data and experience to avoid costly mistakes.
        </p>
      </div>
    ),
  },
  {
    question: "How is a successful sale guaranteed?",
    answer: (
      <div className="space-y-4">
        <p>
          Result depends on market, price, and buyers, so no one can honestly promise 100% guarantees.
        </p>
        <p>
          However, a clear plan, transparent process, and maximum effort are guaranteed: competitive pricing, premium presentation, effective advertising, and negotiations.
        </p>
      </div>
    ),
  },
  {
    question: "How to prepare RE for sale?",
    answer: (
      <div className="space-y-4">
        <p>
          Create a clean, bright look for the buyer:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600">
          <li><strong>Clear the space.</strong> Remove clutter and visual noise.</li>
          <li><strong>Cleanliness is key.</strong> Tidy rooms, clean windows make the best impression.</li>
          <li><strong>Minor repairs.</strong> Leaky faucets or loose handles signal condition.</li>
          <li><strong>Light & smell.</strong> Good lighting expands space; neutral smell helps.</li>
          <li><strong>First impression.</strong> Photos and first lines decide if buyers contact you.</li>
        </ol>
      </div>
    ),
  },
];

export default function FAQPage() {
  const sections = [
    {
      title: "Pardavėjams",
      description: "Strateginė kaina, Home Staging ir derybos sėkmingam pardavimui.",
      icon: TrendingUp,
      faqs: [ faqsLt[2], faqsLt[3], faqsLt[4] ]
    },
    {
      title: "Pirkėjams",
      description: "Profesionali pagalba ir saugūs žingsniai ieškantiems svajonių būsto.",
      icon: HelpCircle,
      faqs: [ faqsLt[0] ]
    },
    {
      title: "Procesas ir Teisė",
      description: "Teisiniai saugikliai, dokumentacija ir konsultacijos ramybei užtikrinti.",
      icon: Scale,
      faqs: [ faqsLt[1] ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(sections[0].title);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Find active section items
  const activeSection = sections.find((s) => s.title === activeCategory);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsLt.map((faq, index) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faqsAnswersText[index] || ""
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-24 flex-1 relative overflow-hidden">
        {/* Glowing background highlights inspired by tech design */}
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="container px-4 mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Category Navigation Header Panel */}
            <div className="md:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="text-[#2563EB] font-bold tracking-wider uppercase text-xs mb-2">Pagalba ir Informacija</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827] leading-tight mb-2">
                    Dažnai Užduodami
                  </h1>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-blue-400 bg-clip-text text-transparent mb-5">
                    Klausimai
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    Atsakymai į svarbiausius klausimus ketinantiems pirkti, parduoti ar investuoti į nekilnojamąjį turtą.
                  </p>
                </div>

                <div className="flex flex-col gap-2 bg-white/40 backdrop-blur-xl border border-slate-200/40 p-2 rounded-2xl shadow-sm">
                  {sections.map((section, sIndex) => {
                    const isSelected = activeCategory === section.title;
                    const Icon = section.icon;
                    return (
                      <button
                        key={sIndex}
                        onClick={() => {
                          setActiveCategory(section.title);
                          setActiveIndex(null); // Reset accordions on tab change
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer group ${
                          isSelected 
                            ? "bg-white shadow-md border border-slate-100 text-[#2563EB]" 
                            : "hover:bg-white/80 text-slate-600 hover:text-slate-900 border border-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-colors ${
                          isSelected ? "bg-blue-50 text-[#2563EB]" : "bg-slate-100/50 text-slate-400 group-hover:bg-slate-100"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm transition-colors ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                            {section.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Questions Grid */}
            <div className="md:col-span-8">
              <AnimatePresence mode="wait">
                {activeSection && (
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activeSection.title}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">{activeSection.description}</p>
                    </div>

                    {activeSection.faqs.map((faq, fIndex) => {
                      const isOpen = activeIndex === fIndex;
                      return (
                        <motion.div
                          layout
                          key={fIndex}
                          className={`bg-white/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isOpen
                              ? "border-blue-200/60 shadow-lg shadow-blue-500/[0.04]"
                              : "border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md hover:shadow-slate-200/30"
                          }`}
                        >
                          <button
                            onClick={() => toggleAccordion(fIndex)}
                            className="w-full flex items-start justify-between p-6 md:p-7 text-left cursor-pointer group"
                            aria-expanded={isOpen}
                          >
                            <div className="flex items-start gap-4 pr-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                                isOpen ? "bg-blue-50 text-[#2563EB]" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2563EB]"
                              }`}>
                                <MessageSquare className="w-4 h-4" />
                              </div>
                              <h3
                                className={`font-semibold text-base md:text-lg transition-colors leading-snug tracking-tight ${
                                  isOpen ? "text-[#2563EB]" : "text-slate-800"
                                }`}
                              >
                                {faq.question}
                              </h3>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-1 border ${
                              isOpen ? "border-blue-200 bg-blue-50 text-[#2563EB]" : "border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-[#2563EB]"
                            }`}>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 md:px-7 pb-6 md:pb-7 border-t border-slate-50/80 text-slate-600 text-sm md:text-base leading-relaxed">
                                  <div className="pl-12 pt-4">
                                    {faq.answer}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-[#111827] mb-4 tracking-tight">Neradote atsakymo į savo klausimą?</h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">Susisiekite ir aptarkime jūsų situaciją individualiai.</p>
          <Link href="/konsultacija">
            <Button className="h-14 px-10 bg-[#1E3A8A] hover:bg-[#111827] text-white text-base font-bold rounded-xl shadow-xl shadow-[#1E3A8A]/20 transition-all hover:-translate-y-0.5 cursor-pointer">Užduoti klausimą<ArrowRight className="w-5 h-5 inline ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
