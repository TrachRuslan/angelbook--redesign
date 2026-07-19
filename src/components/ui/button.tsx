import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-300 outline-none select-none shadow-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gold-500/90 text-charcoal-950 hover:bg-gold-400 hover:shadow-soft-hover active:bg-gold-500",
        outline:
          "border-ivory-200/10 bg-transparent text-ivory-100 hover:border-gold-500/30 hover:bg-white/5 hover:text-gold-400",
        secondary:
          "bg-charcoal-700 text-ivory-100 hover:bg-charcoal-600 hover:text-ivory-50",
        ghost:
          "text-ivory-200/70 hover:bg-white/5 hover:text-ivory-100",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-gold-500 underline-offset-4 hover:text-gold-400 hover:underline",
      },
      size: {
        default: "h-auto gap-1.5 px-8 py-3.5 text-[15px] tracking-wide",
        xs: "h-7 gap-1 rounded-xl px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-2xl px-5 text-sm",
        lg: "h-auto gap-2 px-10 py-4 text-base tracking-wide",
        icon: "size-10 rounded-2xl",
        "icon-xs": "size-7 rounded-xl",
        "icon-sm": "size-9 rounded-2xl",
        "icon-lg": "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
