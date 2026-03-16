"use client";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  /** "top" (default) | "bottom" */
  position?: "top" | "bottom";
}

export default function Tooltip({ label, children, position = "top" }: TooltipProps) {
  return (
    <span className="relative group/tip inline-flex">
      {children}
      <span
        className={[
          "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
          "rounded-md px-2 py-1 text-[11px] font-medium",
          "bg-[#1b2a47] text-white shadow-md",
          "opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100",
          "transition-all duration-150 z-50",
          position === "top"
            ? "bottom-full mb-2"
            : "top-full mt-2",
        ].join(" ")}
      >
        {label}
        {/* Petite flèche */}
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 w-0 h-0",
            "border-x-4 border-x-transparent",
            position === "top"
              ? "top-full border-t-4 border-t-[#1b2a47]"
              : "bottom-full border-b-4 border-b-[#1b2a47]",
          ].join(" ")}
        />
      </span>
    </span>
  );
}
