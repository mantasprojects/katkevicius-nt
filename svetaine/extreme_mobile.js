const fs = require('fs');
const path = require('path');

// 1. UPDATE PAGE.TSX
const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let page = fs.readFileSync(pageFile, 'utf8');

const imgRegex = /<Image[\s\S]*?src="\/uploads\/1773775458388-profilio\.png"[\s\S]*?\/>/;
const match = page.match(imgRegex);
if (match && !match[0].includes('decoding="sync"')) {
    // Inject decoding="sync"
    const newImg = match[0].replace('loading="eager"', 'loading="eager"\n                  decoding="sync"');
    page = page.replace(match[0], newImg);
}

// Remove unused AnimatePresence import
page = page.replace('import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";', 'import { LazyMotion, domMax, m } from "framer-motion";');

fs.writeFileSync(pageFile, page, 'utf8');


// 2. UPDATE TESTIMONIALS GRID (Limit to 3 on mobile layout or just 3 initially)
const testFile = path.join(process.cwd(), 'src/components/home/TestimonialsGrid.tsx');
let testContent = fs.readFileSync(testFile, 'utf8');

// Change map skeleton from 3 to 3 (already 3)
// Change .slice(0, 6) to .slice(0, 3)
testContent = testContent.replace(/\.slice\(0, 6\)/g, '.slice(0, 3)');

fs.writeFileSync(testFile, testContent, 'utf8');

console.log("Extreme mobile script executed.");
