-- Convert amenities from a JSON-encoded string to a native text[] array,
-- keeping every existing value.
ALTER TABLE "Listing" ADD COLUMN "amenities_new" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
UPDATE "Listing"
  SET "amenities_new" = ARRAY(SELECT json_array_elements_text("amenities"::json))
  WHERE "amenities" IS NOT NULL AND "amenities" <> '';
ALTER TABLE "Listing" DROP COLUMN "amenities";
ALTER TABLE "Listing" RENAME COLUMN "amenities_new" TO "amenities";

-- Session versioning for "log out other devices" on password reset.
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

-- Failed login tracking.
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");
