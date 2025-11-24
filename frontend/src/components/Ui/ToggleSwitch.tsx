import React from "react";

type Props = {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    label?: React.ReactNode;
    className?: string;
};

const ToggleSwitch: React.FC<Props> = ({ checked, onCheckedChange, label, className = "" }) => {
    return (
        <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
            <input
                type="checkbox"
                className="sr-only"
                aria-checked={checked}
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
            />

            <div className="w-11 h-6 bg-gray-300 rounded-full relative transition-all peer-focus:outline-none"
                 aria-hidden>
        <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
            </div>

            {label && <span className="ml-1 text-gray-700">{label}</span>}
        </label>
    );
};

export default ToggleSwitch;
