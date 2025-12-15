import * as React from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
}

export const Avatar = ({ src, name, className, children, ...props }: AvatarProps) => {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const resolvedSrc = resolveMediaUrl(src);

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
        className
      )}
      {...props}
    >
      {resolvedSrc ? (
        <img src={resolvedSrc} alt={name ?? "User avatar"} className="h-full w-full object-cover" />
      ) : (
        children ?? initials ?? "?"
      )}
    </div>
  );
};
