import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imgUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SERVER_BASE || "http://localhost:8080";
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${base}${path}`;
}
