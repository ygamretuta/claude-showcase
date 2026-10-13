import { revalidateTag } from 'next/cache';
import type { CollectionConfig } from 'payload';

import { isAuthenticated, publicRead } from '@/shared/payload/access';

/**
 * A read-only snapshot of a work's GitHub repository. Written only by the sync
 * job (local API), so create and update are closed to the admin UI and REST.
 */
export const RepositoryActivity: CollectionConfig = {
  slug: 'repository-activity',
  labels: { singular: 'Repository activity', plural: 'Repository activity' },
  admin: {
    useAsTitle: 'repository',
    group: 'Activity',
    defaultColumns: ['repository', 'lastCommitAt', 'commitsLast30Days', 'syncedAt'],
    components: { beforeListTable: ['/features/activity/components/SyncButton#SyncButton'] },
  },
  access: {
    read: publicRead,
    create: () => false,
    update: () => false,
    delete: isAuthenticated,
  },
  endpoints: [
    {
      path: '/sync',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        const { syncActivity } = await import('../server/sync');
        const report = await syncActivity(req.payload);
        revalidateTag('works', 'max');
        return Response.json(report);
      },
    },
  ],
  fields: [
    { name: 'work', type: 'relationship', relationTo: 'works', required: true, unique: true },
    { name: 'repository', type: 'text', required: true, admin: { description: 'owner/name' } },
    { name: 'lastCommitAt', type: 'date' },
    { name: 'commitsLast30Days', type: 'number', defaultValue: 0 },
    {
      name: 'recentCommits',
      type: 'array',
      fields: [
        { name: 'sha', type: 'text', required: true },
        { name: 'message', type: 'text', required: true },
        { name: 'committedAt', type: 'date' },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'latestRelease',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'publishedAt', type: 'date' },
      ],
    },
    { name: 'syncedAt', type: 'date', required: true },
    { name: 'syncError', type: 'text', admin: { description: 'Set when the last sync failed.' } },
  ],
};
