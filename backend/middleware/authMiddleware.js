/**
 * authMiddleware.js
 *
 * Re-exports the canonical Firebase JWT verification middleware so that both
 * `auth.middleware.js` (existing convention) and `authMiddleware.js` (camelCase
 * convention required by the architectural spec) resolve to the same functions.
 */
export { verifyToken, requireRole } from './auth.middleware.js';
