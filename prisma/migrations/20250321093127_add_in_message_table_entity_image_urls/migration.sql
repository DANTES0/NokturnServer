-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
