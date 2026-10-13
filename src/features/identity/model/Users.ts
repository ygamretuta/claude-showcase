import type { CollectionConfig } from 'payload';

/** Editors who may sign in to the admin. Single-owner today; roles can grow here. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Editor', plural: 'Editors' },
  admin: { useAsTitle: 'email', group: 'Identity' },
  auth: true,
  fields: [],
};
