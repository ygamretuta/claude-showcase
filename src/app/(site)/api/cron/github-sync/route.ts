import config from '@payload-config';
import { revalidateTag } from 'next/cache';
import { getPayload } from 'payload';

import { syncActivity } from '@/features/activity/server/sync';

/** Called daily by Vercel Cron (see vercel.json); requires `CRON_SECRET`. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const payload = await getPayload({ config });
  const report = await syncActivity(payload);
  revalidateTag('works', 'max');
  return Response.json(report);
}
