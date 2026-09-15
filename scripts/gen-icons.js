const sharp = require('sharp');
const path = require('path');

const src = path.resolve(__dirname, '../stitch-reference/assignment._logo/screen.png');
const outDir = path.resolve(__dirname, '../public/icons');

async function main() {
  await sharp(src).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
  await sharp(src).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  await sharp(src).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));

  const bg = { r: 79, g: 70, b: 229, alpha: 1 }; // #4F46E5
  await sharp(src)
    .resize(410, 410)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: bg })
    .png()
    .toFile(path.join(outDir, 'icon-maskable-512.png'));

  console.log('icons generated');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
