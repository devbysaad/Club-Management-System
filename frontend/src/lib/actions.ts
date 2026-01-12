"use server";

import { revalidatePath } from "next/cache";
import {
    CoachSchema,
    StudentSchema,
    ParentSchema,
    AgeGroupSchema,
    TrainingSessionSchema,
    FixtureSchema,
    EventSchema,
    AnnouncementSchema,
    ResultSchema,
    AttendanceSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import {
    withRole,
    withTransaction,
    ActionResult,
    createClerkUserWithPassword,
    sendClerkInvitation,
    logActivity,
    softDelete,
    hardDelete,
    getCurrentUser,
    coachOwnsAgeGroup,
    parentOwnsStudent,
    deleteFromClerk,
} from "./action-helpers";
import { Role } from "@prisma/client";

type CurrentState = ActionResult;

// ============================================
// COACH ACTIONS
// ============================================

export const createCoach = async (
    currentState: CurrentState,
    data: CoachSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Create Clerk user with password from form
        const clerkResult = await createClerkUserWithPassword({
            email: data.email!,
            password: data.password,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            role: Role.COACH,
        });

        if (!clerkResult.success) {
            return clerkResult;
        }

        const clerkUserId = clerkResult.data!.clerkUserId;

        // Save to database in transaction
        return withTransaction(async (tx) => {
            // Upsert AppUser (create or update if exists)
            await tx.appUser.upsert({
                where: { id: clerkUserId },
                create: {
                    id: clerkUserId,
                    email: data.email!,
                    role: Role.COACH,
                    status: "ACTIVE",
                },
                update: {
                    email: data.email!,
                    role: Role.COACH,
                    status: "ACTIVE",
                },
            });

            // 3. Create Coach profile
            const coach = await tx.coach.create({
                data: {
                    userId: clerkUserId,
                    displayId: data.displayId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    photo: data.photo,
                    specialization: data.specialization || [],
                    sex: data.sex,
                    bloodType: data.bloodType,
                },
            });

            // 4. Assign to age groups if provided
            if (data.ageGroups && data.ageGroups.length > 0) {
                await tx.coachAgeGroup.createMany({
                    data: data.ageGroups.map((ageGroupId) => ({
                        coachId: coach.id,
                        ageGroupId,
                    })),
                });
            }

            // 5. Log activity
            await logActivity({
                action: "CREATE_COACH",
                performedBy: user.id,
                targetType: "Coach",
                targetId: coach.id,
                details: { firstName: data.firstName, lastName: data.lastName },
            });

            revalidatePath("/list/teachers");
            revalidatePath("/list/coaches");

            return {
                success: true,
                error: false,
                message: `Coach ${data.firstName} ${data.lastName} created and invitation sent to ${data.email}`,
            };
        });
    });
};

export const updateCoach = async (
    currentState: CurrentState,
    data: CoachSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Coach ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            // 1. Update Coach profile
            const coach = await tx.coach.update({
                where: { id: data.id },
                data: {
                    displayId: data.displayId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    photo: data.photo,
                    specialization: data.specialization || [],
                    sex: data.sex,
                    bloodType: data.bloodType,
                },
            });

            // 2. Update age group assignments (delete old, create new)
            if (data.ageGroups) {
                await tx.coachAgeGroup.deleteMany({
                    where: { coachId: coach.id },
                });

                if (data.ageGroups.length > 0) {
                    await tx.coachAgeGroup.createMany({
                        data: data.ageGroups.map((ageGroupId) => ({
                            coachId: coach.id,
                            ageGroupId,
                        })),
                    });
                }
            }

            // 3. Log activity
            await logActivity({
                action: "UPDATE_COACH",
                performedBy: user.id,
                targetType: "Coach",
                targetId: coach.id,
                details: data,
            });

            revalidatePath("/list/teachers");
            revalidatePath("/list/coaches");

            return {
                success: true,
                error: false,
                message: "Coach updated successfully",
            };
        });
    });
};

