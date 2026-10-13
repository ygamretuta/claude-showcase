import type { CollectionConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';
import { slugField } from '@/shared/payload/slugField';

/** Shared vocabulary used to label works. */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  admin: { useAsTitle: 'name', group: 'Taxonomy' },
  access: {
    read: publicRead,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [{ name: 'name', type: 'text', required: true, unique: true }, slugField('name')],
};
