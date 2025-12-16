import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
        {label}
        <span className="text-fcGarnet">*</span>
      </label>
      <input
        type={type}
        {...register(name)}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-fcGarnet focus:outline-none focus:ring-2 focus:ring-fcGarnet/20 transition-all w-full min-h-[46px]"
        {...inputProps}
        defaultValue={defaultValue}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {error?.message && (
        <p className="text-xs text-fcGarnet flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
