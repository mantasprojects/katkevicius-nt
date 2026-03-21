const fs = require('fs');

function fixType(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace const pages = [ with typed pages
    if (content.includes('const pages = [')) {
        content = content.replace('const pages = [', 'const pages: any[] = [');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated pages array typing in ${filePath}`);
    } else {
        console.log(`Could not find pages array in ${filePath}`);
    }
}

fixType('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\kurti\\[id]\\page.tsx');
fixType('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx');
