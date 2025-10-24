-- AlterTable
ALTER TABLE "users" ADD COLUMN     "businessDocuments" TEXT[],
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
