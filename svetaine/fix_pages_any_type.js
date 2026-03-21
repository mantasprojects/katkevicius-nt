const fs = require('fs');

function fix(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('page.content.map((photo, i)')) {
        content = content.replace('page.content.map((photo, i)', 'page.content.map((photo: any, i: any)');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed implicit type in ${filePath}`);
    } else {
        console.log(`Target map not found in ${filePath}`);
    }
}

fix('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\kurti\\[id]\\page.tsx');
fix('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx');
