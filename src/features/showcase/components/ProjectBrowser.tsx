'use client';

import { useMemo, useState } from 'react';

import type { Site } from '../data/types';
import { SiteCard } from './SiteCard';

/** Filterable bento grid of projects; every fifth card is wide. */
export function ProjectBrowser({ sites }: { sites: Site[] }) {
  const [active, setActive] = useState<string | null>(null);
  const tags = useMemo(() => [...new Set(sites.flatMap((site) => site.tags))].sort(), [sites]);
  const visible = active ? sites.filter((site) => site.tags.includes(active)) : sites;

  const chip = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={active === value}
      onClick={() => setActive(value)}
      className={`h-10 rounded-full border px-4 text-sm transition-colors ${
        active === value
          ? 'border-violet-400 bg-violet-500/20 text-violet-200'
          : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by tag">
        {chip('All', null)}
        {tags.map((tag) => chip(tag, tag))}
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((site, index) => {
          const wide = !active && index % 5 === 0;
          return (
            <li key={site.slug} className={wide ? 'md:col-span-2' : ''}>
              <SiteCard site={site} featured={wide} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
