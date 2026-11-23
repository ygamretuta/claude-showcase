import { IconBrandGithub, IconLayoutGrid } from '@tabler/icons-react';

import { FloatingNav } from '@/components/ui/floating-navbar';

const items = [
  { name: 'Work', link: '#work', icon: <IconLayoutGrid className="size-4" /> },
  {
    name: 'GitHub',
    link: 'https://github.com/ygamretuta',
    icon: <IconBrandGithub className="size-4" />,
  },
];

/** Appears once the visitor scrolls past the hero. */
export function ShowcaseNav() {
  return <FloatingNav navItems={items} />;
}
