const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Pakeisti importus
content = content.replace(
    /import CommissionCalculator from "@\/components\/calculator\/CommissionCalculator";\s*import ProcessTimeline from "@\/components\/ui\/timeline";\s*import TestimonialCard from "@\/components\/ui\/testimonial-card";/g,
    `import Image from "next/image";\nimport dynamic from "next/dynamic";\n\nconst CommissionCalculator = dynamic(() => import("@/components/calculator/CommissionCalculator"), { ssr: false });\nconst ProcessTimeline = dynamic(() => import("@/components/ui/timeline"), { ssr: false });\nconst TestimonialsGrid = dynamic(() => import("@/components/home/TestimonialsGrid"), { ssr: false });`
);

// 2. Ištrinti TestimonialsGrid() funkciją failo gale
const functionStartInd = content.indexOf('function TestimonialsGrid() {');
if (functionStartInd !== -1) {
    content = content.slice(0, functionStartInd).trim() + '\n';
}

// 3. Pakeisti img į Image
const oldImg = `{/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/uploads/1773775458388-profilio.png" 
                  alt="Mantas Katkevičius" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                />`;

const newImg = `<Image 
                  src="/uploads/1773775458388-profilio.png" 
                  alt="Mantas Katkevičius" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                  loading="eager"
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />`;

content = content.replace(oldImg, newImg);
// Fallback if spaces don't match exactly
if(!content.includes("loading=\"eager\"")) {
    const rawImgMatch = /\{([^}]*next\/img-element[^}]*)\}\s*<img\s+src="\/uploads\/1773775458388-profilio\.png"[^>]+>/;
    const matched = content.match(rawImgMatch);
    if(matched) {
        content = content.replace(matched[0], newImg);
    } else {
        const simpleImg = /<img[^>]*src="\/uploads\/1773775458388-profilio\.png"[^>]*>/;
        content = content.replace(simpleImg, newImg);
    }
}

fs.writeFileSync(pageFile, content, 'utf8');
console.log('page.tsx sėkmingai atnaujintas LCP & TBT!');
