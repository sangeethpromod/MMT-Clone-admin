import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "logout" | "extra" | "destructive" | "extraSetting" | "rebaseButton";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    width?: string;
    label?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", width = "w-full", className, children, label, ...props }) => {
    const baseStyles =
        "px-2 py-2 h-10 rounded font-medium text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-[#FF2B36] text-white hover:bg-[#b80d16] cursor-pointer",
        secondary: "bg-transparent border border-[#343434] text-[#242424] hover:bg-[#cfcfcf]",
        logout: "bg-[#AE3020] text-white hover:bg-[#df2a12] cursor-pointer",
        extra: "bg-none border border-[#474747] text-white hover:bg-[#bb1600] hover:border-red-700",
        destructive: "bg-[#bb1600] border border-red-700 text-white hover:bg-red-500 hover:border-red-700",
        extraSetting: "bg-none border border-[#474747] text-white hover:bg-[#F5CB5C] hover:border-[#FFC52D]",
        rebaseButton: "bg-none border border-[#474747] text-white hover:bg-[#007011] hover:border-[#007011] shadow-[0_0_8px_2px_rgba(0,112,17,0.5)]"
    };

    return (
        <button className={clsx(baseStyles, variantStyles[variant], width, className)} {...props}>
            {label || children}
        </button>
    );
};

export default Button;
