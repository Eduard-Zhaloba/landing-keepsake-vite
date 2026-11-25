import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = path.resolve('raw-images');
const OUTPUT_DIR = path.resolve('public/images');
const WIDTHS = [400, 800];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const files = await fs.readdir(INPUT_DIR);
const imageFiles = files.filter((file) => /\.(jpe?g|png)$/i.test(file));

for (const file of imageFiles) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);

  for (const width of WIDTHS) {
    const resized = sharp(inputPath).resize({ width, withoutEnlargement: true });

    await resized
      .clone()
      .avif({ quality: 60 })
      .toFile(path.join(OUTPUT_DIR, `${name}-${width}.avif`));
    await resized
      .clone()
      .webp({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, `${name}-${width}.webp`));
    await resized
      .clone()
      .jpeg({ quality: 82 })
      .toFile(path.join(OUTPUT_DIR, `${name}-${width}.jpg`));
  }

  console.log(`Оброблено: ${file}`);
}
