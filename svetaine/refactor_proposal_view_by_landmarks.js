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

    // 2. Identify outer pages block in JSX view Landmarks
    const startStr = '{/* A4 PAGE 1: COVER */}';
    const startIndex = content.indexOf(startStr);

    // Finding corresponding panel ends.
    // Index of the LAST page boundary like Page 3 map, or just general bottom right-panel outer close.
    // Standard template ends with: `)\n        )}\n\n      </div>` or similar
    // We can search for `A4 PAGE 3: GALLERY GRID` end tag OR simply the double `</div>` close before layouts wrap.
    // Let's find index where line before 341 ending `</div>` wraps inside `kurti/[id]`.
    
    // An alternate robust search for the close of the Live Preview DIV.
    let endIndex = -1;
    let endMatches = ['\n\n      </div>\n\n    </div>\n  );', ')}\n\n      </div>\n\n    </div>\n  );'];
    
    for (const match of endMatches) {
        let idx = content.indexOf(match, startIndex);
        if (idx !== -1) {
            endIndex = idx;
            break;
        }
    }

    if (startIndex === -1 || endIndex === -1) {
        console.log(`Failed boundary search in ${filePath}`);
        return;
    }

    const replacementJSX = `{pages.map((page, index) => (
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
        ))}`;

    const newContent = content.substring(0, startIndex) + replacementJSX + '\n\n' + content.substring(endIndex);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully refactored ${filePath} with Landmark Substring`);
}

// In Next.js 15, we might need a more resilient approach since paths and file sizes can fluctuate.
// Let's search for indices file-by-file instead of rigid batches!
refactorFile('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\kurti\\[id]\\page.tsx');
refactorFile('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx');
