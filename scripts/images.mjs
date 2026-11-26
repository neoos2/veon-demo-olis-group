// Prepares client photos (veon/research/client-img) for the demo: crop, resize, WebP. Run: node scripts/images.mjs
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const SRC = path.resolve('../veon/research/client-img');
const OUT = path.resolve('public/img');
fs.mkdirSync(OUT, { recursive: true });

// name, source, crop {left, top, width, height} in source px (null = whole), output widths
const jobs = [
  ['hero-wide', 'kondyterskyj-dim-vatsak-5.webp', { left: 0, top: 250, width: 1778, height: 750 }, [800, 1280, 1778]],
  ['hero-tall', 'kondyterskyj-dim-vatsak-5.webp', { left: 300, top: 300, width: 640, height: 700 }, [480, 640]],
  ['ind-meat', 'bohodukhivskyj-miasokombinat-0-6.jpg', { left: 0, top: 160, width: 1920, height: 1120 }, [640, 960, 1400]],
  ['ind-milk', 'zavod-syrovarnia-dubnomoloko-0-9.jpg', { left: 0, top: 160, width: 1920, height: 1120 }, [640, 960, 1400]],
  ['ind-oil', 'sokolivskyj-maslozhyrovyj-zavod-0.jpg', { left: 0, top: 0, width: 1920, height: 1120 }, [640, 960, 1400]],
  ['ind-farm', 'ferma-vilshanka-5.webp', null, [604]],
  ['ind-sweets', 'kondyterskyj-dim-vatsak-5.webp', { left: 0, top: 440, width: 960, height: 560 }, [640, 960]],
  ['ind-drinks', 'karpatski-mineralni-vody-0-8.jpg', { left: 0, top: 0, width: 1851, height: 1080 }, [640, 960, 1400]],
  ['ind-machine', 'folksvahen-tsentr-kryvyj-rih-0-10.jpg', { left: 0, top: 0, width: 1851, height: 1080 }, [640, 960, 1400]],
  ['ind-freeze', 'mkhp-lehko-0.jpg', { left: 0, top: 0, width: 1851, height: 1080 }, [640, 960, 1400]],
  ['ind-tobacco', 'kompaniia-filip-morris-ukraina-0.jpg', { left: 0, top: 200, width: 1920, height: 1120 }, [640, 960, 1400]],
  ['case-oil', 'sokolivskyj-maslozhyrovyj-zavod-0.jpg', { left: 240, top: 0, width: 1440, height: 1280 }, [640, 960, 1300]],
  ['case-sweets', 'kondyterska-fabryka-svitoch-0.jpg', { left: 200, top: 0, width: 1440, height: 1280 }, [640, 960, 1300]],
  ['process', 'intro-bg.webp', null, [800, 1351]],
];

const sizes = {};
for (const [name, file, crop, widths] of jobs) {
  const src = path.join(SRC, file);
  for (const w of widths) {
    let img = sharp(src);
    if (crop) img = img.extract(crop);
    const out = path.join(OUT, `${name}-${w}.webp`);
    const info = await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: 70 }).toFile(out);
    sizes[`${name}-${w}`] = [info.width, info.height, info.size];
  }
}
fs.writeFileSync(path.resolve('src/data/images.json'), JSON.stringify(sizes, null, 1));
console.log(sizes);
