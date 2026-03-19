const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\data\\blog-posts.json";

let content = fs.readFileSync(filePath, 'utf-8');

const anchor = '"id": "badf0244-bc83-4c4c-82b5-cafbf463470e"';
const startIdx = content.indexOf(anchor);

if (startIdx === -1) {
    console.log("Anchor not found");
    process.exit(1);
}

const slugIdx = content.indexOf('"slug": "nt-skelbimu-fotografija-kaunas"', startIdx);
const brokenBlockStart = content.indexOf('"excerpt":', slugIdx);

const brokenTextEndSub = 'ir suplanuosime tobulą fotosesiją.</p>",';
const brokenTextEndIdx = content.indexOf(brokenTextEndSub, brokenBlockStart) + brokenTextEndSub.length;

if (brokenTextEndIdx < brokenBlockStart) {
    console.log("End not found");
    process.exit(1);
}

const correctText = `    "excerpt": "Vizualinis Turto Magnetas: Fotografijos GaliaŠiuolaikinis pirkėjas internete skelbimui skiria vos 3 sekundes. Nuotraukos darytos patraukliai ir profesionaliai.",
    "content": "<h2>Vizualinis Turto Magnetas: Fotografijos Galia</h2><p>Šiuolaikinis pirkėjas internete skelbimui skiria vos 3 sekundes. Jei nuotraukos darytos telefonu tamsoje, net ir geriausias butas Dainavoje ar loftas Šančiuose liks nepastebėtas.</p><h3>Šviesa ir Erdvės Kampai Loftuose</h3><p>Populiarūs Kauno loftai (pvz., buvusiose gamyklose) pasižymi aukštomis lubomis ir dideliais langais. Profesionalus fotografas naudoja plačiakampį objektyvą ir išnaudoja natūralią šviesą, suteikdamas erdvei erdvumo pojūtį, kurio pirkėjas ieško.</p><h3>Technologinis Pranašumas</h3><p>Geras skelbimas Kaune šiandien turi turėti:</p><ul><li>Profesionalias, retušuotas Hdr nuotraukas</li><li>3D virtualų turą (Matterport)</li><li>Drono kadrus iš viršaus (ypač svarbu namams ir sklypams)</li></ul><p>Tai filtruoja smalsuolius ir pritraukia tik motyvuotus pirkėjus.</p><h3>Aukščiausio lygio pateikimas</h3><p>Visiems savo parduodamiems objektams užsakau premium fotografijos paslaugas. <a href=\\"/konsultacija\\">Pasikonsultuokite prieš parduodami</a> ir suplanuosime tobulą fotosesiją.</p>",\n`;

const newContent = content.slice(0, brokenBlockStart) + correctText + content.slice(brokenTextEndIdx);

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Fixed.");
