import { SiteGrid } from '@/features/showcase/components/SiteGrid';
import { getSites } from '@/features/showcase/data/sites';

export default async function Home() {
  const sites = await getSites();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
          Sites I built with Claude
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Placeholder intro. A short line about who you are and what you make.
        </p>
      </header>
      <SiteGrid sites={sites} />
    </main>
  );
}
