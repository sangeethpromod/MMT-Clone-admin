
import React, { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type InputVariant = "primary" | "secondary" | "disabled" | "password";

interface InputFieldProps {
    label?: React.ReactNode;
    width?: string;
    variant?: InputVariant;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    id?: string;
    required?: boolean;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    width = "w-64",
    variant = "primary",
    value = "",
    onChange,
    placeholder,
    type = "text",
    name,
    id,
    required,
    error
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const baseLabelStyles = "text-sm font-semibold";

    const variantStyles: Record<InputVariant, { label: string; display: string }> = {
        primary: {
            label: "mb-2 text-[#FF2B36] font-normal",
            display: "w-full rounded-sm border border-[#e4e4e4] bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#e4e4e4]"
        },
        secondary: {
            label: "mb-2 text-black font-normal",
            display: "w-full rounded-sm border border-[#e4e4e4] bg-blue-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#e4e4e4]"
        },
        disabled: {
            label: "mb-2 text-black font-normal",
            display: "w-full rounded-sm border border-[#e4e4e4] bg-[#f7f7f7] px-4 py-2 text-sm text-gray-900 cursor-not-allowed focus:outline-none focus:border-[#e4e4e4]"
        },
        password: {
            label: "mb-2 text-[#FF2B36] font-normal",
            display: "w-full rounded-sm border border-[#e4e4e4] bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#e4e4e4]"
        }
    };

    const isDisabled = variant === "disabled";
    const isPasswordField = variant === "password" || type === "password";
    const inputType = isPasswordField && !showPassword ? "password" : type === "password" ? "text" : type;

    return (
        <div className={`flex flex-col ${width}`}>
            {label && <label className={clsx(baseLabelStyles, "font-medium text-[#2B3B90]", variantStyles[variant].label)}>{label}</label>}
            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    required={required}
                    disabled={isDisabled}
                    className={variantStyles[variant].display}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default InputField;
