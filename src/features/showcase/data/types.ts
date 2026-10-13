export interface Site {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  /** Cover image from the CMS; the gradient is shown when absent. */
  imageUrl?: string;
  imageAlt?: string;
  /** Tailwind gradient classes used until a cover image exists. */
  gradient: string;
}
