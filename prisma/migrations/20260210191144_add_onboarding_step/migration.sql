-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('NOT_STARTED', 'CATEGORY', 'BUSINESS_INFO', 'SCHEDULE', 'SERVICES', 'CONTACT', 'COMPLETED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'NOT_STARTED';
