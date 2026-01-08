"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const EventForm = ({
    type,
    data,
}: {
    type: "create" | "update";
    data?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createEvent : updateEvent,
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
            toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/events");
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
                        Event Details
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
                        <label className="text-xs text-[var(--text-muted)] font-medium">Event Type</label>
                        <select
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
                            {...register("type")}
                            defaultValue={data?.type}
                        >
                            <option value="">Select type</option>
                            <option value="TOURNAMENT">Tournament</option>
                            <option value="CELEBRATION">Celebration</option>
                            <option value="MEETING">Meeting</option>
                            <option value="TRIAL">Trial</option>
                            <option value="FUNDRAISER">Fundraiser</option>
                            <option value="OTHER">Other</option>
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
                    <InputField
                        label="Venue"
                        name="venue"
                        defaultValue={data?.venue}
                        register={register}
                        error={errors.venue}
                    />
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
                    {type === "create" ? "Create Event" : "Update Event"}
                </button>
            </div>
        </form>
    );
};

export default EventForm;
