const fs = require('fs');
const path = require('path');

// 1. UPDATE PAGE.TSX
const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let page = fs.readFileSync(pageFile, 'utf8');

// Pakeisti importus: framer-motion į LazyMotion
page = page.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";'
);
if (!page.includes('const ServicesBento = dynamic')) {
    page = page.replace(
        'const ArticlesGrid = dynamic(() => import("@/components/home/ArticlesGrid"), { ssr: false });',
        'const ArticlesGrid = dynamic(() => import("@/components/home/ArticlesGrid"), { ssr: false });\nconst ServicesBento = dynamic(() => import("@/components/home/ServicesBento"), { ssr: false });'
    );
}

// Pašalinti `if (!isMounted) return null;`
page = page.replace('if (!isMounted) return null;', '');

// Pakeisti Hero section motion.div į m.div
page = page.replace('<motion.div', '<m.div');
page = page.replace('</motion.div>', '</m.div>');
// Gali būti ir kitas <motion.div...
page = page.replace('<motion.div', '<m.div');
page = page.replace('</motion.div>', '</m.div>');


// Pridėti fetchPriority="high" jei nėra
const imgRegex = /<Image[\s\S]*?src="\/uploads\/1773775458388-profilio\.png"[\s\S]*?\/>/;
const match = page.match(imgRegex);
if(match && !match[0].includes('fetchPriority')) {
    const newImg = match[0].replace('priority={true}', 'priority={true}\n                  fetchPriority="high"');
    page = page.replace(match[0], newImg);
}

// Ištrinti <section className="py-32... Teikiamos paslaugos... </section> ir priskirti <ServicesBento />
// Reikia ištrinti šį bloką, kuris yra po ProcessTimeline:
const srt = page.indexOf('{/* Services Bento Grid Section */}');
const endT = page.indexOf('{/* Commission Calculator */}');
if (srt !== -1 && endT !== -1) {
    page = page.substring(0, srt) + '{/* Services Bento Component */}\n      <ServicesBento />\n\n      ' + page.substring(endT);
}

// Apvynioti Hero į LazyMotion, bet paparsčius visą turinį geriau apvynioti root div return ( at open and close
page = page.replace(
    '<div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-hidden">',
    '<LazyMotion features={domMax}>\n    <div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-hidden">'
);
// Uždarom LazyMotion pačiam gale
page = page.replace(
    /    <\/div>\s+\);\s+\}/,
    '    </div>\n    </LazyMotion>\n  );\n}'
);

fs.writeFileSync(pageFile, page, 'utf8');


// 2. UPDATE LAYOUT.TSX
const layoutFile = path.join(process.cwd(), 'src/app/layout.tsx');
let layout = fs.readFileSync(layoutFile, 'utf8');

// Išmesti next/third-parties/google GTM ir GA imports, and insert Next/Script lazyOnload
layout = layout.replace('import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";\n', '');
layout = layout.replace('<GoogleTagManager gtmId="GTM-MQV3859Z" />', '');
layout = layout.replace('<GoogleAnalytics gaId="G-J6Y6S7VTDH" />', '');

// Insert these scripts with lazyOnload after footer
const scriptsInsert = `
        {/* GA & GTM via lazyOnload */}
        <Script id="ga-setup" strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-J6Y6S7VTDH" />
        <Script id="ga-config" strategy="lazyOnload">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J6Y6S7VTDH', { page_path: window.location.pathname });
          \`}
        </Script>
        
        <Script id="gtm-setup" strategy="lazyOnload">
          {\`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MQV3859Z');
          \`}
        </Script>
`;

if (!layout.includes('gtm-setup')) {
    layout = layout.replace('{children}\n        </main>\n        <Footer />', '{children}\n        </main>\n        <Footer />\n' + scriptsInsert);
}

fs.writeFileSync(layoutFile, layout, 'utf8');

console.log('Agresyvios GTM skriptų ir page.tsx LCP/SSR išjungimo injekcijos atliktos.');
