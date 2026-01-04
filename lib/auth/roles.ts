/**
 * Legal Role Definitions
 *
 * Standard roles for legal applications. These map to common positions
 * and access levels in law firms and legal tech apps.
 *
 * @see skills/auth/SKILL.md for detailed documentation
 */

export const LegalRoles = {
  /** Firm owner / Managing partner - full control over organization */
  OWNER: "owner",
  /** Equity partner - high access, can manage staff and matters */
  PARTNER: "partner",
  /** Associate attorney - works on assigned matters */
  ASSOCIATE: "associate",
  /** Paralegal - support staff with limited edit access */
  PARALEGAL: "paralegal",
  /** Admin/support staff - operational access */
  STAFF: "staff",
  /** External client - read-only access to their own matters */
  CLIENT: "client",
} as const;

export type LegalRole = (typeof LegalRoles)[keyof typeof LegalRoles];

/**
 * Human-readable descriptions for displaying in UI
 */
export const RoleDescriptions: Record<LegalRole, string> = {
  owner: "Full control over the organization",
  partner: "Can manage staff and access all matters",
  associate: "Can work on assigned matters",
  paralegal: "Can support on assigned matters",
  staff: "Administrative access",
  client: "Can view their own matters",
};

/**
 * Role hierarchy for permission inheritance
 * Higher index = more permissions
 */
export const RoleHierarchy: LegalRole[] = [
  "client",
  "staff",
  "paralegal",
  "associate",
  "partner",
  "owner",
];

/**
 * Check if a role has at least the same level as another role
 */
export function hasMinimumRole(
  userRole: LegalRole,
  requiredRole: LegalRole
): boolean {
  const userLevel = RoleHierarchy.indexOf(userRole);
  const requiredLevel = RoleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}