export const deleteCoach = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            // 1. Get the coach record to find their userId
            const coach = await prisma.coach.findUnique({
                where: { id },
                select: { userId: true },
            });

            if (!coach) {
                return {
                    success: false,
                    error: true,
                    message: "Coach not found",
                };
            }

            // 2. Delete from Clerk first
            const clerkResult = await deleteFromClerk(coach.userId);
            if (!clerkResult.success) {
                console.error("[DELETE_COACH] Clerk deletion failed:", clerkResult.message);
                // Continue with soft delete even if Clerk deletion fails
            }

            // 3. Soft delete from database
            const result = await softDelete(prisma.coach, id);

            if (result.success) {
                await logActivity({
                    action: "DELETE_COACH",
                    performedBy: user.id,
                    targetType: "Coach",
                    targetId: id,
                });

                revalidatePath("/list/teachers");
                revalidatePath("/list/coaches");
            }

            return result;
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to delete coach",
            };
        }
    });
};

// ============================================
// STUDENT ACTIONS
// ============================================

export const createStudent = async (
    currentState: CurrentState,
    data: StudentSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        console.log('🔵 [createStudent] Starting student creation:', {
            email: data.email,
            phone: data.phone,
            firstName: data.firstName,
            lastName: data.lastName
        });

        // Create Clerk user with password from form
        const clerkResult = await createClerkUserWithPassword({
            email: data.email!,
            password: data.password,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            role: Role.STUDENT,
        });

        console.log('🔵 [createStudent] Clerk result:', clerkResult);

        if (!clerkResult.success) {
            console.error('❌ [createStudent] Clerk creation failed:', clerkResult.message);
            return clerkResult;
        }

        const clerkUserId = clerkResult.data!.clerkUserId;

        // STEP 2: Save to database in transaction
        return withTransaction(async (tx) => {
            // Upsert AppUser (create or update if exists)
            await tx.appUser.upsert({
                where: { id: clerkUserId },
                create: {
                    id: clerkUserId,
                    email: data.email!,
                    role: Role.STUDENT,
                    status: "ACTIVE",
                },
                update: {
                    email: data.email!,
                    role: Role.STUDENT,
                    status: "ACTIVE",
                },
            });

            // Create Student profile
            const student = await tx.student.create({
                data: {
                    userId: clerkUserId,
                    displayId: data.displayId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    dateOfBirth: new Date(data.dateOfBirth),
                    photo: data.photo,
                    phone: data.phone,
                    address: data.address,
                    position: data.position,
                    jerseyNumber: data.jerseyNumber ? parseInt(data.jerseyNumber) : null,
                    sex: data.sex,
                    bloodType: data.bloodType,
                    parentId: data.parentId,
                    ageGroupId: data.ageGroupId,
                },
            });

            // Create enrollment record
            await tx.enrollment.create({
                data: {
                    studentId: student.id,
                    ageGroupId: data.ageGroupId,
                    isActive: true,
                },
            });

            // Log activity
            await logActivity({
                action: "CREATE_STUDENT",
                performedBy: user.id,
                targetType: "Student",
                targetId: student.id,
                details: { firstName: data.firstName, lastName: data.lastName },
            });

            revalidatePath("/list/students");

            return {
                success: true,
                error: false,
                message: `Student ${data.firstName} ${data.lastName} created successfully`,
            };
        });
    });
};

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Student ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const student = await tx.student.update({
                where: { id: data.id },
                data: {
                    displayId: data.displayId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    dateOfBirth: new Date(data.dateOfBirth),
                    photo: data.photo,
                    phone: data.phone,
                    address: data.address,
                    position: data.position,
                    jerseyNumber: data.jerseyNumber ? parseInt(data.jerseyNumber) : null,
                    sex: data.sex,
                    bloodType: data.bloodType,
                    parentId: data.parentId,
                    ageGroupId: data.ageGroupId,
                },
            });

            await logActivity({
                action: "UPDATE_STUDENT",
                performedBy: user.id,
                targetType: "Student",
                targetId: student.id,
                details: data,
            });

            revalidatePath("/list/students");

            return {
                success: true,
                error: false,
                message: "Student updated successfully",
            };
        });
    });
};

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Soft delete for students (financial/historical data)
        const result = await softDelete(prisma.student, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_STUDENT",
                performedBy: user.id,
                targetType: "Student",
                targetId: id,
            });

            revalidatePath("/list/students");
        }

        return result;
    });
};

