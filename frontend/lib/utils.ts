import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fallbackApiUrl = "http://localhost:8000/api/v1";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;

let mediaOrigin = "http://localhost:8000";
let mediaProtocol = "http:";

try {
  const url = new URL(rawApiUrl);
  mediaOrigin = `${url.protocol}//${url.host}`;
  mediaProtocol = url.protocol;
} catch {
  // fallbacks already set
}

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^(?:https?:|data:|blob:)/i.test(value)) {
    return value;
  }
  if (value.startsWith("//")) {
    return `${mediaProtocol}${value}`;
  }
  if (value.startsWith("/")) {
    return `${mediaOrigin}${value}`;
  }
  return `${mediaOrigin}/${value}`;
};
