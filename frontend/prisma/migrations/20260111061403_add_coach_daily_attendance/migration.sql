-- CreateTable
CREATE TABLE "CoachDailyAttendance" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "DailyAttendanceStatus" NOT NULL,
    "markedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachDailyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachDailyAttendance_coachId_idx" ON "CoachDailyAttendance"("coachId");

-- CreateIndex
CREATE INDEX "CoachDailyAttendance_date_idx" ON "CoachDailyAttendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CoachDailyAttendance_coachId_date_key" ON "CoachDailyAttendance"("coachId", "date");

-- AddForeignKey
ALTER TABLE "CoachDailyAttendance" ADD CONSTRAINT "CoachDailyAttendance_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;
