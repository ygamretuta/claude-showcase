import type { CollectionConfig } from 'payload';

import { isAuthenticated, publishedOrAuthenticated } from '@/shared/payload/access';
import { slugField } from '@/shared/payload/slugField';

export const WORK_KINDS = ['website', 'photography', 'video'] as const;
export type WorkKind = (typeof WORK_KINDS)[number];

const isKind =
  (kind: WorkKind) =>
  (data: Partial<{ kind: WorkKind }>): boolean =>
    data.kind === kind;

/**
 * A piece of work shown in the portfolio. `kind` selects which details group applies;
 * everything else (title, cover, tags, credits) is shared by all kinds.
 */
export const Works: CollectionConfig = {
  slug: 'works',
  labels: { singular: 'Work', plural: 'Works' },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
    defaultColumns: ['title', 'kind', 'publishedOn', '_status'],
  },
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
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Photography', value: 'photography' },
        { label: 'Video', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 280 },
    { name: 'cover', type: 'relationship', relationTo: 'media', required: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'publishedOn',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'credits',
      type: 'array',
      labels: { singular: 'Credit', plural: 'Credits' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'website',
      type: 'group',
      admin: { condition: isKind('website') },
      fields: [
        { name: 'liveUrl', type: 'text', required: true },
        { name: 'repositoryUrl', type: 'text' },
        { name: 'builtWith', type: 'array', fields: [{ name: 'name', type: 'text', required: true }] },
        { name: 'screenshots', type: 'relationship', relationTo: 'media', hasMany: true },
      ],
    },
    {
      name: 'photography',
      type: 'group',
      admin: { condition: isKind('photography') },
      fields: [
        { name: 'location', type: 'text' },
        { name: 'shotOn', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
        {
          name: 'frames',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'photo', type: 'relationship', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'video',
      type: 'group',
      admin: { condition: isKind('video') },
      fields: [
        { name: 'role', type: 'text', admin: { description: 'Your role, e.g. Director, DoP.' } },
        { name: 'runtimeSeconds', type: 'number', min: 0 },
        { name: 'embed', type: 'relationship', relationTo: 'video-embeds' },
        { name: 'file', type: 'relationship', relationTo: 'media' },
        { name: 'stills', type: 'relationship', relationTo: 'media', hasMany: true },
      ],
    },
  ],
};
