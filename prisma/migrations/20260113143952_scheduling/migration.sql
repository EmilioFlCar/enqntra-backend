/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `durationMin` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,dayOfWeek]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMinutes` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "durationMin",
ADD COLUMN     "durationMinutes" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_businessId_startAt_endAt_idx" ON "Appointment"("businessId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_businessId_dayOfWeek_key" ON "Schedule"("businessId", "dayOfWeek");
