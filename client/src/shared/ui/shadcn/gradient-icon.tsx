import React from 'react';
import { cn } from '@/lib/utils';

interface GradientIconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'purple' | 'blue';
  className?: string;
  iconClassName?: string;
}

export function GradientIcon({
  icon: Icon,
  size = 'md',
  variant = 'purple',
  className,
  iconClassName,
}: GradientIconProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const variants = {
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
  };

  return (
    <div
      className={cn(
        sizes[size],
        variants[variant],
        'rounded-full flex items-center justify-center flex-shrink-0',
        className
      )}
    >
      <Icon className={cn('text-white', iconSizes[size], iconClassName)} />
    </div>
  );
}

export default GradientIcon;
