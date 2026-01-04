/**
 * Better Auth Server Configuration
 *
 * This is the main authentication configuration for the server.
 * It handles user authentication, sessions, and organization management.
 *
 * @see skills/auth/SKILL.md for detailed documentation
 */

import { betterAuth } from "better-auth";
import { organization, twoFactor } from "better-auth/plugins";
import { ac, roles } from "./permissions";

/**
 * Main auth configuration
 *
 * SETUP REQUIRED:
 * 1. Set BETTER_AUTH_SECRET in .env.local (run: openssl rand -base64 32)
 * 2. Set BETTER_AUTH_URL in .env.local (your app URL)
 * 3. Configure database adapter (see database skill)
 * 4. Run migrations: bunx @better-auth/cli migrate
 */
export const auth = betterAuth({
  /**
   * Database Configuration
   *
   * Uncomment and configure when you set up your database:
   *
   * import { drizzleAdapter } from "better-auth/adapters/drizzle";
   * import { db } from "@/lib/db";
   *
   * database: drizzleAdapter(db, {
   *   provider: "pg",
   * }),
   */

  /**
   * Email & Password Authentication
   * Enabled by default - users can sign up with email/password
   */
  emailAndPassword: {
    enabled: true,
    // Uncomment to require email verification:
    // requireEmailVerification: true,
  },

  /**
   * OAuth Providers (Optional)
   * Add credentials in .env.local to enable
   *
   * socialProviders: {
   *   google: {
   *     clientId: process.env.GOOGLE_CLIENT_ID!,
   *     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
   *   },
   *   microsoft: {
   *     clientId: process.env.MICROSOFT_CLIENT_ID!,
   *     clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
   *   },
   * },
   */

  /**
   * Session Configuration
   */
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60, // Refresh session every hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  /**
   * Plugins
   */
  plugins: [
    /**
     * Organization Plugin
     * Enables multi-tenant support with roles and permissions
     */
    organization({
      ac,
      roles,
      /**
       * Send invitation emails
       * TODO: Integrate with case.dev Email API
       */
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invite/${data.id}`;
        // TODO: Replace with actual email sending
        console.log(
          `[Auth] Invite ${data.email} to ${data.organization.name}: ${inviteLink}`
        );
      },
    }),

    /**
     * Two-Factor Authentication Plugin
     * Enables TOTP and backup codes for enhanced security
     */
    twoFactor({
      issuer: process.env.BETTER_AUTH_APP_NAME || "Legal App",
      /**
       * Send OTP codes
       * TODO: Integrate with case.dev Email API
       */
      otpOptions: {
        async sendOTP({ user, otp }) {
          // TODO: Replace with actual email/SMS sending
          console.log(`[Auth] 2FA code for ${user.email}: ${otp}`);
        },
      },
    }),
  ],
});

/**
 * Export auth types for use in other files
 */
export type Auth = typeof auth;
