import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time in 12-hour format (7:00 AM)
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Check if a date is today
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

// Format date as "Wed, Oct 11"
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Get the current time
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Generate a random ID for temporary usage
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Get color based on category
export function getCategoryColor(color: string): string {
  switch (color.toLowerCase()) {
    case 'purple':
      return 'bg-gradient-to-br from-purple-400 to-purple-600';
    case 'blue':
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-700';
  }
}

// Get badge color based on category
export function getCategoryBadgeColor(color: string): string {
  switch (color.toLowerCase()) {
    case 'purple':
      return 'bg-purple-500/20 text-purple-300';
    case 'blue':
      return 'bg-blue-500/20 text-blue-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
}

// Create a gradient style for background
export function createGradientStyle(from: string, to: string): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, ${from}, ${to})`,
  };
}

// Create a glow effect style
export function createGlowStyle(color: string): React.CSSProperties {
  return {
    boxShadow: `0 0 15px ${color}`,
  };
}
