import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");

  // Delete in correct order (respecting foreign key constraints)
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.trainingSession.deleteMany();
  await prisma.fixture.deleteMany();
  await prisma.coachAgeGroup.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.ageGroup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared!");
  console.log("🌱 Starting to seed...");

  // ======== USERS ========
  // Admins
  console.log("Creating admins...");
  for (let i = 1; i <= 2; i++) {
    await prisma.user.create({
      data: {
        email: `admin${i}@club.com`,
        password: `admin${i}pass`,
        role: "ADMIN",
        admin: {
          create: {
            firstName: `Admin${i}`,
            lastName: `User${i}`,
            email: `admin${i}@club.com`,
            phone: `123-456-78${i}0`,
          },
        },
      },
    });
  }

  // Coaches
  console.log("Creating coaches...");
  const coaches = [];
  const numberOfCoaches = Math.floor(Math.random() * 11) + 5; // Random 5–15
  for (let i = 1; i <= numberOfCoaches; i++) {
    const suffix = Math.floor(Math.random() * 10000); // Unique email
    const coachUser = await prisma.user.create({
      data: {
        email: `coach${i}_${suffix}@club.com`,
        password: `coach${i}pass`,
        role: "COACH",
        coach: {
          create: {
            firstName: `Coach${i}`,
            lastName: `Lastname${i}`,
            email: `coach${i}_${suffix}@club.com`,
            sex: i % 2 === 0 ? "MALE" : "FEMALE",
            specialization: ["Offense", "Defense"].slice(0, (i % 2) + 1),
          },
        },
      },
      include: { coach: true },
    });
    coaches.push(coachUser.coach!);
  }

  // Age Groups
  console.log("Creating age groups...");
  const ageGroups = [];
  for (let i = 1; i <= 6; i++) {
    const group = await prisma.ageGroup.create({
      data: {
        name: `U${10 + i}`,
        minAge: 10 + i - 1,
        maxAge: 10 + i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
    ageGroups.push(group);
  }

  // Connect Coaches to Age Groups (random subset)
  console.log("Connecting coaches to age groups...");
  for (const coach of coaches) {
    const numberOfGroups = Math.floor(Math.random() * ageGroups.length) + 1; // at least 1
    const shuffledGroups = ageGroups
      .map(a => a)
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfGroups);

    await prisma.coachAgeGroup.createMany({
      data: shuffledGroups.map(ag => ({ coachId: coach.id, ageGroupId: ag.id })),
      skipDuplicates: true,
    });
  }

  // Parents
  console.log("Creating parents...");
  const parents = [];
  for (let i = 1; i <= 25; i++) {
    const parentUser = await prisma.user.create({
      data: {
        email: `parent${i}@club.com`,
        password: `parent${i}pass`,
        role: "PARENT",
        parent: {
          create: {
            firstName: `Parent${i}`,
            lastName: `Lastname${i}`,
            email: `parent${i}@club.com`,
            phone: `555-000-00${i.toString().padStart(2, "0")}`,
            address: `Address ${i}`,
          },
        },
      },
      include: { parent: true },
    });
    parents.push(parentUser.parent!);
  }

  // Players / Students
  console.log("Creating players...");
  const positions = ["GK", "DEF", "MID", "FWD"];
  const players = [];
  const numberOfPlayers = Math.floor(Math.random() * 41) + 30; // Random 30–70
  
  for (let i = 1; i <= numberOfPlayers; i++) {
    const suffix = Math.floor(Math.random() * 10000); // Unique email
    const displayId = `PLR${1000 + i}`; // Unique displayId
    const position = positions[Math.floor(Math.random() * positions.length)]; // Random position
  
    const playerUser = await prisma.user.create({
      data: {
        email: `player${i}_${suffix}@club.com`,
        password: `player${i}pass`,
        role: "STUDENT",
        student: {
          create: {
            firstName: `Player${i}`,
            lastName: `Lastname${i}`,
            email: `player${i}_${suffix}@club.com`,
            sex: i % 2 === 0 ? "MALE" : "FEMALE",
            jerseyNumber: i,
            position, // assign random position
            displayId, // assign unique displayId
            dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - (10 + (i % 8)))), // age between 10–17
            ageGroupId: ageGroups[i % ageGroups.length].id,
            parentId: parents[i % parents.length].id,
          },
        },
      },
      include: { student: true },
    });
  
    players.push(playerUser.student!);
  }

  // Training Sessions
  console.log("Creating training sessions...");
  const trainingSessions = [];
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const session = await prisma.trainingSession.create({
      data: {
        title: `Training ${i}`,
        date,
        dayOfWeek: daysOfWeek[i % 7],
        startTime: new Date(new Date().setHours(10 + i % 3)),
        endTime: new Date(new Date().setHours(12 + i % 3)),
        venue: `Field ${i}`,
        type: "TRAINING",
        coachId: coaches[i % coaches.length].id,
        ageGroupId: ageGroups[i % ageGroups.length].id,
      },
    });
    trainingSessions.push(session);
  }

  // Fixtures
  console.log("Creating fixtures...");
  const fixtures = [];
  for (let i = 1; i <= 10; i++) {
    const fixtureDate = new Date();
    fixtureDate.setDate(fixtureDate.getDate() + i);
    const fixture = await prisma.fixture.create({
      data: {
        title: `Fixture ${i}`,
        opponent: `Team ${i}`,
        date: fixtureDate,
        time: new Date(new Date().setHours(15 + i % 3)),
        venue: `Stadium ${i}`,
        isHome: i % 2 === 0,
        type: "LEAGUE",
        ageGroupId: ageGroups[i % ageGroups.length].id,
      },
    });
    fixtures.push(fixture);
  }

  // Attendances
  console.log("Creating attendance records...");
  for (const session of trainingSessions) {
    for (const player of players) {
      if (player.ageGroupId === session.ageGroupId) {
        await prisma.attendance.create({
          data: {
            studentId: player.id,
            trainingSessionId: session.id,
            status: "PRESENT",
            markedBy: coaches[0].id,
          },
        });
      }
    }
  }

  // Results
  console.log("Creating match results...");
  for (const fixture of fixtures) {
    for (const player of players) {
      if (player.ageGroupId === fixture.ageGroupId) {
        await prisma.result.create({
          data: {
            studentId: player.id,
            fixtureId: fixture.id,
            goals: Math.floor(Math.random() * 3),
            assists: Math.floor(Math.random() * 2),
            rating: Math.random() * 10,
            minutesPlayed: 90,
          },
        });
      }
    }
  }

  // Events
  console.log("Creating events...");
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        date: new Date(new Date().setDate(new Date().getDate() + i)),
        startTime: new Date(new Date().setHours(10 + i)),
        endTime: new Date(new Date().setHours(12 + i)),
        venue: `Club Venue ${i}`,
        type: "MEETING",
      },
    });
  }

  console.log("✅ Football club seeding completed successfully!");
  console.log(`
📊 Summary:
- Admins: 2
- Coaches: ${numberOfCoaches}
- Parents: 25
- Players: ${numberOfPlayers}
- Age Groups: 6
- Training Sessions: 30
- Fixtures: 10
- Events: 5
  `);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
