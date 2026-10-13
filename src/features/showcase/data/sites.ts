import type { Site } from './types';

const placeholders: Site[] = [
  {
    slug: 'colorwheel',
    title: 'Colorwheel',
    summary: 'Placeholder: build color palettes with harmony rules and live previews.',
    tags: ['Tool', 'Color'],
    url: '#',
    gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500',
  },
  {
    slug: 'pixel-quests',
    title: 'Pixel Quests',
    summary: 'Placeholder: a family quest board with rewards and bedtime routines.',
    tags: ['App', 'Family'],
    url: '#',
    gradient: 'from-amber-300 via-orange-400 to-rose-500',
  },
  {
    slug: 'placeholder-three',
    title: 'Project Three',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Site'],
    url: '#',
    gradient: 'from-emerald-300 via-teal-400 to-sky-500',
  },
  {
    slug: 'placeholder-four',
    title: 'Project Four',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Dashboard'],
    url: '#',
    gradient: 'from-sky-300 via-blue-500 to-violet-600',
  },
  {
    slug: 'placeholder-five',
    title: 'Project Five',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Landing page'],
    url: '#',
    gradient: 'from-lime-300 via-green-400 to-emerald-600',
  },
  {
    slug: 'placeholder-six',
    title: 'Project Six',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Game'],
    url: '#',
    gradient: 'from-purple-400 via-pink-500 to-red-500',
  },
];

// Async on purpose: the CMS will replace this body without changing callers.
export async function getSites(): Promise<Site[]> {
  return placeholders;
}
