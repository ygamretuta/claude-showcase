import type { Access } from 'payload';

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const publicRead: Access = () => true;

/** Visitors see published documents only; signed-in editors see drafts too. */
export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
