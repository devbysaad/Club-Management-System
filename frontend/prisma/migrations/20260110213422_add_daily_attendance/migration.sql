-- CreateEnum
CREATE TYPE "DailyAttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateTable
CREATE TABLE "DailyAttendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "DailyAttendanceStatus" NOT NULL,
    "markedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyAttendance_studentId_idx" ON "DailyAttendance"("studentId");

-- CreateIndex
CREATE INDEX "DailyAttendance_date_idx" ON "DailyAttendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAttendance_studentId_date_key" ON "DailyAttendance"("studentId", "date");

-- AddForeignKey
ALTER TABLE "DailyAttendance" ADD CONSTRAINT "DailyAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