// ============================================
// PARENT ACTIONS
// ============================================

export const createParent = async (
    currentState: CurrentState,
    data: ParentSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Create Clerk user with password from form
        const clerkResult = await createClerkUserWithPassword({
            email: data.email!,
            password: data.password,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            role: Role.PARENT,
        });

        if (!clerkResult.success) {
            return clerkResult;
        }

        const clerkUserId = clerkResult.data!.clerkUserId;

        // Save to database in transaction
        return withTransaction(async (tx) => {
            // Upsert AppUser (create or update if exists)
            await tx.appUser.upsert({
                where: { id: clerkUserId },
                create: {
                    id: clerkUserId,
                    email: data.email!,
                    role: Role.PARENT,
                    status: "ACTIVE",
                },
                update: {
                    email: data.email!,
                    role: Role.PARENT,
                    status: "ACTIVE",
                },
            });

            // Create Parent Profile
            const parent = await tx.parent.create({
                data: {
                    userId: clerkUserId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
            });

            // Log Activity
            await logActivity({
                action: "CREATE_PARENT",
                performedBy: user.id,
                targetType: "Parent",
                targetId: parent.id,
                details: { firstName: data.firstName, lastName: data.lastName },
            });

            revalidatePath("/list/parents");

            return {
                success: true,
                error: false,
                message: `Parent ${data.firstName} ${data.lastName} created successfully`,
            };
        });
    });
};

export const updateParent = async (
    currentState: CurrentState,
    data: ParentSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Parent ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const parent = await tx.parent.update({
                where: { id: data.id },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
            });

            await logActivity({
                action: "UPDATE_PARENT",
                performedBy: user.id,
                targetType: "Parent",
                targetId: parent.id,
                details: data,
            });

            revalidatePath("/list/parents");

            return {
                success: true,
                error: false,
                message: "Parent updated successfully",
            };
        });
    });
};

export const deleteParent = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            // 1. Get parent record with userId
            const parent = await prisma.parent.findUnique({
                where: { id },
                select: { userId: true },
            });

            if (!parent) {
                return {
                    success: false,
                    error: true,
                    message: "Parent not found",
                };
            }

            // 2. Get all children's userIds
            const students = await prisma.student.findMany({
                where: { parentId: id },
                select: { userId: true },
            });

            // 3. Delete parent from Clerk
            const parentClerkResult = await deleteFromClerk(parent.userId);
            if (!parentClerkResult.success) {
                console.error("[DELETE_PARENT] Parent Clerk deletion failed:", parentClerkResult.message);
            }

            // 4. Delete all children from Clerk
            for (const student of students) {
                const studentClerkResult = await deleteFromClerk(student.userId);
                if (!studentClerkResult.success) {
                    console.error("[DELETE_PARENT] Student Clerk deletion failed:", studentClerkResult.message);
                }
            }

            // 5. Soft delete parent from database
            await prisma.parent.update({
                where: { id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            });

            // 6. CASCADE: Also soft delete all children (students)
            await prisma.student.updateMany({
                where: { parentId: id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            });

            await logActivity({
                action: "DELETE_PARENT",
                performedBy: user.id,
                targetType: "Parent",
                targetId: id,
            });

            revalidatePath("/list/parents");
            revalidatePath("/list/students"); // Also refresh students list

            return {
                success: true,
                error: false,
                message: "Parent and associated students deleted successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to delete parent",
            };
        }
    });
};

// ============================================
// AGE GROUP ACTIONS
// ============================================

