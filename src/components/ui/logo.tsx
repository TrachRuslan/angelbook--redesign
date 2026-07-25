import { cn } from "@/lib/utils";

interface AngelLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function AngelLogo({
  className = "h-10 w-10",
  showText = false,
  textClassName = "text-2xl font-light tracking-tight text-ivory-50",
}: AngelLogoProps) {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "shrink-0 filter drop-shadow-[0_0_16px_rgba(125,211,252,0.45)]",
          className
        )}
      >
        {/* Golden Oval Halo */}
        <ellipse
          cx="60"
          cy="14"
          rx="21"
          ry="6"
          stroke="#E6C265"
          strokeWidth="4"
          strokeLinecap="round"
          transform="rotate(-5 60 14)"
        />

        {/* Light Blue Head Circle */}
        <circle
          cx="67"
          cy="36"
          r="14"
          stroke="#7DD3FC"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Upper Wing Feather */}
        <path
          d="M 23 27 C 32 38, 44 48, 58 55"
          stroke="#7DD3FC"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Lower Wing Feather */}
        <path
          d="M 26 42 C 34 50, 44 56, 52 58"
          stroke="#7DD3FC"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Main Wing Outer Curve into Body Swoop */}
        <path
          d="M 19 25 C 24 45, 34 68, 43 75 C 52 82, 60 92, 59 93 C 65 80, 75 62, 72 49"
          stroke="#7DD3FC"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && <span className={textClassName}>AngelBook</span>}
    </div>
  );
}
