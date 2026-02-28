/*
  Warnings:

  - The values [CONTACT] on the enum `OnboardingStep` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OnboardingStep_new" AS ENUM ('NOT_STARTED', 'CATEGORY', 'BUSINESS_INFO', 'SCHEDULE', 'SERVICES', 'COMPLETED');
ALTER TABLE "public"."Business" ALTER COLUMN "onboardingStep" DROP DEFAULT;
ALTER TABLE "Business" ALTER COLUMN "onboardingStep" TYPE "OnboardingStep_new" USING ("onboardingStep"::text::"OnboardingStep_new");
ALTER TYPE "OnboardingStep" RENAME TO "OnboardingStep_old";
ALTER TYPE "OnboardingStep_new" RENAME TO "OnboardingStep";
DROP TYPE "public"."OnboardingStep_old";
ALTER TABLE "Business" ALTER COLUMN "onboardingStep" SET DEFAULT 'NOT_STARTED';
COMMIT;
