import { describe, expect, it } from 'vitest';

import { summarizeReport } from './report';

describe('summarizeReport', () => {
  it('reports tracked repos only', () => {
    expect(summarizeReport({ discovered: [], synced: ['a/b'], failed: [] })).toBe('Refreshed 1 tracked repo.');
    expect(summarizeReport({ discovered: [], synced: ['a/b', 'a/c'], failed: [] })).toBe('Refreshed 2 tracked repos.');
  });

  it('names newly found repos as drafts', () => {
    expect(summarizeReport({ discovered: ['o/new'], synced: ['o/new', 'o/old'], failed: [] })).toBe(
      'Refreshed 2 tracked repos. Found 1 new (saved as drafts): o/new.',
    );
  });

  it('lists failures', () => {
    expect(
      summarizeReport({ discovered: [], synced: [], failed: [{ repository: 'o/x', error: 'GitHub 403' }] }),
    ).toBe('Refreshed 0 tracked repos. 1 failed: o/x.');
  });
});
