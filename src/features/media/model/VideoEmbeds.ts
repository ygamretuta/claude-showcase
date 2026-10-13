import type { CollectionConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/** A video hosted by a third party and played through an embed. */
export const VideoEmbeds: CollectionConfig = {
  slug: 'video-embeds',
  labels: { singular: 'Video embed', plural: 'Video embeds' },
  admin: { useAsTitle: 'title', group: 'Media' },
  access: {
    read: publicRead,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'vimeo',
      options: [
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    { name: 'url', type: 'text', required: true, admin: { description: 'The video page URL.' } },
    { name: 'durationSeconds', type: 'number', min: 0 },
    { name: 'poster', type: 'relationship', relationTo: 'media' },
  ],
};
