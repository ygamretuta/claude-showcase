import type { GlobalConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/** Who the portfolio belongs to and how to reach them. */
export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile',
  admin: { group: 'Profile' },
  access: { read: publicRead, update: isAuthenticated },
  fields: [
    { name: 'displayName', type: 'text', required: true },
    { name: 'headline', type: 'text' },
    { name: 'bio', type: 'richText' },
    { name: 'portrait', type: 'relationship', relationTo: 'media' },
    { name: 'email', type: 'email' },
    { name: 'availableForWork', type: 'checkbox', defaultValue: false },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};
