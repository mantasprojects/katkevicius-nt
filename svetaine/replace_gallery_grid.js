const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\nt-objektai\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /\{editGallery\.map\(\(url, i\) => \([\s\S]+?\}\)\)\}/;

const replacement = `{editGallery.map((url, i) => (
                       <div key={\`\${url}-\${i}\`} className="flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-[#2563EB] hover:shadow-md transition-all">
                         <div className="aspect-square relative bg-slate-50 overflow-hidden">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={url} alt={\`Nuotrauka \${i + 1}\`} className="w-full h-full object-cover" />

                           {/* Cover badge */}
                           {i === 0 && (
                             <div className="absolute top-2 left-2 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                               Pagrindinė
                             </div>
                           )}
                         </div>

                         {/* Bottom Control Bar */}
                         <div className="grid grid-cols-4 border-t border-slate-200 divide-x divide-slate-200 bg-white">
                           <button 
                             type="button" 
                             onClick={() => moveImage(i, -1)} 
                             disabled={i === 0}
                             className={\`flex items-center justify-center h-9 hover:bg-slate-50 transition-colors \${i === 0 ? 'opacity-30 cursor-not-allowed text-slate-300' : 'text-slate-500 hover:text-[#2563EB]'}\`} 
                             title="Perkelti kairėn"
                           >
                             <ArrowLeft className="w-4 h-4" />
                           </button>
                           
                           <button 
                             type="button" 
                             onClick={() => moveImage(i, 1)} 
                             disabled={i === editGallery.length - 1}
                             className={\`flex items-center justify-center h-9 hover:bg-slate-50 transition-colors \${i === editGallery.length - 1 ? 'opacity-30 cursor-not-allowed text-slate-300' : 'text-slate-500 hover:text-[#2563EB]'}\`} 
                             title="Perkelti dešinėn"
                           >
                             <ArrowRight className="w-4 h-4" />
                           </button>

                           <button 
                             type="button" 
                             onClick={(e) => { e.preventDefault(); setPreviewImage(url); }} 
                             className="flex items-center justify-center h-9 hover:bg-slate-50 text-slate-500 hover:text-[#2563EB] transition-colors" 
                             title="Padidinti"
                           >
                             <Eye className="w-4 h-4" />
                           </button>

                           <button 
                             type="button" 
                             onClick={() => removeImage(i)} 
                             className="flex items-center justify-center h-9 hover:bg-red-50 text-red-500 transition-colors" 
                             title="Pašalinti"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}`;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully replaced editGallery.map in page.tsx');
} else {
    console.log('Regex match failed - string not found');
}
