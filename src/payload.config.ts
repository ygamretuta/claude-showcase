import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig, type CollectionConfig } from 'payload';
import sharp from 'sharp';

import { RepositoryActivity } from '@/features/activity/model/RepositoryActivity';
import { Works } from '@/features/catalog/model/Works';
import { Exhibits } from '@/features/curation/model/Exhibits';
import { Home } from '@/features/curation/model/Home';
import { Users } from '@/features/identity/model/Users';
import { Media } from '@/features/media/model/Media';
import { VideoEmbeds } from '@/features/media/model/VideoEmbeds';
import { Profile } from '@/features/profile/model/Profile';
import { SiteSettings } from '@/features/profile/model/SiteSettings';
import { Tags } from '@/features/taxonomy/model/Tags';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The works list gets the refresh button here, in the composition root, so the catalog
// domain stays independent of the activity domain.
const WorksWithRefresh: CollectionConfig = {
  ...Works,
  admin: {
    ...Works.admin,
    components: {
      ...Works.admin?.components,
      beforeListTable: [
        {
          path: '/features/activity/components/SyncButton#SyncButton',
          clientProps: { label: 'Refresh works' },
        },
      ],
    },
  },
};

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Media, VideoEmbeds, Tags, WorksWithRefresh, Exhibits, RepositoryActivity],
  globals: [Home, Profile, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { // DATABASE_URI locally; the Neon integration on Vercel provides DATABASE_URL.
    connectionString: process.env.DATABASE_URI ?? process.env.DATABASE_URL ?? '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    }),
  ],
  sharp,
});
