import { CoverMarquee } from '@/features/showcase/components/CoverMarquee';
import { Hero } from '@/features/showcase/components/Hero';
import { ProjectBrowser } from '@/features/showcase/components/ProjectBrowser';
import { ShowcaseNav } from '@/features/showcase/components/ShowcaseNav';
import { SiteFooter } from '@/features/showcase/components/SiteFooter';
import { getSites } from '@/features/showcase/data/sites';

export const revalidate = 60;

export default async function Home() {
  const sites = await getSites();
  const covers = sites.flatMap((site) => (site.imageUrl ? [site.imageUrl] : []));

  return (
    <>
      <ShowcaseNav />
      <main>
        <Hero projectCount={sites.length} />
        <CoverMarquee images={covers} />
        <section id="work" className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 pb-24 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
            Selected work
          </h2>
          <p className="mt-3 mb-10 max-w-xl text-neutral-400">
            Everything here is managed in a CMS, with GitHub activity synced daily.
          </p>
          <ProjectBrowser sites={sites} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
