-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isTaken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