export const createAgeGroup = async (
    currentState: CurrentState,
    data: AgeGroupSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const ageGroup = await tx.ageGroup.create({
                data: {
                    name: data.name,
                    minAge: parseInt(data.minAge),
                    maxAge: parseInt(data.maxAge),
                    capacity: parseInt(data.capacity),
                    description: data.description,
                },
            });

            await logActivity({
                action: "CREATE_AGE_GROUP",
                performedBy: user.id,
                targetType: "AgeGroup",
                targetId: ageGroup.id,
                details: { name: data.name },
            });

            revalidatePath("/list/classes");

            return {
                success: true,
                error: false,
                message: `Age group "${data.name}" created successfully`,
            };
        });
    });
};

export const updateAgeGroup = async (
    currentState: CurrentState,
    data: AgeGroupSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Age group ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const ageGroup = await tx.ageGroup.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    minAge: parseInt(data.minAge),
                    maxAge: parseInt(data.maxAge),
                    capacity: parseInt(data.capacity),
                    description: data.description,
                },
            });

            await logActivity({
                action: "UPDATE_AGE_GROUP",
                performedBy: user.id,
                targetType: "AgeGroup",
                targetId: ageGroup.id,
                details: data,
            });

            revalidatePath("/list/classes");

            return {
                success: true,
                error: false,
                message: "Age group updated successfully",
            };
        });
    });
};

export const deleteAgeGroup = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Soft delete for age groups (historical data)
        const result = await softDelete(prisma.ageGroup, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_AGE_GROUP",
                performedBy: user.id,
                targetType: "AgeGroup",
                targetId: id,
            });

            revalidatePath("/list/classes");
        }

        return result;
    });
};

// ============================================
// EVENT ACTIONS
// ============================================

export const createEvent = async (
    currentState: CurrentState,
    data: EventSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const event = await tx.event.create({
                data: {
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date),
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                    venue: data.venue,
                    type: data.type,
                },
            });

            await logActivity({
                action: "CREATE_EVENT",
                performedBy: user.id,
                targetType: "Event",
                targetId: event.id,
                details: { title: data.title },
            });

            revalidatePath("/list/events");

            return {
                success: true,
                error: false,
                message: `Event "${data.title}" created successfully`,
            };
        });
    });
};

export const updateEvent = async (
    currentState: CurrentState,
    data: EventSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Event ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const event = await tx.event.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date),
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                    venue: data.venue,
                    type: data.type,
                },
            });

            await logActivity({
                action: "UPDATE_EVENT",
                performedBy: user.id,
                targetType: "Event",
                targetId: event.id,
                details: data,
            });

            revalidatePath("/list/events");

            return {
                success: true,
                error: false,
                message: "Event updated successfully",
            };
        });
    });
};

export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Soft delete for events
        const result = await softDelete(prisma.event, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_EVENT",
                performedBy: user.id,
                targetType: "Event",
                targetId: id,
            });

            revalidatePath("/list/events");
        }

        return result;
    });
};

// ============================================
// ANNOUNCEMENT ACTIONS
// ============================================

export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const announcement = await tx.announcement.create({
                data: {
                    title: data.title,
                    content: data.content,
                    priority: parseInt(data.priority),
                    targetRoles: data.targetRoles,
                    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                },
            });

            await logActivity({
                action: "CREATE_ANNOUNCEMENT",
                performedBy: user.id,
                targetType: "Announcement",
                targetId: announcement.id,
                details: { title: data.title },
            });

            revalidatePath("/list/announcements");

            return {
                success: true,
                error: false,
                message: `Announcement "${data.title}" created successfully`,
            };
        });
    });
};

export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Announcement ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const announcement = await tx.announcement.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    content: data.content,
                    priority: parseInt(data.priority),
                    targetRoles: data.targetRoles,
                    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                },
            });

            await logActivity({
                action: "UPDATE_ANNOUNCEMENT",
                performedBy: user.id,
                targetType: "Announcement",
                targetId: announcement.id,
                details: data,
            });

            revalidatePath("/list/announcements");

            return {
                success: true,
                error: false,
                message: "Announcement updated successfully",
            };
        });
    });
};

