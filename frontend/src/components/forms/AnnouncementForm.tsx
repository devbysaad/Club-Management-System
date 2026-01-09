"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AnnouncementForm = ({
    type,
    data,
    setOpen,
}: {
    type: "create" | "update";
    data?: any;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AnnouncementSchema>({
        resolver: zodResolver(announcementSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createAnnouncement : updateAnnouncement,
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
            toast.success(`Announcement has been ${type === "create" ? "created" : "updated"}!`);
            setTimeout(() => {
                setOpen?.(false);
                router.refresh();
            }, 500);
        } else if (state.error) {
            toast.error("Something went wrong! Please check your inputs.");
        }
    }, [state, router, type, setOpen]);

    return (
        <form className="flex flex-col gap-6 p-6" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new announcement" : "Update the announcement"}
            </h1>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                    <span className="text-xs text-fcGold font-heading font-semibold uppercase tracking-wider">
                        Announcement Details
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <InputField
                        label="Title"
                        name="title"
                        defaultValue={data?.title}
                        register={register}
                        error={errors.title}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Content</label>
                        <textarea
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[120px]"
                            {...register("content")}
                            defaultValue={data?.content}
                            placeholder="Enter announcement content..."
                        />
                        {errors.content?.message && (
                            <p className="text-xs text-fcGarnet">{errors.content.message.toString()}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Priority (1-5)"
                            name="priority"
                            type="number"
                            defaultValue={data?.priority || 1}
                            register={register}
                            error={errors.priority}
                        />
                        <InputField
                            label="Expires At"
                            name="expiresAt"
                            type="datetime-local"
                            defaultValue={data?.expiresAt ? new Date(data.expiresAt).toISOString().slice(0, 16) : ""}
                            register={register}
                            error={errors.expiresAt}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-[var(--text-muted)] font-medium">Target Roles</label>
                        <div className="flex gap-4">
                            {["ADMIN", "COACH", "STUDENT", "PARENT"].map((role) => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={role}
                                        {...register("targetRoles")}
                                        defaultChecked={data?.targetRoles?.includes(role)}
                                        className="w-4 h-4 rounded border-gray-300 text-fcGarnet focus:ring-fcGarnet"
                                    />
                                    <span className="text-sm">{role}</span>
                                </label>
                            ))}
                        </div>
                        {errors.targetRoles?.message && (
                            <p className="text-xs text-fcGarnet">{errors.targetRoles.message.toString()}</p>
                        )}
                    </div>
                </div>
            </div>

            {data && (
                <input type="hidden" {...register("id")} defaultValue={data?.id} />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-semibold shadow-glow-garnet hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    {type === "create" ? "Create Announcement" : "Update Announcement"}
                </button>
            </div>
        </form>
    );
};

export default AnnouncementForm;
