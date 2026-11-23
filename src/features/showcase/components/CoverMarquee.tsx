import { ThreeDMarquee } from '@/components/ui/3d-marquee';

/** A tilted wall of every project cover. Purely decorative. */
export function CoverMarquee({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  // The marquee splits its images into four columns, so repeat the covers: the effect needs about 8 per column to fill its frame.
  const filled = Array.from({ length: 32 }, (_, i) => images[i % images.length] as string);

  return (
    <section aria-hidden="true" className="relative bg-neutral-950 px-4 pb-16 sm:pb-24">
      <ThreeDMarquee
        images={filled}
        className="max-w-7xl border border-white/10 bg-neutral-900/60"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
