"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { coachSchema, CoachSchema } from "@/lib/formValidationSchemas";
import { createCoach, updateCoach } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TeacherForm = ({
  type,
  data,
  ageGroups,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  ageGroups?: any[];
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoachSchema>({
    resolver: zodResolver(coachSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createCoach : updateCoach,
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
      toast.success(`Coach has been ${type === "create" ? "created" : "updated"}!`);
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
        {type === "create" ? "Create a new coach" : "Update the coach"}
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
            label="Username"
            name="username"
            defaultValue={data?.username}
            register={register}
            error={errors?.username}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />

          {/* Password Fields - Only show for create */}
          {type === "create" && (
            <>
              <InputField
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors?.password}
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                register={register}
                error={errors?.confirmPassword}
              />
            </>
          )}

          <div className="p-3 rounded-lg bg-fcBlue/10 border border-fcBlue/30">
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
              <span className="text-fcBlue">ℹ️</span>
              {type === "create"
                ? "Coach will use this email and password to log in to their account."
                : "An invitation email will be sent to this address. The coach will set their own password via the secure link."}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          />
          <InputField
            label="Blood Type"
            name="bloodType"
            defaultValue={data?.bloodType}
            register={register}
            error={errors.bloodType}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[var(--text-muted)] font-medium">Gender</label>
            <select
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all min-h-[46px]"
              {...register("sex")}
              defaultValue={data?.sex}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex?.message && (
              <p className="text-xs text-fcGarnet flex items-center gap-1">
                {errors.sex.message.toString()}
              </p>
            )}
          </div>

          <InputField
            label="Display ID"
            name="displayId"
            defaultValue={data?.displayId}
            register={register}
            error={errors.displayId}
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
          {type === "create" ? "Add Coach" : "Update Coach"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
