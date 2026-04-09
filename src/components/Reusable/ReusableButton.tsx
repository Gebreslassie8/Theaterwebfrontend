import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import ButtonStyle from './ButtonStyle';

interface ReusableButtonProps {
    label?: string; // ✅ allow optional (for icon-only buttons)
    children?: React.ReactNode; // ✅ support children (important fix)
    icon?: keyof typeof LucideIcons;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // ✅ fix typing
    className?: string;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
    formId?: string;
    disabled?: boolean;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
    label,
    children,
    icon,
    onClick,
    className = "",
    style = {},
    type = "button",
    formId,
    disabled = false,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const IconComponent = icon ? LucideIcons[icon] : null;

    const buttonStyle = {
        color: style.color || ButtonStyle.color,
        backgroundColor: isHovered
            ? (style.hoverBackgroundColor || ButtonStyle.hoverBackgroundColor)
            : (style.backgroundColor || ButtonStyle.backgroundColor),
        transition: 'all 0.3s ease',
        ...style,
    };

    return (
        <button
            type={type} // ✅ critical for submit
            onClick={onClick} // ✅ ensures click works
            disabled={disabled}
            className={`${ButtonStyle.base} ${className} flex items-center justify-center space-x-1 p-2 md:p-4 lg:p-6`}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            form={formId}
        >
            {IconComponent && <IconComponent size={20} />}

            {/* ✅ FIX: support BOTH label and children */}
            {label && (
                <span className="text-sm md:text-base lg:text-lg ml-2">
                    {label}
                </span>
            )}
            {children}
        </button>
    );
};

export default ReusableButton;