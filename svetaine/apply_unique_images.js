const fs = require('fs');

const filePath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\data\\blog-posts.json';
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Pool of unique Unsplash IDs for various categories
const pools = {
  construction: [
    "https://images.unsplash.com/photo-1589939708739-c230648268af?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504159506876-f8338247a14a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541123437680-a9a3bfd68abd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092795360-fd1ca0b27f52?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebaf1a43382c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590053133606-2c930be3ba9f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589216532372-19bc04116888?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19480a5?q=80&w=1200&auto=format&fit=crop"
  ],
  interior: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15595b421ab?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584622741235-802c68f121d1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"
  ],
  houses: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560520550-9713fb385f9a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545324418-f1d8c6d3d90e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop"
  ],
  nature: [
    "https://images.unsplash.com/photo-1585320806297-9794b1ef4fd0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=1200&auto=format&fit=crop"
  ]
};

// Map of specific replacements for articles with duplicate images
// I will just iterate and replace duplicates sequentially with available pool items
const usedPoolItems = {};

data.forEach((p, index) => {
    // If we find duplicates later, we swap them
    const previousIndex = data.findIndex((other, i) => i < index && other.image === p.image);
    if (previousIndex >= 0) {
        // Find category-related pool
        let pool = pools.houses; // default
        if (p.category === 'Remontas' || p.id.includes('gipso') || p.id.includes('klinkeris')) pool = pools.construction;
        if (p.category === 'Inovacijos' || p.id.includes('led') || p.id.includes('vandens')) pool = pools.interior;
        if (p.category === 'Patarimai' && (p.id.includes('sklyp') || p.id.includes('tvora'))) pool = pools.nature;

        // Pick an item from the pool that isn't overused
        let newItem = pool[index % pool.length];
        // add random seed to ensure visual difference even if pool item is reused
        p.image = `${newItem}&sig=${index}`;
    }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Images made unique using pool distribution!");
