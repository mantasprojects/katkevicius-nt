const fs = require('fs');

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File missing: ${filePath}`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Insert pages array right BEFORE `return (`
    const arrayCode = `  // Config dynamic pages
  const pages = [
    { type: 'cover', content: selectedPhotos[0] },
  ];
  if (description) {
    pages.push({ type: 'text', content: description });
  }
  if (selectedPhotos && selectedPhotos.length > 1) {
    const list = selectedPhotos.slice(1);
    const chunkSize = 4;
    for (let i = 0; i < list.length; i += chunkSize) {
      pages.push({ type: 'gallery', content: list.slice(i, i + chunkSize) });
    }
  }

  return (`;

    if (content.includes('return (') && !content.includes('const pages = [')) {
        content = content.replace('return (', arrayCode);
    }

    // 2. Find absolute panel wrapper start
    const panelToken = 'pasiulymas-print-panel"'; // class name
    const panelIndex = content.indexOf(panelToken);

    if (panelIndex === -1) {
        console.log(`Could not find pasiulymas-print-panel in ${filePath}`);
        return;
    }

    // Find the opening tag `>` of the pasiulymas-print-panel wrapper div
    const openBrace = content.indexOf('>', panelIndex);
    if (openBrace === -1) return;

    const startBodyIndex = openBrace + 1; // start of content INSIDE the panel

    // Count <div> structures to find index of closing </div> for the panel
    let count = 1;
    let i = startBodyIndex;
    let foundEnd = -1;

    while (i < content.length && count > 0) {
        if (content.substring(i, i+4) === '<div') {
            count++;
            i += 4;
        } else if (content.substring(i, i+6) === '</div>') {
            count--;
            if (count === 0) {
                foundEnd = i;
                break;
            }
            i += 6;
        } else {
            i++;
        }
    }

    if (foundEnd === -1) {
        console.log(`Counter failed to find closing tag in ${filePath}`);
        return;
    }

    const firstImageSrc = `typeof window !== 'undefined' ? '/uploads/1773775458388-profilio.png' : '/uploads/1773775458388-profilio.png'`;

    const replacementJSX = `
        <style>{\`
          @media print {
            body * { visibility: hidden !important; }
            .pasiulymas-print-panel, .pasiulymas-print-panel * { visibility: visible !important; }
            .pasiulymas-print-panel {
              position: fixed !important; left: 0 !important; top: 0 !important; width: 100% !important; height: auto !important; background: white !important; z-index: 999999 !important; padding: 0 !important; margin: 0 !important;
            }
          }
        \`}</style>

        {pages.map((page, index) => (
          <div key={index} className="w-[794px] shrink-0 h-[1123px] bg-white shadow-xl mb-8 relative flex flex-col print:shadow-none print:mb-0 print:break-after-page mx-auto print:w-full">
             <div className="h-2 w-full bg-[#2563EB] absolute top-0 left-0" />
             
             <div className="px-12 pt-12">
                <h1 className="text-xl font-extrabold text-[#111827] mb-1">{title || "Pavadinimas"}</h1>
                <p className="text-sm text-slate-600">{subtitle || "Poraštė"}</p>
                <p className="text-base font-extrabold text-[#2563EB] mt-1">{price || "0 €"} <span className="text-xs text-slate-500 font-normal">{pricePerSqM}</span></p>
             </div>

             <div className="flex-1 px-12 pt-8">
                {page.type === 'cover' && (
                   <div className="w-full h-[650px] relative overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                       {page.content ? (
                          <img src={page.content} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon className="w-20 h-20" /></div>
                       )}
                   </div>
                )}
                {page.type === 'text' && (
                   <div className="prose prose-slate max-w-none text-sm text-[#111827] whitespace-pre-wrap leading-relaxed">
                       {page.content}
                   </div>
                )}
                {page.type === 'gallery' && (
                   <div className="grid grid-cols-2 gap-4 h-[780px]">
                       {page.content.map((photo, i) => (
                          <div key={i} className="bg-slate-50 overflow-hidden border border-slate-100 h-[380px]">
                             <img src={photo} className="w-full h-full object-cover" alt="Galerija" />
                          </div>
                      ))}
                   </div>
                )}
             </div>

             <div className="w-full bg-[#f8f9fa] h-44 mt-auto flex flex-col justify-end">
                <div className="flex items-center justify-between px-12 py-6">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-300 rounded overflow-hidden shadow-sm shrink-0">
                         <img src="/uploads/1773775458388-profilio.png" alt="Mantas" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-[#111827]">Mantas Katkevičius</h3>
                         <p className="text-xs text-slate-500 mb-1">Jūsų NT partneris</p>
                         <p className="text-xs font-bold text-slate-700">+370 645 41892</p>
                         <p className="text-xs font-bold text-slate-700">info@katkevicius.lt</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <h2 className="text-xl font-extrabold tracking-tighter text-[#111827]">KATKEVIČIUS</h2>
                      <p className="text-[8px] font-bold tracking-widest uppercase text-slate-500 text-right">Real Estate</p>
                   </div>
                </div>
                <div className="w-full bg-[#111827] h-8 flex items-center justify-center text-white text-[9px] uppercase tracking-widest gap-2">
                   <span>katkevicius.lt</span>
                   <span className="opacity-40">|</span>
                   <span>Nr. 1</span>
                   <span className="opacity-40">|</span>
                   <span>Nekilnojamasis turtas</span>
                </div>
             </div>
          </div>
        ))}
    `;

    const newContent = content.substring(0, startBodyIndex) + replacementJSX + '\n      ' + content.substring(foundEnd);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully refactored ${filePath} with brace counting`);
}

refactorFile('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\kurti\\[id]\\page.tsx');
refactorFile('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx');
