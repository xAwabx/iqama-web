import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-hairline bg-card px-md py-sm text-body text-ink",
        "placeholder:text-ink-muted",
        "transition-colors duration-150",
        "hover:border-ink-muted",
        "focus:border-ink focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-accent",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
