import * as React from "react";

export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-200 bg-transparent text-gray-900",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variants[variant]
      } ${className || ""}`}
    >
      {children}
    </span>
  );
}
