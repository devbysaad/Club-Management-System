import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log("🧹 Clearing all data from database...");

    try {
        // Delete in correct order (respecting foreign key constraints)
        await prisma.attendance.deleteMany();
        console.log("✅ Deleted attendance records");

        await prisma.result.deleteMany();
        console.log("✅ Deleted results");

        await prisma.trainingSession.deleteMany();
        console.log("✅ Deleted training sessions");

        await prisma.fixture.deleteMany();
        console.log("✅ Deleted fixtures");

        await prisma.coachAgeGroup.deleteMany();
        console.log("✅ Deleted coach-age group connections");

        await prisma.student.deleteMany();
        console.log("✅ Deleted students/players");

        await prisma.parent.deleteMany();
        console.log("✅ Deleted parents");

        await prisma.coach.deleteMany();
        console.log("✅ Deleted coaches");

        await prisma.admin.deleteMany();
        console.log("✅ Deleted admins");

        await prisma.ageGroup.deleteMany();
        console.log("✅ Deleted age groups");

        await prisma.event.deleteMany();
        console.log("✅ Deleted events");

        await prisma.announcement.deleteMany();
        console.log("✅ Deleted announcements");

        await prisma.order.deleteMany();
        console.log("✅ Deleted orders");

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
