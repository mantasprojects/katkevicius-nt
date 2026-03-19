const testTitles = [
  "Investicija šalia Kauno LEZ: Logistikos bumas ir didžiulė nuomos paklausa",
  "Įvažiavimas į kiemą: Žvirgždas, Skalda ar Asfaltas? Kainų ir priežiūros auditas",
  "LED Kontūrinis apšvietimas: Paslėpta šviesa lubų perimetre ir jos nauda",
  "Skandinaviškas vs Minimalistinis interjeras: Kuris geresnis?"
];

function fixTitleCase(text) {
  if (!text) return text;
  
  const segments = text.split(/(\? |\! |\.\s?)/);
  
  const fixedSegments = segments.map((seg, idx) => {
    if (idx % 2 === 1) return seg; 
    if (!seg.trim()) return seg;

    const words = seg.split(' ');
    const fixedWords = words.map((word, wIdx) => {
      if (wIdx === 0) return word; 
      
      const cleanWord = word.replace(/[,.!?:;()"-]/g, '');
      const properNouns = ["Kaunas", "Kaune", "Kauno", "Kauną", "Vilnius", "Vilniuje", "Klaipėda", "Lietuva", "Lietuvoje", "Mantas", "Katkevičius", "NT"];
      if (properNouns.includes(cleanWord)) return word;
      
      if (cleanWord === cleanWord.toUpperCase() && cleanWord.length > 1 && cleanWord.match(/[A-Z]/)) {
         return word; 
      }
      return word.toLowerCase();
    });
    return fixedWords.join(' ');
  });
  
  return fixedSegments.join('');
}

console.log("=== DRY RUN TEST ===");
testTitles.forEach(t => {
  console.log(`\nPrieš: ${t}`);
  console.log(`Po:    ${fixTitleCase(t)}`);
});
