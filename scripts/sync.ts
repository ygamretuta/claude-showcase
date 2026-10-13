import config from '@payload-config';
import { getPayload } from 'payload';

import { syncActivity } from '@/features/activity/server/sync';

/** Runs the GitHub activity sync once from the command line. */
const payload = await getPayload({ config });
console.log(JSON.stringify(await syncActivity(payload), null, 2));
process.exit(0);
