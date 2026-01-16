import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log("🧹 Clearing all data from database...");

    try {
        // Delete in correct order (respecting foreign key constraints)
        // Start with records that have no dependencies

        // Fee payments first (depends on fee records)
        await prisma.feePayment.deleteMany();
        console.log("✅ Deleted fee payments");

        // Player fee records (depends on students and fee plans)
        await prisma.playerFeeRecord.deleteMany();
        console.log("✅ Deleted player fee records");

        // Monthly fees (legacy)
        await prisma.monthlyFee.deleteMany();
        console.log("✅ Deleted monthly fees");

        // Activity logs
        await prisma.activityLog.deleteMany();
        console.log("✅ Deleted activity logs");

        // Email logs
        await prisma.emailLog.deleteMany();
        console.log("✅ Deleted email logs");

        // Clerk sync logs
        await prisma.clerkSyncLog.deleteMany();
        console.log("✅ Deleted clerk sync logs");

        // File uploads
        await prisma.fileUpload.deleteMany();
        console.log("✅ Deleted file uploads");

        // Attendance records
        await prisma.attendance.deleteMany();
        console.log("✅ Deleted attendance records");

        await prisma.dailyAttendance.deleteMany();
        console.log("✅ Deleted daily attendance records");

        await prisma.coachDailyAttendance.deleteMany();
        console.log("✅ Deleted coach daily attendance");

        await prisma.staffDailyAttendance.deleteMany();
        console.log("✅ Deleted staff daily attendance");

        // Results
        await prisma.result.deleteMany();
        console.log("✅ Deleted results");

        // Training sessions
        await prisma.trainingSession.deleteMany();
        console.log("✅ Deleted training sessions");

        // Fixtures
        await prisma.fixture.deleteMany();
        console.log("✅ Deleted fixtures");

        // Enrollments
        await prisma.enrollment.deleteMany();
        console.log("✅ Deleted enrollments");

        // Coach-age group connections
        await prisma.coachAgeGroup.deleteMany();
        console.log("✅ Deleted coach-age group connections");

        // Payments (depends on orders)
        await prisma.payment.deleteMany();
        console.log("✅ Deleted payments");

        // Order items (depends on orders and products)
        await prisma.orderItem.deleteMany();
        console.log("✅ Deleted order items");

        // Orders
        await prisma.order.deleteMany();
        console.log("✅ Deleted orders");

        // Jersey orders
        await prisma.jerseyOrder.deleteMany();
        console.log("✅ Deleted jersey orders");

        // Products
        await prisma.product.deleteMany();
        console.log("✅ Deleted products");

        // Fee plans
        await prisma.feePlan.deleteMany();
        console.log("✅ Deleted fee plans");

        // Admissions
        await prisma.admission.deleteMany();
        console.log("✅ Deleted admissions");

        // Students/Players
        await prisma.student.deleteMany();
        console.log("✅ Deleted students/players");

        // Parents
        await prisma.parent.deleteMany();
        console.log("✅ Deleted parents");

        // Coaches
        await prisma.coach.deleteMany();
        console.log("✅ Deleted coaches");

        // Staff
        await prisma.staff.deleteMany();
        console.log("✅ Deleted staff");

        // Admins
        await prisma.admin.deleteMany();
        console.log("✅ Deleted admins");

        // Age groups
        await prisma.ageGroup.deleteMany();
        console.log("✅ Deleted age groups");

        // Events
        await prisma.event.deleteMany();
        console.log("✅ Deleted events");

        // Announcements
        await prisma.announcement.deleteMany();
        console.log("✅ Deleted announcements");

        // App users (last, as it's referenced by many tables)
        await prisma.appUser.deleteMany();
        console.log("✅ Deleted all users");

        console.log("\n✅ Database cleared successfully!");
        console.log("📊 All dummy data has been removed.\n");
    } catch (error) {
        console.error("❌ Error clearing database:", error);
        throw error;
    }
}

clearDatabase()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
