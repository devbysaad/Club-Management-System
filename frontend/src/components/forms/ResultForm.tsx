"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
    type,
    data,
    students,
    fixtures,
}: {
    type: "create" | "update";
    data?: any;
    students?: any[];
    fixtures?: any[];
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createResult : updateResult,
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
            toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/results");
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
                        Player Performance
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="text-xs text-[var(--text-muted)] font-medium">Fixture</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("fixtureId")}
                            defaultValue={data?.fixtureId}
                        >
                            <option value="">Select fixture</option>
                            {fixtures?.map((fixture) => (
                                <option key={fixture.id} value={fixture.id}>
                                    {fixture.title}
                                </option>
                            ))}
                        </select>
                        {errors.fixtureId?.message && (
                            <p className="text-xs text-fcGarnet">{errors.fixtureId.message.toString()}</p>
                        )}
                    </div>
                    <InputField
                        label="Goals"
                        name="goals"
                        type="number"
                        defaultValue={data?.goals || 0}
                        register={register}
                        error={errors.goals}
                    />
                    <InputField
                        label="Assists"
                        name="assists"
                        type="number"
                        defaultValue={data?.assists || 0}
                        register={register}
                        error={errors.assists}
                    />
                    <InputField
                        label="Rating (0-10)"
                        name="rating"
                        type="number"
                        defaultValue={data?.rating || 0}
                        register={register}
                        error={errors.rating}
                        inputProps={{ step: "0.1" }}
                    />
                    <InputField
                        label="Minutes Played"
                        name="minutesPlayed"
                        type="number"
                        defaultValue={data?.minutesPlayed || 0}
                        register={register}
                        error={errors.minutesPlayed}
                    />
                    <InputField
                        label="Yellow Cards"
                        name="yellowCards"
                        type="number"
                        defaultValue={data?.yellowCards || 0}
                        register={register}
                        error={errors.yellowCards}
                    />
                    <InputField
                        label="Red Cards"
                        name="redCards"
                        type="number"
                        defaultValue={data?.redCards || 0}
                        register={register}
                        error={errors.redCards}
                    />
                    <InputField
                        label="Notes"
                        name="notes"
                        defaultValue={data?.notes}
                        register={register}
                        error={errors.notes}
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
                />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-semibold shadow-glow-garnet hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    {type === "create" ? "Add Result" : "Update Result"}
                </button>
            </div>
        </form>
    );
};

export default ResultForm;
