import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

type ButtonConfig<T extends object = object> = {
  label: string;
  variant: "approve" | "edit" | "block" | "unblock" | "delete" | "process";
  onClick: (row: T) => void;
};

interface ActionDropdownProps<T extends object = object> {
  buttons: ButtonConfig<T>[];
  row: T;
  onClose: () => void;
}

const ActionDropdown = <T extends object = object>({ buttons, row, onClose }: ActionDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case "approve":
        return "text-green-600 hover:bg-green-50";
      case "edit":
        return "text-blue-600 hover:bg-blue-50";
      case "block":
        return "text-orange-600 hover:bg-orange-50";
      case "unblock":
        return "text-green-600 hover:bg-green-50";
      case "delete":
        return "text-red-600 hover:bg-red-50";
      case "process":
        return "text-purple-600 hover:bg-purple-50";
      default:
        return "text-gray-700 hover:bg-gray-50";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`w-full text-left px-3 py-2 text-sm ${getButtonStyles(button.variant)} flex items-center gap-2 transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                button.onClick(row);
                setIsOpen(false);
                onClose();
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;