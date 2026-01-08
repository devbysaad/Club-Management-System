"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ParentForm = ({
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
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createParent : updateParent,
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
            toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
            router.push("/list/parents");
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
                        Parent Information
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="First Name"
                        name="firstName"
                        defaultValue={data?.firstName}
                        register={register}
                        error={errors.firstName}
                    />
                    <InputField
                        label="Last Name"
                        name="lastName"
                        defaultValue={data?.lastName}
                        register={register}
                        error={errors.lastName}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        defaultValue={data?.email}
                        register={register}
                        error={errors.email}
                    />
                    <InputField
                        label="Phone"
                        name="phone"
                        defaultValue={data?.phone}
                        register={register}
                        error={errors.phone}
                    />
                    <InputField
                        label="Address"
                        name="address"
                        defaultValue={data?.address}
                        register={register}
                        error={errors.address}
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
            {data && (
                <InputField
                    label="User Id"
                    name="userId"
                    defaultValue={data?.userId}
                    register={register}
                    error={errors?.userId}
                    hidden
                />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-semibold shadow-glow-garnet hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    {type === "create" ? "Add Parent" : "Update Parent"}
                </button>
            </div>
        </form>
    );
};

export default ParentForm;
