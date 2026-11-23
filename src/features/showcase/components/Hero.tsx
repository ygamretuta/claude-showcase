import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { FlipWords } from '@/components/ui/flip-words';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { Spotlight } from '@/components/ui/spotlight';
import { StarsBackground } from '@/components/ui/stars-background';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

interface HeroProps {
  projectCount: number;
}

export function Hero({ projectCount }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <StarsBackground className="-z-10" />
      <div className="absolute inset-0 -z-10 hidden md:block">
        <ShootingStars />
        <BackgroundBeams />
      </div>
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="#8b5cf6" />

      <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-neutral-300 backdrop-blur">
        <span className="size-2 rounded-full bg-violet-400" aria-hidden="true" />
        Portfolio &middot; {projectCount} {projectCount === 1 ? 'project' : 'projects'}
      </p>

      <h1 className="max-w-4xl bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
        I build{' '}
        <FlipWords
          words={['apps', 'sites', 'tools', 'ideas']}
          className="px-0 text-violet-400"
        />
        <br />
        with Claude
      </h1>

      <TextGenerateEffect
        words="Live links, generated cover art and real GitHub activity for everything I ship."
        className="mt-6 max-w-xl text-base font-normal text-neutral-300 sm:text-lg"
      />

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <MovingBorderButton
          as="a"
          href="#work"
          borderRadius="1.75rem"
          containerClassName="h-12 w-48"
          className="border-neutral-800 bg-neutral-950 text-sm font-medium text-white"
        >
          See the work
        </MovingBorderButton>
        <a
          href="https://github.com/ygamretuta"
          className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
        >
          GitHub &rarr;
        </a>
      </div>
    </section>
  );
}
