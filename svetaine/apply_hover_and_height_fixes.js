const fs = require('fs');
const path = 'c:/Users/manta/OneDrive/Desktop/SVETAINĖ/svetaine/src/app/page.tsx';
let c = fs.readFileSync(path, 'utf8');

// 1. Fix Section height: Allow it to expand on mobile so portrait isn't cut off by absolute fixed heights
c = c.replace('<section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden z-20">', '<section className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden z-20 py-24 md:py-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">');

// 2. Adjust Text Contrast / Premium Phrase
c = c.replace('Skaidrūs sprendimai, derybų valdymas ir sklandus procesas jūsų ramybei.', 'Aukščiausios klasės atstovavimas, derybų menas ir sklandus nekilnojamojo turto pardavimas.');

// 3. Speed Up Animations on Cards and Remove Scale (Prevents Blurring)
const whileHoverRegex = /whileHover=\{\{\s*scale:\s*1\.0[12],\s*y:\s*-4\s*\}\}\s*transition=\{\{\s*duration:\s*0\.4\s*\}\}/g;
c = c.replace(whileHoverRegex, 'whileHover={{ y: -8 }} transition={{ duration: 0.25, ease: "easeOut" }}');

// Fallback for slightly different spacings on Bento grid items
c = c.replace('whileHover={{ scale: 1.02, y: -4 }}', 'whileHover={{ y: -8 }}');
c = c.replace('whileHover={{ scale: 1.01, y: -4 }}', 'whileHover={{ y: -8 }}');

// Fix transition line right below whileHover
c = c.replace('transition={{ duration: 0.4 }}', 'transition={{ duration: 0.25, ease: "easeOut" }}');

fs.writeFileSync(path, c, 'utf8');
console.log('Success');
