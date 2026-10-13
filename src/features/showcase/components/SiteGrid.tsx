import type { Site } from '../data/types';
import { SiteCard } from './SiteCard';

export function SiteGrid({ sites }: { sites: Site[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sites.map((site) => (
        <li key={site.slug}>
          <SiteCard site={site} />
        </li>
      ))}
    </ul>
  );
}
