import type { CollectionConfig } from 'payload';

import { isAuthenticated, publishedOrAuthenticated } from '@/shared/payload/access';
import { slugField } from '@/shared/payload/slugField';

/** A hand-ordered selection of works presented together. */
export const Exhibits: CollectionConfig = {
  slug: 'exhibits',
  labels: { singular: 'Exhibit', plural: 'Exhibits' },
  admin: { useAsTitle: 'title', group: 'Curation' },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'work', type: 'relationship', relationTo: 'works', required: true },
        { name: 'note', type: 'text', admin: { description: 'Optional curator note.' } },
      ],
    },
  ],
};
