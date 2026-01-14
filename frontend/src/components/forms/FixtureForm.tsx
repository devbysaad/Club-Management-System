"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { fixtureSchema, FixtureSchema } from "@/lib/formValidationSchemas";
import { createFixture, updateFixture } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FixtureForm = ({
    type,
    data,
    ageGroups,
}: {
    type: "create" | "update";
    data?: any;
    ageGroups?: any[];
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FixtureSchema>({
        resolver: zodResolver(fixtureSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createFixture : updateFixture,
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
            toast(`Fixture has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/exams");
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
                        Fixture Details
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
                    <InputField
                        label="Opponent"
                        name="opponent"
                        defaultValue={data?.opponent}
                        register={register}
                        error={errors.opponent}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Fixture Type</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("type")}
                            defaultValue={data?.type}
                        >
                            <option value="">Select type</option>
                            <option value="LEAGUE">League</option>
                            <option value="CUP">Cup</option>
                            <option value="FRIENDLY">Friendly</option>
                            <option value="TOURNAMENT">Tournament</option>
                        </select>
                        {errors.type?.message && (
                            <p className="text-xs text-fcGarnet">{errors.type.message.toString()}</p>
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
                        label="Date"
                        name="date"
                        type="datetime-local"
                        defaultValue={data?.date}
                        register={register}
                        error={errors.date}
                    />
                    <InputField
                        label="Time"
                        name="time"
                        type="datetime-local"
                        defaultValue={data?.time}
                        register={register}
                        error={errors.time}
                    />
                    <InputField
                        label="Venue"
                        name="venue"
                        defaultValue={data?.venue}
                        register={register}
                        error={errors.venue}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register("isHome")}
                            defaultChecked={data?.isHome}
                            className="w-4 h-4 text-fcGarnet"
                        />
                        <label className="text-sm">Home Match</label>
                    </div>
                    <InputField
                        label="Goals For"
                        name="goalsFor"
                        type="number"
                        defaultValue={data?.goalsFor || 0}
                        register={register}
                        error={errors.goalsFor}
                    />
                    <InputField
                        label="Goals Against"
                        name="goalsAgainst"
                        type="number"
                        defaultValue={data?.goalsAgainst || 0}
                        register={register}
                        error={errors.goalsAgainst}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register("isCompleted")}
                            defaultChecked={data?.isCompleted}
                            className="w-4 h-4 text-fcGarnet"
                        />
                        <label className="text-sm">Completed</label>
                    </div>
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
                    {type === "create" ? "Create Fixture" : "Update Fixture"}
                </button>
            </div>
        </form>
    );
};

export default FixtureForm;
