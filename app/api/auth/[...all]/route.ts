/**
 * Better Auth API Route Handler
 *
 * Handles all authentication API requests at /api/auth/*
 * This includes sign in, sign up, sign out, sessions, OAuth callbacks, etc.
 *
 * @see skills/auth/SKILL.md for detailed documentation
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
