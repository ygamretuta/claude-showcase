import Image from 'next/image';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import type { Site } from '../data/types';

export function SiteCard({ site }: { site: Site }) {
  return (
    <CardContainer containerClassName="py-2" className="w-full">
      <CardBody className="group/card relative h-auto w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
        <CardItem translateZ={50} className="w-full">
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
        <CardItem translateZ={40} as="h3" className="mt-4 text-lg font-semibold text-foreground">
          {site.title}
        </CardItem>
        <CardItem
          translateZ={30}
          as="p"
          className="mt-2 text-sm text-muted-foreground"
        >
          {site.summary}
        </CardItem>
        {site.activityLabel ? (
          <CardItem translateZ={25} as="p" className="mt-3 text-xs font-medium text-muted-foreground">
            {site.activityLabel}
          </CardItem>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-2">
          <CardItem translateZ={20} className="flex flex-wrap gap-2">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </CardItem>
          <CardItem
            translateZ={30}
            as="a"
            href={site.url}
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Visit
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
