import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#D33333]/40",
  {
    variants: {
      variant: {
        default:     "bg-[#D33333] text-white hover:bg-[#b82c2c]",
        outline:     "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300",
        ghost:       "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
        dark:        "bg-zinc-900 text-white hover:bg-zinc-700",
        destructive: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        link:        "text-[#D33333] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "px-4 py-2.5 text-[13px]",
        sm:      "px-3 py-1.5 text-[12px] gap-1.5",
        lg:      "px-5 py-3 text-[14px]",
        icon:    "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
