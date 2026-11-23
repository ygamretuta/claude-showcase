import Image from 'next/image';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { GlowingEffect } from '@/components/ui/glowing-effect';

import type { Site } from '../data/types';

interface SiteCardProps {
  site: Site;
  /** Wide card spanning two columns from the lg breakpoint. */
  featured?: boolean;
}

export function SiteCard({ site, featured = false }: SiteCardProps) {
  return (
    <div className="relative h-full rounded-2xl">
      <GlowingEffect
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <CardContainer containerClassName="h-full py-0" className="h-full w-full">
        <CardBody
          className={`group/card relative h-full w-full rounded-2xl border border-white/10 bg-neutral-900/70 p-4 shadow-xl shadow-black/30 backdrop-blur ${
            featured ? 'lg:flex lg:flex-row lg:items-center lg:gap-8 lg:p-6' : ''
          }`}
        >
          <CardItem translateZ={50} className={featured ? 'w-full lg:w-3/5' : 'w-full'}>
            {site.imageUrl ? (
              <Image
                src={site.imageUrl}
                alt={site.imageAlt ?? site.title}
                width={960}
                height={600}
                unoptimized
                className="aspect-[16/10] w-full rounded-xl object-cover"
              />
            ) : (
              <div
                className={`aspect-[16/10] w-full rounded-xl bg-gradient-to-br ${site.gradient}`}
                role="img"
                aria-label={`${site.title} preview placeholder`}
              />
            )}
          </CardItem>

          <div className={featured ? 'flex flex-col lg:w-2/5 lg:justify-center' : ''}>
            <CardItem
              translateZ={40}
              as="h3"
              className={`mt-4 font-semibold text-neutral-50 ${featured ? 'text-2xl lg:mt-0' : 'text-lg'}`}
            >
              {site.title}
            </CardItem>
            <CardItem
              translateZ={30}
              as="p"
              className="mt-2 text-sm leading-6 text-neutral-400"
            >
              {site.summary}
            </CardItem>
            {site.activityLabel ? (
              <CardItem
                translateZ={25}
                as="p"
                className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-400"
              >
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                {site.activityLabel}
              </CardItem>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-2">
              <CardItem translateZ={20} className="flex flex-wrap gap-2">
                {site.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </CardItem>
              {site.url ? (
                <CardItem
                  translateZ={30}
                  as="a"
                  href={site.url}
                  className="inline-flex h-10 items-center rounded-lg bg-violet-500 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-400"
                >
                  Visit
                </CardItem>
              ) : (
                <CardItem translateZ={30} className="text-xs text-neutral-500">
                  Not hosted online
                </CardItem>
              )}
            </div>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
