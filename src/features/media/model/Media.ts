import type { CollectionConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/** A stored file: a photograph, a still, or a short video clip. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media asset', plural: 'Media assets' },
  admin: { useAsTitle: 'title', group: 'Media', defaultColumns: ['title', 'mimeType', 'updatedAt'] },
  access: {
    read: publicRead,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describe the image for screen readers. Required for images.' },
      validate: (value: string | null | undefined, { data }: { data: Partial<{ mimeType: string }> }) =>
        data.mimeType?.startsWith('image/') === true && !value
          ? 'Alt text is required for images'
          : true,
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text', admin: { description: 'Photographer or videographer.' } },
    { name: 'capturedOn', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
  ],
};
