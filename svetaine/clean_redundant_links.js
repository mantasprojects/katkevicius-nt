const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let countVertė = 0;
let countStrategija = 0;
let countBrokeris = 0;

data.forEach((p) => {
    if (!p.content) return;
    let text = p.content;

    // 1. Šalinti "Sužinokite jūsų būsto vertę..." (su of be a tag)
    // Catch <a href="/konsultacija">Sužinokite jūsų būsto vertę šių dienų kontekste</a>.
    // Or plain text
    // Optional space or &nbsp; before
    const valymasVerte = /(?:\s|&nbsp;|<br\/?>)*<a [^>]+>Sužinokite jūsų būsto vertę šių dienų kontekste\.?<\/a>\.?/gi;
    const valymasVerteText = /(?:\s|&nbsp;|<br\/?>)*Sužinokite jūsų būsto vertę šių dienų kontekste\.?/gi;
    
    if (valymasVerte.test(text) || valymasVerteText.test(text)) {
        text = text.replace(valymasVerte, '');
        text = text.replace(valymasVerteText, '');
        countVertė++;
    }

    // 2. Šalinti "Susipažinkite su mano, kaip NT..." blockquote bloką, kurį sukūrėme anksčiau
    // Regex matches the whole blockquote block
    const valymasStrategija = /(?:\s|<br\/?>)*<blockquote>\s*<p>Susipažinkite su mano, kaip NT \S+ eksperto, taikoma <a href="[^"]+">\S+ strategija<\/a>\.<\/p>\s*<\/blockquote>\s*/gi;
    const valymasStrategijaTextFallback = /(?:\s|<br\/?>)*Susipažinkite su mano, kaip NT \S+ eksperto, taikoma <a href="[^"]+">\S+ strategija<\/a>\.?/gi;
    
    if (valymasStrategija.test(text)) {
        text = text.replace(valymasStrategija, '');
        countStrategija++;
    } else if (valymasStrategijaTextFallback.test(text)) {
        text = text.replace(valymasStrategijaTextFallback, '');
        countStrategija++;
    }

    // 3. Brokeris -> NT ekspertas
    // Only targeting lowercase variant and title-case since we already handled uppercase or we'll ensure they're removed.
    const brokerisRegex = /\b([Bb])roker(is|io|iui|į|iu|yje|iai|ių|iams|ius|iais|iuose)\b/g;
    if (brokerisRegex.test(text)) {
        text = text.replace(brokerisRegex, (match, firstLetter) => {
             return firstLetter === 'B' ? 'NT ekspertas' : 'NT ekspertas'; 
        });
        countBrokeris++;
    }

    // Specifinis: NT brokeris
    text = text.replace(/NT brokeris/gi, 'NT ekspertas');
    text = text.replace(/NT brokerio/gi, 'NT eksperto');
    
    // Capitalize sentence beginnings if they got messed up (hard to do comprehensively without NLP, but standard HTML keeps tags)
    // We just ensure no trailing empty paragraphs:
    text = text.replace(/<p>\s*<\/p>/gi, '');
    text = text.replace(/<p>&nbsp;<\/p>/gi, '');
    text = text.replace(/(<br\/?>\s*)+$/gi, '');
    text = text.trim();

    p.content = text;
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Valymas baigtas!`);
console.log(`- Pašalinta "Būsto vertė" nuorodų: ${countVertė}`);
console.log(`- Pašalinta "NT strategija" blokų: ${countStrategija}`);
console.log(`- Pataisyta "brokeris" likučių: ${countBrokeris}`);
