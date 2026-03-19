const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
if (!fs.existsSync(filePath)) {
    console.error(`Failas nerastas: ${filePath}`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Skenuojama ${data.length} straipsnių...`);

let fixedPardavimas = 0;
let fixedPirkimas = 0;
let fixedNuoma = 0;
let fixedDefault = 0;
let removedCTA = 0;
let fixedBrokeris = 0;

data.forEach((p) => {
    if (!p.content) return;

    let content = p.content;

    // 1. Kalbos valymas (Jokių "brokerių")
    // Pakeičiame "brokeris", "brokerio", "brokeriui" ir pan.
    const brokerisRegex = /\b([Bb])roker(is|io|iui|į|iu|yje|iai|ių|iams|ius|iais|iuose)\b/g;
    if (brokerisRegex.test(content)) {
        content = content.replace(brokerisRegex, (match, firstLetter, ending) => {
             // Let's replace with something solid based on ending or default to "NT ekspertas"
             // Since context varies, "NT ekspertas" or "specialistas" is safest.
             // We can also just use "NT ekspertas" for almost all.
             const isCapital = firstLetter === 'B';
             const replacement = isCapital ? 'NT ekspertas' : 'nt ekspertas'; // We will fix capitalization in a sec
             
             // Smart mapping or absolute replacement
             return isCapital ? 'NT ekspertas' : 'NT ekspertas'; // Keep standard uppercase NT
        });
        fixedBrokeris++;
    }

    // Specifinis pakeitimas "NT brokeris" -> "NT ekspertas"
    if (content.includes("NT brokeris")) {
        content = content.replace(/NT brokeris/g, "NT ekspertas");
    }
    if (content.includes("NT brokerio")) {
        content = content.replace(/NT brokerio/g, "NT eksperto");
    }

    // 2. Pašalinti senus CTA blokus, jei tokie yra tekste
    // Pavyzdžiui, jei yra <div class="bg-slate-50...> ar panašiai su konsultacija
    const oldCtaRegex = /<div class="[^"]*bg-slate-50[^"]*">[\s\S]*?Reikia asmeninės konsultacijos\?[\s\S]*?<\/div>/gi;
    if (oldCtaRegex.test(content)) {
        content = content.replace(oldCtaRegex, '');
        removedCTA++;
    }
    
    // Panaikinti bet kokį paprastą pabaigos tekstą apie konsultaciją, jei dubliuojasi
    // "Reikia asmeninės konsultacijos? Aptarkime..."
    const textCtaRegex = /Reikia asmeninės konsultacijos\?[\s\S]*?suraskime geriausią sprendimą\./gi;
    if (textCtaRegex.test(content)) {
        content = content.replace(textCtaRegex, '');
        removedCTA++;
    }

    // 3. Nustatyti temą ir pridėti SEO Link'ą
    const titleLower = p.title ? p.title.toLowerCase() : '';
    const contentLower = content.toLowerCase();
    const fullText = titleLower + ' ' + contentLower;

    // Raktiniai žodžiai
    const pardavimasKeywords = ['pardavimas', 'parduoti', 'kaina', 'vertė', 'pasiurbas', 'pelnas', 'greitai', 'strategija'];
    const pirkimasKeywords = ['pirkimas', 'pirkti', 'ieško', 'investuoti', 'paskola', 'euribor', 'palūkanos'];
    const nuomaKeywords = ['nuoma', 'nuomoti', 'nuomininkai', 'nuomojamas'];

    let topic = 'pardavimas'; // Default, nes Mantas yra pardavimų ekspertas
    let countPardavimas = pardavimasKeywords.filter(k => fullText.includes(k)).length;
    let countPirkimas = pirkimasKeywords.filter(k => fullText.includes(k)).length;
    let countNuoma = nuomaKeywords.filter(k => fullText.includes(k)).length;

    // Max count wins
    if (countNuoma > countPardavimas && countNuoma > countPirkimas) {
        topic = 'nuoma';
    } else if (countPirkimas > countPardavimas && countPirkimas > countNuoma) {
        topic = 'pirkimas';
    } else if (countPardavimas > 0) {
        topic = 'pardavimas';
    } else {
         // Default to category-based or general
         if (p.category === 'Investavimas') topic = 'pirkimas';
         else topic = 'pardavimas'; // Standard
         fixedDefault++;
    }

    let seoText = '';
    if (topic === 'pardavimas') {
        seoText = '<blockquote><p>Susipažinkite su mano, kaip NT pardavimų eksperto, taikoma <a href="/pardavimas">pardavimo strategija</a>.</p></blockquote>';
        fixedPardavimas++;
    } else if (topic === 'pirkimas') {
        seoText = '<blockquote><p>Susipažinkite su mano, kaip NT pirkimų eksperto, taikoma <a href="/pirkimas">pirkimo strategija</a>.</p></blockquote>';
        fixedPirkimas++;
    } else if (topic === 'nuoma') {
        seoText = '<blockquote><p>Susipažinkite su mano, kaip NT nuomos eksperto, taikoma <a href="/nuoma">nuomos strategija</a>.</p></blockquote>';
        fixedNuoma++;
    }

    // Append to content before closing tags if last element is a tag, or just append
    // Better to append as a new block at the very end.
    // Ensure we don't duplicate if already there
    if (!content.includes('taikoma <a href="/pardavimas"') && 
        !content.includes('taikoma <a href="/pirkimas"') && 
        !content.includes('taikoma <a href="/nuoma"')) {
        
        content = content.trim();
        // Append
        content += `\n\n${seoText}`;
    }

    p.content = content;
});

console.log(`\nAtaskaita:`);
console.log(`- Pardavimas SEO pridėtas: ${fixedPardavimas}`);
console.log(`- Pirkimas SEO pridėtas: ${fixedPirkimas}`);
console.log(`- Nuoma SEO pridėtas: ${fixedNuoma}`);
console.log(`- Naudota numatytoji (pardavimas): ${fixedDefault}`);
console.log(`- Pašalinti seni CTA: ${removedCTA}`);
console.log(`- Pataisyta "brokeris" nuorodų/tekstų: ${fixedBrokeris}`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\nPakeitimai išsaugoti į ${filePath}`);
