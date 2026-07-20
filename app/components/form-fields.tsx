import React, { useRef } from "react";
import ReactSelect, {
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/* =====================================
   FormField Wrapper
===================================== */

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-black">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

/* =====================================
   Input
===================================== */

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          type === "file"
            ? "w-full rounded-xl border border-gray-200 bg-panel p-2 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:cursor-pointer"
            : "w-full rounded-xl border border-gray-200 bg-panel px-4 py-3 text-black",
          "placeholder:text-muted",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

/* =====================================
   Textarea
===================================== */

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-gray-200 bg-panel px-4 py-3 text-black",
        "placeholder:text-muted",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

/* =====================================
   Select
===================================== */

export interface SelectOption {
  label: string;
  value: string;
}

type SelectBaseProps = {
  options: SelectOption[];

  placeholder?: string;

  isDisabled?: boolean;

  isLoading?: boolean;

  isSearchable?: boolean;

  isClearable?: boolean;

  className?: string;

  name?: string;
};

type SingleSelectProps = SelectBaseProps & {
  isMulti?: false;
  value?: SingleValue<SelectOption>;
  onChange?: (value: SingleValue<SelectOption>) => void;
};

type MultiSelectProps = SelectBaseProps & {
  isMulti: true;
  value?: MultiValue<SelectOption>;
  onChange?: (value: MultiValue<SelectOption>) => void;
};

type SelectProps = SingleSelectProps | MultiSelectProps;

const selectStyles: StylesConfig<SelectOption, boolean> = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    borderRadius: 12,
    borderColor: state.isFocused ? "var(--primary)" : "#e5e7eb",
    backgroundColor: "white",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--primary)",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
      ? "#d4a24c2f"
      : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
  }),

  multiValue: (base) => ({
    ...base,
    borderRadius: 6,
  }),
};

export function Select(props: SelectProps) {
  const {
    options,
    placeholder = "Select...",
    isDisabled = false,
    isLoading = false,
    isSearchable = true,
    className,
    name,
  } = props;

  if (props.isMulti) {
    return (
      <div className={cn("w-full", className)}>
        <ReactSelect<SelectOption, true>
          name={name}
          options={options}
          value={props.value}
          onChange={props.onChange}
          placeholder={placeholder}
          isMulti
          isDisabled={isDisabled}
          isLoading={isLoading}
          isSearchable={isSearchable}
          isClearable={false}
          styles={selectStyles}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <ReactSelect<SelectOption, false>
        name={name}
        options={options}
        value={props.value}
        onChange={props.onChange}
        placeholder={placeholder}
        isMulti={false}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable={isSearchable}
        isClearable={false}
        styles={selectStyles}
      />
    </div>
  );
}

/* =====================================
   Checkbox
===================================== */

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        className={cn("h-4 w-4 accent-primary", className)}
        {...props}
      />
      <span className="text-sm text-black">{label}</span>
    </label>
  );
}

/* =====================================
   Radio Group
===================================== */

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  options,
  onChange,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-3"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-primary"
          />

          <span className="text-sm text-black">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

/* =====================================
   Checkbox Group
===================================== */

export interface CheckboxGroupOption {
  label: string;
  value: string;
}

export interface CheckboxGroupProps {
  value: string[];
  options: CheckboxGroupOption[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function CheckboxGroup({
  value,
  options,
  onChange,
  className,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-3"
        >
          <input
            type="checkbox"
            checked={value.includes(option.value)}
            onChange={() => handleChange(option.value)}
            className="h-4 w-4 accent-primary"
          />

          <span className="text-sm text-black">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, input: string) {
    if (!/^\d?$/.test(input)) return;

    const updated = [...value];
    updated[index] = input;

    onChange(updated);

    if (input && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex gap-2">
      {value.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={digit}
          maxLength={1}
          className="h-12 w-12 text-center text-lg"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}
