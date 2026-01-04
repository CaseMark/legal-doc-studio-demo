/**
 * Access Control & Permissions
 *
 * Defines what each role can do in the application.
 * Uses Better Auth's access control system.
 *
 * @see skills/auth/SKILL.md for detailed documentation
 */

import { createAccessControl } from "better-auth/plugins/access";

/**
 * Permission statements define all possible actions on each resource.
 * Add new resources and actions here as your app grows.
 */
const statement = {
  // Organization management
  organization: ["update", "delete"],

  // Member management
  member: ["create", "read", "update", "delete"],

  // Invitation management
  invitation: ["create", "cancel"],

  // Matter/case management (legal-specific)
  matter: ["create", "read", "update", "delete", "assign"],

  // Document management
  document: ["create", "read", "update", "delete", "share"],

  // Billing/financial (legal-specific)
  billing: ["read", "create", "approve"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Owner Role
 * Full control over everything in the organization
 */
export const owner = ac.newRole({
  organization: ["update", "delete"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "cancel"],
  matter: ["create", "read", "update", "delete", "assign"],
  document: ["create", "read", "update", "delete", "share"],
  billing: ["read", "create", "approve"],
});

/**
 * Partner Role
 * Can manage staff and matters, but can't delete the organization
 */
export const partner = ac.newRole({
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "cancel"],
  matter: ["create", "read", "update", "delete", "assign"],
  document: ["create", "read", "update", "delete", "share"],
  billing: ["read", "create", "approve"],
});

/**
 * Associate Role
 * Works on matters, can manage documents
 */
export const associate = ac.newRole({
  member: ["read"],
  matter: ["read", "update"], // Assigned matters only (enforced at query level)
  document: ["create", "read", "update", "delete"],
  billing: ["read"],
});

/**
 * Paralegal Role
 * Support on matters, limited document editing
 */
export const paralegal = ac.newRole({
  member: ["read"],
  matter: ["read"],
  document: ["create", "read", "update"],
  billing: ["read"],
});

/**
 * Staff Role
 * Administrative access, primarily read-only for legal matters
 */
export const staff = ac.newRole({
  member: ["read"],
  matter: ["read"],
  document: ["read"],
  billing: ["read", "create"],
});

/**
 * Client Role
 * External client with read-only access to their own matters
 */
export const client = ac.newRole({
  matter: ["read"], // Own matters only (enforced at query level)
  document: ["read"], // Their documents only
});

/**
 * All roles for export to Better Auth config
 */
export const roles = {
  owner,
  partner,
  associate,
  paralegal,
  staff,
  client,
};
