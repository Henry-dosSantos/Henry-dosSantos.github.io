import type { ImageMetadata } from 'astro';

// Every image under src/assets/projects/. Figures and covers look files up
// by name, so adding a photo means dropping a file in the right folder.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/**/*.{jpg,jpeg,png,webp,avif,gif,svg,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

// key is "<project-id>/<file name without extension>", e.g. "cold-plate-testbed/testbed-overview".
export function findImage(key: string): ImageMetadata | null {
  const target = `../assets/projects/${key}`.toLowerCase();
  const hit = Object.keys(files).find((p) => p.replace(/\.[^./]+$/, '').toLowerCase() === target);
  return hit ? files[hit]!.default : null;
}
