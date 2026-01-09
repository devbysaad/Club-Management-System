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
  await prisma.order.deleteMany();
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

  // Players / Students - FIXED AGE CALCULATION
  console.log("Creating players...");
  const positions = ["GK", "DEF", "MID", "FWD"];
  const players = [];
  const numberOfPlayers = Math.floor(Math.random() * 41) + 30; // Random 30–70

  for (let i = 1; i <= numberOfPlayers; i++) {
    const suffix = Math.floor(Math.random() * 10000); // Unique email
    const displayId = `PLR${1000 + i}`; // Unique displayId
    const position = positions[Math.floor(Math.random() * positions.length)]; // Random position

    // Get the age group for this player
    const ageGroup = ageGroups[i % ageGroups.length];

    // Calculate a valid age within the age group range
    const playerAge = Math.floor(Math.random() * (ageGroup.maxAge - ageGroup.minAge + 1)) + ageGroup.minAge;

    // Calculate date of birth based on the age (so current age matches the age group)
    const today = new Date();
    const birthYear = today.getFullYear() - playerAge;
    const birthMonth = Math.floor(Math.random() * 12); // Random month
    const birthDay = Math.floor(Math.random() * 28) + 1; // Random day (1-28 to avoid month issues)
    const dateOfBirth = new Date(birthYear, birthMonth, birthDay);

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
            position,
            displayId,
            dateOfBirth, // Correct date of birth matching age group
            ageGroupId: ageGroup.id,
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

  // Announcements
  console.log("Creating announcements...");
  const announcementTitles = [
    "Team Training Schedule Update",
    "Match Day Preparation",
    "Parent-Coach Meeting Next Week",
    "New Equipment Available",
    "Tournament Registration Open",
    "End of Season Celebration",
    "Facility Maintenance Notice",
    "Player of the Month Awards",
    "Uniform Collection Reminder",
    "Club Fundraiser Event",
  ];

  const announcementContents = [
    "Please note the updated training schedule for this week.",
    "All players must arrive 2 hours before kickoff.",
    "Parents are invited to discuss player progress.",
    "New training equipment is now available in the store room.",
    "Register your team for the upcoming regional tournament.",
    "Join us for the end of season party and awards ceremony.",
    "Facilities will be closed for maintenance this weekend.",
    "Congratulations to our outstanding players this month!",
    "Please collect your new uniforms from the office.",
    "Support our club by participating in the upcoming fundraiser.",
  ];

  const targetRolesOptions = [
    ["ADMIN", "COACH"],
    ["COACH", "STUDENT"],
    ["PARENT", "STUDENT"],
    ["ADMIN", "COACH", "PARENT"],
    ["ADMIN"],
    ["STUDENT"],
    ["PARENT"],
    ["COACH"],
    ["ADMIN", "PARENT"],
    ["COACH", "PARENT", "STUDENT"],
  ];

  for (let i = 0; i < 10; i++) {
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

    const expiresDate = new Date(publishDate);
    expiresDate.setDate(expiresDate.getDate() + 30 + Math.floor(Math.random() * 30)); // Expires 30-60 days after publish

    await prisma.announcement.create({
      data: {
        title: announcementTitles[i],
        content: announcementContents[i],
        priority: Math.floor(Math.random() * 3) + 1, // Priority 1-3
        targetRoles: targetRolesOptions[i],
        publishedAt: publishDate,
        expiresAt: i % 3 === 0 ? expiresDate : null, // Some don't expire
      },
    });
  }

  // Jersey Orders
  console.log("Creating jersey orders...");
  const orderStatuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const sockSizes = ["S", "M", "L"];
  const jerseyNames = ["SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES", "GARCIA", "MILLER", "DAVIS"];

  // Create some orders from different users (admins, parents, students)
  const allUsers = [
    { userId: "user_2abc123", name: "John Smith", email: "john.smith@example.com", phone: "555-1234" },
    { userId: "user_2def456", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "555-5678" },
    ...parents.slice(0, 5).map((p, i) => ({
      userId: `user_parent_${i}`,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || `${p.firstName.toLowerCase()}@club.com`,
      phone: p.phone || "555-0000"
    })),
    ...players.slice(0, 3).map((p, i) => ({
      userId: `user_player_${i}`,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || `${p.firstName.toLowerCase()}@club.com`,
      phone: "555-9999"
    }))
  ];

  for (let i = 0; i < 12; i++) {
    const user = allUsers[i % allUsers.length];
    const hasCustomMeasurements = i % 3 === 0; // Every 3rd order has custom measurements

    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

    await prisma.order.create({
      data: {
        userId: user.userId,
        customerName: user.name,
        contactNumber: user.phone,
        email: user.email,
        shirtSize: sizes[Math.floor(Math.random() * sizes.length)],
        shortsSize: sizes[Math.floor(Math.random() * sizes.length)],
        socksSize: sockSizes[Math.floor(Math.random() * sockSizes.length)],
        jerseyName: jerseyNames[i % jerseyNames.length],
        jerseyNumber: Math.floor(Math.random() * 99) + 1,
        customLength: hasCustomMeasurements ? `${65 + Math.floor(Math.random() * 20)}` : null,
        customWidth: hasCustomMeasurements ? `${45 + Math.floor(Math.random() * 15)}` : null,
        customNotes: hasCustomMeasurements ? "Please ensure sleeves are slightly longer. Athletic fit preferred." : null,
        status: orderStatuses[i % orderStatuses.length],
        createdAt: orderDate,
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
- Announcements: 10
- Jersey Orders: 12
  `);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });