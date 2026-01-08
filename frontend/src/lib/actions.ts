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
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

// ============================================
// COACH ACTIONS (adapted from Teacher)
// ============================================
export const createCoach = async (
    currentState: CurrentState,
    data: CoachSchema
) => {
    try {
        const user = await clerkClient.users.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            publicMetadata: { role: "coach" },
        });

        await prisma.coach.create({
            data: {
                userId: user.id,
                displayId: data.displayId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                photo: data.photo || null,
                specialization: data.specialization || [],
                sex: data.sex,
                bloodType: data.bloodType || null,
            },
        });

        revalidatePath("/list/coaches");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateCoach = async (
    currentState: CurrentState,
    data: CoachSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        await clerkClient.users.updateUser(data.userId!, {
            firstName: data.firstName,
            lastName: data.lastName,
        });

        await prisma.coach.update({
            where: {
                id: data.id,
            },
            data: {
                displayId: data.displayId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                photo: data.photo || null,
                specialization: data.specialization || [],
                sex: data.sex,
                bloodType: data.bloodType || null,
            },
        });

        revalidatePath("/list/coaches");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteCoach = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const coach = await prisma.coach.findUnique({ where: { id } });
        if (coach) {
            await clerkClient.users.deleteUser(coach.userId);
        }

        await prisma.coach.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/coaches");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// STUDENT ACTIONS
// ============================================
export const createStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    try {
        const ageGroup = await prisma.ageGroup.findUnique({
            where: { id: data.ageGroupId },
            include: { _count: { select: { students: true } } },
        });

        if (ageGroup && ageGroup.capacity === ageGroup._count.students) {
            return { success: false, error: true };
        }

        const user = await clerkClient.users.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            publicMetadata: { role: "student" },
        });

        await prisma.student.create({
            data: {
                userId: user.id,
                displayId: data.displayId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                photo: data.photo || null,
                dateOfBirth: data.dateOfBirth,
                position: data.position || null,
                jerseyNumber: data.jerseyNumber || null,
                sex: data.sex,
                bloodType: data.bloodType || null,
                ageGroupId: data.ageGroupId,
                parentId: data.parentId,
            },
        });

        revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        await clerkClient.users.updateUser(data.userId!, {
            firstName: data.firstName,
            lastName: data.lastName,
        });

        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                displayId: data.displayId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                photo: data.photo || null,
                dateOfBirth: data.dateOfBirth,
                position: data.position || null,
                jerseyNumber: data.jerseyNumber || null,
                sex: data.sex,
                bloodType: data.bloodType || null,
                ageGroupId: data.ageGroupId,
                parentId: data.parentId,
            },
        });

        revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const student = await prisma.student.findUnique({ where: { id } });
        if (student) {
            await clerkClient.users.deleteUser(student.userId);
        }

        await prisma.student.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// PARENT ACTIONS
