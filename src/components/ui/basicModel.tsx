import React, { ReactElement } from "react";

import { X } from "lucide-react";
import ReactDOM from "react-dom";

export interface BasicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string; // Made optional
    icon?: ReactElement;
    placeholder?: string;
    inputType?: "textArea" | "inputField";
    submitLabel?: string;
    modalContent: ReactElement;
    width?: string;
}

export const BasicModal: React.FC<BasicModalProps> = ({ isOpen, onClose, title, icon, modalContent, width = "max-w-[50%] min-w-[400px]" }) => {
    if (!isOpen) return null;

    const content = (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className={`h-auto min-h-[20vh] ${width} rounded bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between rounded border-b border-gray-200 bg-gray-50 px-2 py-2">
                        <div className="flex items-center gap-2">
                            {icon}
                            <h1 className="text-lg font-semibold text-black">{title}</h1>
                        </div>
                        <button
                            onClick={onClose}
                            title="Close"
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded border-none bg-[#AE3020] transition-all duration-200 hover:bg-[#d72a14]"
                        >
                            <X size={18} color="#ffffff" />
                        </button>
                    </div>
                )}
                {/* Modal Content */}
                <div className="w-full overflow-x-auto">{modalContent}</div>
            </div>
        </div>
    );

    // Portal to body so the backdrop covers the entire page, not just the parent container
    if (typeof document !== "undefined") {
        return ReactDOM.createPortal(content, document.body);
    }
    return content;
};
