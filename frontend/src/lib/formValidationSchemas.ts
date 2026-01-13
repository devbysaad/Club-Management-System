import { z } from "zod";

// ============================================
// COACH SCHEMA (adapted from Teacher)
// ============================================
export const coachSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    displayId: z.string().optional(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    photo: z.string().optional(),
    specialization: z.array(z.string()).optional(), // replaced subjects with specialization
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    bloodType: z.string().optional(),
    ageGroups: z.array(z.string()).optional(), // age group ids
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type CoachSchema = z.infer<typeof coachSchema>;

// ============================================
// STUDENT SCHEMA
// ============================================
export const studentSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    displayId: z.string().optional(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    photo: z.string().optional(),
    dateOfBirth: z.coerce.date({ message: "Date of birth is required!" }),
    position: z.string().optional(),
    jerseyNumber: z.coerce.number().optional(),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    bloodType: z.string().optional(),
    ageGroupId: z.string().min(1, { message: "Age group is required!" }),
    parentId: z.string().min(1, { message: "Parent is required!" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type StudentSchema = z.infer<typeof studentSchema>;

// ============================================
// PARENT SCHEMA
// ============================================
export const parentSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ParentSchema = z.infer<typeof parentSchema>;

// ============================================
// STAFF SCHEMA
// ============================================
export const staffSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type StaffSchema = z.infer<typeof staffSchema>;

// ============================================
// AGE GROUP SCHEMA (adapted from Class)
// ============================================
export const ageGroupSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Age group name is required!" }),
    minAge: z.coerce.number().min(1, { message: "Minimum age is required!" }),
    maxAge: z.coerce.number().min(1, { message: "Maximum age is required!" }),
    capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
    description: z.string().optional(),
});

export type AgeGroupSchema = z.infer<typeof ageGroupSchema>;

// ============================================
// TRAINING SESSION SCHEMA (adapted from Lesson)
// ============================================
export const trainingSessionSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().optional(),
    date: z.coerce.date({ message: "Date is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    dayOfWeek: z.enum(
        ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        { message: "Day of week is required!" }
    ),
    venue: z.string().min(1, { message: "Venue is required!" }),
    type: z.enum(
        ["TRAINING", "MATCH", "FRIENDLY", "TOURNAMENT", "FITNESS", "RECOVERY"],
        { message: "Session type is required!" }
    ),
    coachId: z.string().min(1, { message: "Coach is required!" }),
    ageGroupId: z.string().min(1, { message: "Age group is required!" }),
});

export type TrainingSessionSchema = z.infer<typeof trainingSessionSchema>;

// ============================================
// FIXTURE SCHEMA (adapted from Exam)
// ============================================
export const fixtureSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    opponent: z.string().min(1, { message: "Opponent is required!" }),
    date: z.coerce.date({ message: "Date is required!" }),
    time: z.coerce.date({ message: "Time is required!" }),
    venue: z.string().min(1, { message: "Venue is required!" }),
    isHome: z.boolean().default(true),
    type: z.enum(["LEAGUE", "CUP", "FRIENDLY", "TOURNAMENT"], {
        message: "Fixture type is required!",
    }),
    isCompleted: z.boolean().default(false),
    goalsFor: z.coerce.number().default(0),
    goalsAgainst: z.coerce.number().default(0),
    ageGroupId: z.string().min(1, { message: "Age group is required!" }),
});

export type FixtureSchema = z.infer<typeof fixtureSchema>;

// ============================================
// EVENT SCHEMA
// ============================================
export const eventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().optional(),
    date: z.coerce.date({ message: "Date is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    venue: z.string().min(1, { message: "Venue is required!" }),
    type: z.enum(
        ["TOURNAMENT", "CELEBRATION", "MEETING", "TRIAL", "FUNDRAISER", "OTHER"],
        { message: "Event type is required!" }
    ),
});

export type EventSchema = z.infer<typeof eventSchema>;

// ============================================
// ANNOUNCEMENT SCHEMA
// ============================================
export const announcementSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    content: z.string().min(1, { message: "Content is required!" }),
    priority: z.coerce.number().min(1).max(5).default(1),
    targetRoles: z.array(z.enum(["ADMIN", "COACH", "STUDENT", "PARENT"])).min(1, {
        message: "At least one target role is required!",
    }),
    expiresAt: z.coerce.date().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

// ============================================
// RESULT SCHEMA
// ============================================
export const resultSchema = z.object({
    id: z.string().optional(),
    studentId: z.string().min(1, { message: "Student is required!" }),
    fixtureId: z.string().min(1, { message: "Fixture is required!" }),
    goals: z.coerce.number().min(0).default(0),
    assists: z.coerce.number().min(0).default(0),
    rating: z.coerce.number().min(0).max(10).default(0),
    minutesPlayed: z.coerce.number().min(0).default(0),
    yellowCards: z.coerce.number().min(0).default(0),
    redCards: z.coerce.number().min(0).default(0),
    notes: z.string().optional(),
});

export type ResultSchema = z.infer<typeof resultSchema>;

// ============================================
// ATTENDANCE SCHEMA
// ============================================
export const attendanceSchema = z.object({
    id: z.string().optional(),
    studentId: z.string().min(1, { message: "Student is required!" }),
    trainingSessionId: z.string().min(1, { message: "Training session is required!" }),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
        message: "Status is required!",
    }),
    notes: z.string().optional(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
