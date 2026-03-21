const fs = require('fs');

/* 1. Fix nt-objektai/page.tsx (Remove Atnaujinti Button) */
const objPath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\nt-objektai\\page.tsx';
let objContent = fs.readFileSync(objPath, 'utf8');

const buttonRegex = /<button[^>]*>\s*<RefreshCw[^>]*\/>\s*Atnaujinti\s*<\/button>/;
if (buttonRegex.test(objContent)) {
    objContent = objContent.replace(buttonRegex, '');
    fs.writeFileSync(objPath, objContent, 'utf8');
    console.log('Removed Atnaujinti button from nt-objektai/page.tsx');
} else {
    console.log('Could not find Atnaujinti button via regex in nt-objektai');
}

/* 2. Fix pasiulymai/[id]/page.tsx (Rigid containers + Style Print) */
const editPath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx';
if (fs.existsSync(editPath)) {
    let editContent = fs.readFileSync(editPath, 'utf8');

    // Add Style tag inside Right Panel
    const rightPanelTarget = '{/* RIGHT PANEL: LIVE PDF PREVIEW / ACTUAL PRINT CONTAINER */}\n      <div className="flex-1 h-full overflow-y-auto bg-slate-200/50 p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white print:block print:overflow-visible">';
    const styleString = `\n        <style>{\`
          @media print {
            body * { visibility: hidden !important; }
            .pasiulymas-print-panel, .pasiulymas-print-panel * { visibility: visible !important; }
            .pasiulymas-print-panel {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              z-index: 999999 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        \`}</style>`;

    if (editContent.includes('overflow-y-auto bg-slate-200/50')) {
         const insertIndex = editContent.indexOf('ACTUAL PRINT CONTAINER */}') + 'ACTUAL PRINT CONTAINER */}'.length + 1;
         // Find starting position of next line inside editContent to insert div class expansion or style
         const divStart = editContent.indexOf('<div', insertIndex);
         const firstDivClose = editContent.indexOf('>', divStart);
         
         // Add class for print panel
         editContent = editContent.substring(0, firstDivClose) + ' pasiulymas-print-panel' + editContent.substring(firstDivClose);
         
         // Insert style tag right after the div wrapper opens
         editContent = editContent.substring(0, firstDivClose + ' pasiulymas-print-panel'.length + 1) + styleString + editContent.substring(firstDivClose + ' pasiulymas-print-panel'.length + 1);
    }

    // Replace max-w-[794px] to w-[794px]
    editContent = editContent.replace(/className="w-full max-w-\[794px\]/g, 'className="w-[794px] shrink-0 print:w-full');

    fs.writeFileSync(editPath, editContent, 'utf8');
    console.log('Updated print wrappers inside pasiulymai/[id]/page.tsx');
} else {
    console.log('pasiulymai/[id]/page.tsx does not exist, skipping');
}
