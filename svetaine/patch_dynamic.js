const fs = require('fs');
const path = require('path');

// 1. Update page.tsx
const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Pridėti ArticlesGrid dynamic importą, jei dar nėra
if (!pageContent.includes('const ArticlesGrid')) {
    pageContent = pageContent.replace(
        'const TestimonialsGrid = dynamic(() => import("@/components/home/TestimonialsGrid"), { ssr: false });',
        'const TestimonialsGrid = dynamic(() => import("@/components/home/TestimonialsGrid"), { ssr: false });\nconst ArticlesGrid = dynamic(() => import("@/components/home/ArticlesGrid"), { ssr: false });'
    );
}

// Pakeisti old grid to <ArticlesGrid articles={articles} />
// Ieškome didelio bloko nuo StaggerContainer iki užsidarančio </StaggerContainer>
const gridRegex = /<StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">[\s\S]*?<\/StaggerContainer>/;
pageContent = pageContent.replace(gridRegex, '<ArticlesGrid articles={articles} />');

fs.writeFileSync(pageFile, pageContent, 'utf8');


// 2. Update PropertyClientView.tsx
const propFile = path.join(process.cwd(), 'src/app/objektai/[slug]/PropertyClientView.tsx');
let propContent = fs.readFileSync(propFile, 'utf8');

const mapFnStart = 'function PropertyMap';
const mapFnEnd = '  );\n}';
// Atsargiai iškerpam funkciją
const propStartInd = propContent.indexOf(mapFnStart);
if (propStartInd !== -1) {
    const fnDefRegex = /function PropertyMap[\s\S]*?return \([\s\S]*?\n\s*\);\n\}/;
    propContent = propContent.replace(fnDefRegex, '');
}

// Pridedame import dynamic
if (!propContent.includes('import dynamic from "next/dynamic";')) {
    propContent = propContent.replace(
        'import { useState, useEffect, useCallback, useRef } from "react";',
        'import { useState, useEffect, useCallback, useRef } from "react";\nimport dynamic from "next/dynamic";\n\nconst PropertyMap = dynamic(() => import("@/components/objects/PropertyMap"), { ssr: false });'
    );
}

fs.writeFileSync(propFile, propContent, 'utf8');

console.log('Dynamic imports priskirti sėkmingai!');
