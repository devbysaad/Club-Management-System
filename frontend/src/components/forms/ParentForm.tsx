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
        console.log("🟩 [PARENT FORM] Form submitted with data:", data);
        console.log("🟩 [PARENT FORM] Calling formAction...");
        formAction(data);
    });

    useEffect(() => {
        console.log("🟩 [PARENT FORM] State changed:", {
            success: state.success,
            error: state.error,
            message: state.message
        });

        if (state.success) {
            console.log("🟩 [PARENT FORM] SUCCESS - Showing toast");
            toast.success(`Parent has been ${type === "create" ? "created" : "updated"}!`);
            setTimeout(() => {
                console.log("🟩 [PARENT FORM] Closing modal and refreshing");
                setOpen?.(false);
                router.refresh();
            }, 500);
        } else if (state.error) {
            console.error("🟩 [PARENT FORM] ERROR - Showing error toast", state.message);
            toast.error(state.message || "Something went wrong! Please check your inputs.");
        }
    }, [state, router, type, setOpen]);

    return (
        <form className="flex flex-col gap-6 p-6" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new parent" : "Update the parent"}
            </h1>

            {/* Section: Account Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                    <span className="text-xs text-fcGold font-heading font-semibold uppercase tracking-wider">
                        Account Information
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <InputField
                        label="Email"
                        name="email"
                        defaultValue={data?.email}
                        register={register}
                        error={errors?.email}
                    />
                    <div className="p-3 rounded-lg bg-fcBlue/10 border border-fcBlue/30">
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            <span className="text-fcBlue">ℹ️</span>
                            An invitation email will be sent to this address. The parent will set their own password via the secure link.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section: Personal Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-fcBlue to-fcGold rounded-full" />
                    <span className="text-xs text-fcGold font-heading font-semibold uppercase tracking-wider">
                        Personal Information
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

            {/* Hidden Fields for Updates */}
            {data && (
                <>
                    <input type="hidden" {...register("id")} defaultValue={data?.id} />
                    <input type="hidden" {...register("userId")} defaultValue={data?.userId} />
                </>
            )}

            {/* Submit Button */}
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
