"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { trainingSessionSchema, TrainingSessionSchema } from "@/lib/formValidationSchemas";
import { createTrainingSession, updateTrainingSession } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TrainingSessionForm = ({
    type,
    data,
    coaches,
    ageGroups,
}: {
    type: "create" | "update";
    data?: any;
    coaches?: any[];
    ageGroups?: any[];
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TrainingSessionSchema>({
        resolver: zodResolver(trainingSessionSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createTrainingSession : updateTrainingSession,
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
            toast(`Training session has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/lessons");
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
                        Training Session Details
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Title"
                        name="title"
                        defaultValue={data?.title}
                        register={register}
                        error={errors.title}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Session Type</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("type")}
                            defaultValue={data?.type}
                        >
                            <option value="">Select type</option>
                            <option value="TRAINING">Training</option>
                            <option value="MATCH">Match</option>
                            <option value="FRIENDLY">Friendly</option>
                            <option value="TOURNAMENT">Tournament</option>
                            <option value="FITNESS">Fitness</option>
                            <option value="RECOVERY">Recovery</option>
                        </select>
                        {errors.type?.message && (
                            <p className="text-xs text-fcGarnet">{errors.type.message.toString()}</p>
                        )}
                    </div>
                    <InputField
                        label="Date"
                        name="date"
                        type="datetime-local"
                        defaultValue={data?.date}
                        register={register}
                        error={errors.date}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Day of Week</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("dayOfWeek")}
                            defaultValue={data?.dayOfWeek}
                        >
                            <option value="">Select day</option>
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                            <option value="SATURDAY">Saturday</option>
                            <option value="SUNDAY">Sunday</option>
                        </select>
                        {errors.dayOfWeek?.message && (
                            <p className="text-xs text-fcGarnet">{errors.dayOfWeek.message.toString()}</p>
                        )}
                    </div>
                    <InputField
                        label="Start Time"
                        name="startTime"
                        type="datetime-local"
                        defaultValue={data?.startTime}
                        register={register}
                        error={errors.startTime}
                    />
                    <InputField
                        label="End Time"
                        name="endTime"
                        type="datetime-local"
                        defaultValue={data?.endTime}
                        register={register}
                        error={errors.endTime}
                    />
                    <InputField
                        label="Venue"
                        name="venue"
                        defaultValue={data?.venue}
                        register={register}
                        error={errors.venue}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Coach</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("coachId")}
                            defaultValue={data?.coachId}
                        >
                            <option value="">Select coach</option>
                            {coaches?.map((coach) => (
                                <option key={coach.id} value={coach.id}>
                                    {coach.firstName} {coach.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.coachId?.message && (
                            <p className="text-xs text-fcGarnet">{errors.coachId.message.toString()}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Age Group</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("ageGroupId")}
                            defaultValue={data?.ageGroupId}
                        >
                            <option value="">Select age group</option>
                            {ageGroups?.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        {errors.ageGroupId?.message && (
                            <p className="text-xs text-fcGarnet">{errors.ageGroupId.message.toString()}</p>
                        )}
                    </div>
                    <InputField
                        label="Description"
                        name="description"
                        defaultValue={data?.description}
                        register={register}
                        error={errors.description}
                        className="md:col-span-2"
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
                    hidden
                />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-semibold shadow-glow-garnet hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    {type === "create" ? "Create Session" : "Update Session"}
                </button>
            </div>
        </form>
    );
};

export default TrainingSessionForm;
