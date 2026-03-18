"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight, MessageSquare } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = faqsLt;

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1E40AF] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container px-4 mx-auto max-w-4xl text-center relative z-10">
          <p className="text-blue-300 font-bold tracking-wider uppercase text-sm mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />Pagalba & Informacija</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            "Dažnai Užduodami "{" "}
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Klausimai</span>
          </h1>
          <p className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Atsakymai į svarbiausius klausimus, padedantys priimti teisingus sprendimus jūsų nekilnojamojo turto kelyje.</p>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-16 flex-1">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#2563EB] shadow-lg shadow-blue-500/5"
                      : "border-slate-100 shadow-sm hover:border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isOpen ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                        }`}
                      >
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3
                        className={`font-bold text-base md:text-lg transition-colors ${
                          isOpen ? "text-[#2563EB]" : "text-[#111827]"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-slate-50 text-slate-500 text-sm md:text-base leading-relaxed ml-14">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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
