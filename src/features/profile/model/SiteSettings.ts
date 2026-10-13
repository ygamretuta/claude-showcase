import type { GlobalConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/** Site-wide metadata used for titles and link previews. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Profile' },
  access: { read: publicRead, update: isAuthenticated },
  fields: [
    { name: 'siteTitle', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'shareImage', type: 'relationship', relationTo: 'media' },
  ],
};
