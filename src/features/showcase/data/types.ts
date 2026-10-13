export interface Site {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  /** Tailwind gradient classes used until real screenshots exist. */
  gradient: string;
}
