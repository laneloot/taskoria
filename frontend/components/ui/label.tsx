import * as React from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-zinc-700 dark:text-zinc-200", className)}
      {...rest}
    />
  );
});

Label.displayName = "Label";
