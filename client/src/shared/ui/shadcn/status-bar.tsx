import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className }: StatusBarProps) {
  // Get current time
  const currentTime = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className={cn(
      "h-8 px-3 flex justify-between items-center text-xs text-gray-300 bg-[#13091F]",
      className
    )}>
      <span>{currentTime}</span>
      <div className="flex gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.25 5.025c0-1.656-1.344-3-3-3H6.75c-1.656 0-3 1.344-3 3v13.95c0 1.656 1.344 3 3 3h10.5c1.656 0 3-1.344 3-3V5.025zm-3 15.45H6.75c-.828 0-1.5-.672-1.5-1.5V5.025c0-.828.672-1.5 1.5-1.5h10.5c.828 0 1.5.672 1.5 1.5v13.95c0 .828-.672 1.5-1.5 1.5z" />
          <path d="M13.5 18c0 .414-.336.75-.75.75h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75z" />
        </svg>
      </div>
    </div>
  );
}

export default StatusBar;
