-- CreateEnum
CREATE TYPE "JerseyOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customLength" TEXT,
ADD COLUMN     "customNotes" TEXT,
ADD COLUMN     "customWidth" TEXT,
ADD COLUMN     "jerseyName" TEXT,
ADD COLUMN     "jerseyNumber" INTEGER,
ADD COLUMN     "shirtSize" TEXT,
ADD COLUMN     "shortsSize" TEXT,
ADD COLUMN     "socksSize" TEXT,
ALTER COLUMN "shippingAddress" DROP NOT NULL,
ALTER COLUMN "totalAmount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "JerseyOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "shirtSize" TEXT NOT NULL,
    "shortsSize" TEXT NOT NULL,
    "socksSize" TEXT NOT NULL,
    "jerseyName" TEXT NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "customLength" TEXT,
    "customWidth" TEXT,
    "customNotes" TEXT,
    "status" "JerseyOrderStatus" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JerseyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JerseyOrder_userId_idx" ON "JerseyOrder"("userId");

-- CreateIndex
CREATE INDEX "JerseyOrder_status_idx" ON "JerseyOrder"("status");

-- CreateIndex
CREATE INDEX "JerseyOrder_isDeleted_idx" ON "JerseyOrder"("isDeleted");

-- CreateIndex
CREATE INDEX "JerseyOrder_createdAt_idx" ON "JerseyOrder"("createdAt");

-- AddForeignKey
ALTER TABLE "JerseyOrder" ADD CONSTRAINT "JerseyOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
