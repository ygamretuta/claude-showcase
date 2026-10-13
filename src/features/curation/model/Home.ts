import type { GlobalConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/** What the front page leads with. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Curation' },
  access: { read: publicRead, update: isAuthenticated },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    {
      name: 'featuredWorks',
      type: 'relationship',
      relationTo: 'works',
      hasMany: true,
      maxRows: 12,
      admin: { description: 'Shown in this order. Leave empty to show every published work.' },
    },
  ],
};