export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Soft delete for announcements
        const result = await softDelete(prisma.announcement, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_ANNOUNCEMENT",
                performedBy: user.id,
                targetType: "Announcement",
                targetId: id,
            });

            revalidatePath("/list/announcements");
        }

        return result;
    });
};

// ============================================
// TRAINING SESSION ACTIONS
// ============================================

export const createTrainingSession = async (
    currentState: CurrentState,
    data: TrainingSessionSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        // If coach, verify they own the age group
        if (user.role === Role.COACH) {
            const hasAccess = await coachOwnsAgeGroup(data.ageGroupId);
            if (!hasAccess) {
                return {
                    success: false,
                    error: true,
                    message: "You can only create sessions for your assigned age groups",
                };
            }
        }

        return withTransaction(async (tx) => {
            const session = await tx.trainingSession.create({
                data: {
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date),
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                    dayOfWeek: data.dayOfWeek,
                    venue: data.venue,
                    type: data.type,
                    coachId: data.coachId,
                    ageGroupId: data.ageGroupId,
                },
            });

            await logActivity({
                action: "CREATE_TRAINING_SESSION",
                performedBy: user.id,
                targetType: "TrainingSession",
                targetId: session.id,
                details: { title: data.title },
            });

            revalidatePath("/list/lessons");

            return {
                success: true,
                error: false,
                message: `Training session "${data.title}" created successfully`,
            };
        });
    });
};

export const updateTrainingSession = async (
    currentState: CurrentState,
    data: TrainingSessionSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Session ID is required" };
    }

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        return withTransaction(async (tx) => {
            const session = await tx.trainingSession.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date),
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                    dayOfWeek: data.dayOfWeek,
                    venue: data.venue,
                    type: data.type,
                    coachId: data.coachId,
                    ageGroupId: data.ageGroupId,
                },
            });

            await logActivity({
                action: "UPDATE_TRAINING_SESSION",
                performedBy: user.id,
                targetType: "TrainingSession",
                targetId: session.id,
                details: data,
            });

            revalidatePath("/list/lessons");

            return {
                success: true,
                error: false,
                message: "Training session updated successfully",
            };
        });
    });
};

export const deleteTrainingSession = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        // Soft delete for sessions (historical data)
        const result = await softDelete(prisma.trainingSession, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_TRAINING_SESSION",
                performedBy: user.id,
                targetType: "TrainingSession",
                targetId: id,
            });

            revalidatePath("/list/lessons");
        }

        return result;
    });
};

// ============================================
// FIXTURE ACTIONS
// ============================================

export const createFixture = async (
    currentState: CurrentState,
    data: FixtureSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const fixture = await tx.fixture.create({
                data: {
                    title: data.title,
                    opponent: data.opponent,
                    date: new Date(data.date),
                    time: new Date(data.time),
                    venue: data.venue,
                    isHome: data.isHome === "true",
                    type: data.type,
                    ageGroupId: data.ageGroupId,
                },
            });

            await logActivity({
                action: "CREATE_FIXTURE",
                performedBy: user.id,
                targetType: "Fixture",
                targetId: fixture.id,
                details: { title: data.title },
            });

            revalidatePath("/list/exams");

            return {
                success: true,
                error: false,
                message: `Fixture "${data.title}" created successfully`,
            };
        });
    });
};

export const updateFixture = async (
    currentState: CurrentState,
    data: FixtureSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Fixture ID is required" };
    }

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        return withTransaction(async (tx) => {
            const fixture = await tx.fixture.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    opponent: data.opponent,
                    date: new Date(data.date),
                    time: new Date(data.time),
                    venue: data.venue,
                    isHome: data.isHome === "true",
                    type: data.type,
                    ageGroupId: data.ageGroupId,
                },
            });

            await logActivity({
                action: "UPDATE_FIXTURE",
                performedBy: user.id,
                targetType: "Fixture",
                targetId: fixture.id,
                details: data,
            });

            revalidatePath("/list/exams");

            return {
                success: true,
                error: false,
                message: "Fixture updated successfully",
            };
        });
    });
};

