import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";
import type { ISODateString } from "@/types";

function toDate(value: ISODateString | Date): Date {
  return value instanceof Date ? value : parseISO(value);
}

/** "Mar 14, 2026" */
export function formatDate(value: ISODateString | Date): string {
  return format(toDate(value), "MMM d, yyyy");
}

/** "Mar 14, 2026 · 2:30 PM" */
export function formatDateTime(value: ISODateString | Date): string {
  return format(toDate(value), "MMM d, yyyy · h:mm a");
}

/** "2:30 PM" */
export function formatTime(value: ISODateString | Date): string {
  return format(toDate(value), "h:mm a");
}

/** "3 days ago", "2 hours ago" */
export function formatRelative(value: ISODateString | Date): string {
  return `${formatDistanceToNowStrict(toDate(value))} ago`;
}

/** Human day label: "Today", "Tomorrow", "Yesterday", or "Mar 14". */
export function formatDayLabel(value: ISODateString | Date): string {
  const d = toDate(value);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}
