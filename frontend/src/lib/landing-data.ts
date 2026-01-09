import prisma from "./prisma";

export const getLandingPageData = async () => {
    try {
        const [coachCount, studentCount, ageGroups, coaches] = await Promise.all([
            prisma.coach.count(),
            prisma.student.count(),
            prisma.ageGroup.findMany({
                take: 4,
                orderBy: { minAge: 'asc' }
            }),
            prisma.coach.findMany({
                take: 3,
                include: {
                    ageGroups: {
                        include: {
                            ageGroup: true
                        }
                    }
                }
            })
        ]);

        return {
            stats: {
                coaches: coachCount,
                students: studentCount,
            },
            ageGroups: ageGroups.map(ag => ({
                name: ag.name,
                ages: `${ag.minAge}-${ag.maxAge} years`,
                description: ag.description
            })),
            coaches: coaches.map(c => ({
                name: `${c.firstName} ${c.lastName}`,
                role: c.specialization?.[0] || "Coach",
                exp: c.createdAt ? `${new Date().getFullYear() - c.createdAt.getFullYear()}+ years` : "Expert",
                photo: c.photo
            }))
        };
    } catch (error) {
        console.error("Error fetching landing page data:", error);
        return null;
    }
};