export const deleteFixture = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        // Soft delete for fixtures
        const result = await softDelete(prisma.fixture, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_FIXTURE",
                performedBy: user.id,
                targetType: "Fixture",
                targetId: id,
            });

            revalidatePath("/list/exams");
        }

        return result;
    });
};

// ============================================
// RESULT ACTIONS
// ============================================

export const createResult = async (
    currentState: CurrentState,
    data: ResultSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        return withTransaction(async (tx) => {
            const result = await tx.result.create({
                data: {
                    studentId: data.studentId,
                    fixtureId: data.fixtureId,
                    goals: parseInt(data.goals),
                    assists: parseInt(data.assists),
                    rating: parseFloat(data.rating),
                    minutesPlayed: parseInt(data.minutesPlayed),
                    yellowCards: parseInt(data.yellowCards || "0"),
                    redCards: parseInt(data.redCards || "0"),
                    notes: data.notes,
                },
            });

            await logActivity({
                action: "CREATE_RESULT",
                performedBy: user.id,
                targetType: "Result",
                targetId: result.id,
                details: { studentId: data.studentId },
            });

            revalidatePath("/list/results");

            return {
                success: true,
                error: false,
                message: "Result recorded successfully",
            };
        });
    });
};

export const updateResult = async (
    currentState: CurrentState,
    data: ResultSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Result ID is required" };
    }

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        return withTransaction(async (tx) => {
            const result = await tx.result.update({
                where: { id: data.id },
                data: {
                    goals: parseInt(data.goals),
                    assists: parseInt(data.assists),
                    rating: parseFloat(data.rating),
                    minutesPlayed: parseInt(data.minutesPlayed),
                    yellowCards: parseInt(data.yellowCards || "0"),
                    redCards: parseInt(data.redCards || "0"),
                    notes: data.notes,
                },
            });

            await logActivity({
                action: "UPDATE_RESULT",
                performedBy: user.id,
                targetType: "Result",
                targetId: result.id,
                details: data,
            });

            revalidatePath("/list/results");

            return {
                success: true,
                error: false,
                message: "Result updated successfully",
            };
        });
    });
};

export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        // Hard delete for results (not financial data)
        const result = await hardDelete(prisma.result, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_RESULT",
                performedBy: user.id,
                targetType: "Result",
                targetId: id,
            });

            revalidatePath("/list/results");
        }

        return result;
    });
};

// ============================================
// ATTENDANCE ACTIONS
// ============================================

export const createAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        return withTransaction(async (tx) => {
            const attendance = await tx.attendance.create({
                data: {
                    studentId: data.studentId,
                    trainingSessionId: data.trainingSessionId,
                    status: data.status,
                    notes: data.notes,
                    markedBy: user.id,
                },
            });

            await logActivity({
                action: "MARK_ATTENDANCE",
                performedBy: user.id,
                targetType: "Attendance",
                targetId: attendance.id,
                details: { studentId: data.studentId, status: data.status },
            });

            revalidatePath("/list/attendance");

            return {
                success: true,
                error: false,
                message: "Attendance marked successfully",
            };
        });
    });
};

export const updateAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Attendance ID is required" };
    }

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        return withTransaction(async (tx) => {
            const attendance = await tx.attendance.update({
                where: { id: data.id },
                data: {
                    status: data.status,
                    notes: data.notes,
                },
            });

            await logActivity({
                action: "UPDATE_ATTENDANCE",
                performedBy: user.id,
                targetType: "Attendance",
                targetId: attendance.id,
                details: data,
            });

            revalidatePath("/list/attendance");

            return {
                success: true,
                error: false,
                message: "Attendance updated successfully",
            };
        });
    });
};

export const deleteAttendance = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN, Role.COACH], async (user) => {
        // Hard delete for attendance (not financial data)
        const result = await hardDelete(prisma.attendance, id);

        if (result.success) {
            await logActivity({
                action: "DELETE_ATTENDANCE",
                performedBy: user.id,
                targetType: "Attendance",
                targetId: id,
            });

            revalidatePath("/list/attendance");
        }

        return result;
    });
};
