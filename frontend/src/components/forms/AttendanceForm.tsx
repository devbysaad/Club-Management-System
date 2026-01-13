"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { attendanceSchema, AttendanceSchema } from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AttendanceForm = ({
    type,
    data,
    students,
    sessions,
}: {
    type: "create" | "update";
    data?: any;
    students?: any[];
    sessions?: any[];
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createAttendance : updateAttendance,
        {
            success: false,
            error: false,
        }
    );

    const router = useRouter();

    const onSubmit = handleSubmit((data) => {
        formAction(data);
    });

    useEffect(() => {
        if (state.success) {
            toast(`Attendance has been ${type === "create" ? "marked" : "updated"}!`);
            router.refresh();
        }
    }, [state, router, type]);

    return (
        <form className="flex flex-col gap-6 p-6" onSubmit={onSubmit}>
            {state.error && (
                <span className="text-fcGarnet">Something went wrong!</span>
            )}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                    <span className="text-xs text-fcGold font-heading font-semibold uppercase tracking-wider">
                        Attendance Record
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Student</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("studentId")}
                            defaultValue={data?.studentId}
                        >
                            <option value="">Select student</option>
                            {students?.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.studentId?.message && (
                            <p className="text-xs text-fcGarnet">{errors.studentId.message.toString()}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Training Session</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("trainingSessionId")}
                            defaultValue={data?.trainingSessionId}
                        >
                            <option value="">Select session</option>
                            {sessions?.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.title}
                                </option>
                            ))}
                        </select>
                        {errors.trainingSessionId?.message && (
                            <p className="text-xs text-fcGarnet">{errors.trainingSessionId.message.toString()}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Status</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("status")}
                            defaultValue={data?.status}
                        >
                            <option value="">Select status</option>
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="EXCUSED">Excused</option>
                        </select>
                        {errors.status?.message && (
                            <p className="text-xs text-fcGarnet">{errors.status.message.toString()}</p>
                        )}
                    </div>
                    <InputField
                        label="Notes"
                        name="notes"
                        defaultValue={data?.notes}
                        register={register}
                        error={errors.notes}
                    />
                </div>
            </div>

            {data && (
                <InputField
                    label="Id"
                    name="id"
                    defaultValue={data?.id}
                    register={register}
                    error={errors?.id}
                />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-semibold shadow-glow-garnet hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    {type === "create" ? "Mark Attendance" : "Update Attendance"}
                </button>
            </div>
        </form>
    );
};

export default AttendanceForm;
