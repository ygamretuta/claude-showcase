import type { Field } from 'payload';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** A unique URL slug, generated from `source` when left empty. */
export function slugField(source = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: `URL-safe identifier. Generated from ${source} when left empty.`,
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) return slugify(value);
          const from: unknown = data?.[source];
          return typeof from === 'string' ? slugify(from) : value;
        },
      ],
    },
  };
}
