-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "MonthlyFee" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "FeeStatus" NOT NULL DEFAULT 'UNPAID',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyFee_parentId_idx" ON "MonthlyFee"("parentId");

-- CreateIndex
CREATE INDEX "MonthlyFee_status_idx" ON "MonthlyFee"("status");

-- CreateIndex
CREATE INDEX "MonthlyFee_dueDate_idx" ON "MonthlyFee"("dueDate");

-- CreateIndex
CREATE INDEX "MonthlyFee_month_year_idx" ON "MonthlyFee"("month", "year");

-- CreateIndex
CREATE INDEX "MonthlyFee_isDeleted_idx" ON "MonthlyFee"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyFee_studentId_month_year_key" ON "MonthlyFee"("studentId", "month", "year");

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