// ============================================
export const createParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    try {
        const user = await clerkClient.users.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            publicMetadata: { role: "parent" },
        });

        await prisma.parent.create({
            data: {
                userId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        revalidatePath("/list/parents");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        await clerkClient.users.updateUser(data.userId!, {
            firstName: data.firstName,
            lastName: data.lastName,
        });

        await prisma.parent.update({
            where: {
                id: data.id,
            },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        revalidatePath("/list/parents");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteParent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const parent = await prisma.parent.findUnique({ where: { id } });
        if (parent) {
            await clerkClient.users.deleteUser(parent.userId);
        }

        await prisma.parent.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/parents");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// AGE GROUP ACTIONS (adapted from Class)
// ============================================
export const createAgeGroup = async (
    currentState: CurrentState,
    data: AgeGroupSchema
) => {
    try {
        await prisma.ageGroup.create({
            data: {
                name: data.name,
                minAge: data.minAge,
                maxAge: data.maxAge,
                capacity: data.capacity,
                description: data.description || null,
            },
        });

        revalidatePath("/list/ageGroups");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAgeGroup = async (
    currentState: CurrentState,
    data: AgeGroupSchema
) => {
    try {
        await prisma.ageGroup.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                minAge: data.minAge,
                maxAge: data.maxAge,
                capacity: data.capacity,
                description: data.description || null,
            },
        });

        revalidatePath("/list/ageGroups");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAgeGroup = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.ageGroup.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/ageGroups");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// TRAINING SESSION ACTIONS (adapted from Lesson)
// ============================================
export const createTrainingSession = async (
    currentState: CurrentState,
    data: TrainingSessionSchema
) => {
    try {
        await prisma.trainingSession.create({
            data: {
                title: data.title,
                description: data.description || null,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                dayOfWeek: data.dayOfWeek,
                venue: data.venue,
                type: data.type,
                coachId: data.coachId,
                ageGroupId: data.ageGroupId,
            },
        });

        revalidatePath("/list/trainingSessions");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateTrainingSession = async (
    currentState: CurrentState,
    data: TrainingSessionSchema
) => {
    try {
        await prisma.trainingSession.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description || null,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                dayOfWeek: data.dayOfWeek,
                venue: data.venue,
                type: data.type,
                coachId: data.coachId,
                ageGroupId: data.ageGroupId,
            },
        });

        revalidatePath("/list/trainingSessions");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteTrainingSession = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.trainingSession.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/trainingSessions");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// FIXTURE ACTIONS (adapted from Exam)
// ============================================
export const createFixture = async (
    currentState: CurrentState,
    data: FixtureSchema
) => {
    try {
        await prisma.fixture.create({
            data: {
                title: data.title,
                opponent: data.opponent,
                date: data.date,
                time: data.time,
                venue: data.venue,
                isHome: data.isHome,
                type: data.type,
                isCompleted: data.isCompleted,
                goalsFor: data.goalsFor,
                goalsAgainst: data.goalsAgainst,
                ageGroupId: data.ageGroupId,
            },
        });

        revalidatePath("/list/fixtures");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateFixture = async (
    currentState: CurrentState,
    data: FixtureSchema
) => {
    try {
        await prisma.fixture.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                opponent: data.opponent,
                date: data.date,
                time: data.time,
                venue: data.venue,
                isHome: data.isHome,
                type: data.type,
                isCompleted: data.isCompleted,
                goalsFor: data.goalsFor,
                goalsAgainst: data.goalsAgainst,
                ageGroupId: data.ageGroupId,
            },
        });

        revalidatePath("/list/fixtures");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteFixture = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.fixture.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/fixtures");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// EVENT ACTIONS
// ============================================
export const createEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    try {
        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description || null,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                venue: data.venue,
                type: data.type,
            },
        });

        revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    try {
        await prisma.event.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description || null,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                venue: data.venue,
                type: data.type,
            },
        });

        revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.event.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// ANNOUNCEMENT ACTIONS
// ============================================
export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    try {
        await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                priority: data.priority,
                targetRoles: data.targetRoles,
                expiresAt: data.expiresAt || null,
            },
        });

        revalidatePath("/list/announcements");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    try {
        await prisma.announcement.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                content: data.content,
                priority: data.priority,
                targetRoles: data.targetRoles,
                expiresAt: data.expiresAt || null,
            },
        });

        revalidatePath("/list/announcements");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.announcement.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/announcements");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// RESULT ACTIONS
// ============================================
export const createResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    try {
        await prisma.result.create({
            data: {
                studentId: data.studentId,
                fixtureId: data.fixtureId,
                goals: data.goals,
                assists: data.assists,
                rating: data.rating,
                minutesPlayed: data.minutesPlayed,
                yellowCards: data.yellowCards,
                redCards: data.redCards,
                notes: data.notes || null,
            },
        });

        revalidatePath("/list/results");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    try {
        await prisma.result.update({
            where: {
                id: data.id,
            },
            data: {
                studentId: data.studentId,
                fixtureId: data.fixtureId,
                goals: data.goals,
                assists: data.assists,
                rating: data.rating,
                minutesPlayed: data.minutesPlayed,
                yellowCards: data.yellowCards,
                redCards: data.redCards,
                notes: data.notes || null,
            },
        });

        revalidatePath("/list/results");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.result.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/results");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// ============================================
// ATTENDANCE ACTIONS
// ============================================
export const createAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    try {
        await prisma.attendance.create({
            data: {
                studentId: data.studentId,
                trainingSessionId: data.trainingSessionId,
                status: data.status,
                notes: data.notes || null,
                markedBy: "admin", // TODO: Get from current user
            },
        });

        revalidatePath("/list/attendances");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    try {
        await prisma.attendance.update({
            where: {
                id: data.id,
            },
            data: {
                studentId: data.studentId,
                trainingSessionId: data.trainingSessionId,
                status: data.status,
                notes: data.notes || null,
            },
        });

        revalidatePath("/list/attendances");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAttendance = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.attendance.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/list/attendances");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
