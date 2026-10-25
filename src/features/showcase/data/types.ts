export interface Site {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Live site; absent for apps that are not hosted online. */
  url?: string;
  /** Pre-formatted GitHub activity line, e.g. "Active 2 days ago". */
  activityLabel?: string;
  /** Cover image from the CMS; the gradient is shown when absent. */
  imageUrl?: string;
  imageAlt?: string;
  /** Tailwind gradient classes used until a cover image exists. */
  gradient: string;
}
