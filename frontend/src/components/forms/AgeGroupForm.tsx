"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { ageGroupSchema, AgeGroupSchema } from "@/lib/formValidationSchemas";
import { createAgeGroup, updateAgeGroup } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AgeGroupForm = ({
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
    } = useForm<AgeGroupSchema>({
        resolver: zodResolver(ageGroupSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createAgeGroup : updateAgeGroup,
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
            toast(`Age group has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/ageGroups");
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
                        Age Group Details
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Name"
                        name="name"
                        defaultValue={data?.name}
                        register={register}
                        error={errors.name}
                    />
                    <InputField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        defaultValue={data?.capacity}
                        register={register}
                        error={errors.capacity}
                    />
                    <InputField
                        label="Minimum Age"
                        name="minAge"
                        type="number"
                        defaultValue={data?.minAge}
                        register={register}
                        error={errors.minAge}
                    />
                    <InputField
                        label="Maximum Age"
                        name="maxAge"
                        type="number"
                        defaultValue={data?.maxAge}
                        register={register}
                        error={errors.maxAge}
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
                    {type === "create" ? "Create Age Group" : "Update Age Group"}
                </button>
            </div>
        </form>
    );
};

export default AgeGroupForm;
