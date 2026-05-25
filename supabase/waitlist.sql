-- ============================================================================
-- Waitlist (iqama_web pre-launch signup) — in-place script
-- ============================================================================
--
-- Run this in the Supabase SQL Editor against the existing dev DB. Idempotent —
-- re-running converges to the same final state.
--
-- What this creates:
--   1. `waitlist` table (id, email, created_at)
--   2. Case-insensitive unique index on lower(email)
--   3. RLS enabled, with a single "anon INSERT only" policy
--
-- RLS contract: anonymous browser clients (anon key) can INSERT only.
-- No SELECT / UPDATE / DELETE policies exist → nobody can read the list back
-- via the API. Pull rows from the Supabase dashboard or a service-role script.
--
-- Decoupled from the mobile app domain: no FK to users/auth.users, no
-- relationships to other tables.
--
-- Wrapped in BEGIN/COMMIT so a mid-script failure rolls back atomically.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. waitlist table
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS waitlist (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. Case-insensitive unique index on email
-- ----------------------------------------------------------------------------
--
-- The web client treats a 23505 unique-violation as success ("you're already
-- on the list") so duplicate signups never show an error to the user.
--
-- Creating this on an existing populated table can fail if a mixed-case
-- duplicate already exists. Verify first if the table is non-empty:
--   SELECT lower(email), count(*) FROM waitlist GROUP BY 1 HAVING count(*) > 1;
-- ----------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_lower_unique
  ON waitlist (lower(email));

-- ----------------------------------------------------------------------------
-- 3. RLS — anon INSERT only
-- ----------------------------------------------------------------------------

-- No-op when already enabled.
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies aren't CREATE OR REPLACE-able; drop+create for idempotency.
DROP POLICY IF EXISTS "waitlist: anon insert" ON waitlist;
CREATE POLICY "waitlist: anon insert"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Deliberately NO SELECT / UPDATE / DELETE policies. RLS denies by default.

COMMIT;
