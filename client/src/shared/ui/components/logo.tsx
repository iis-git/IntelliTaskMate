import React from 'react';
import { LightbulbIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', withText = true, className }: LogoProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn(
        sizes[size],
        'rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]'
      )}>
        <LightbulbIcon className={cn('text-white', iconSizes[size])} />
      </div>
      
      {withText && (
        <div className="ml-3">
          <h1 className={cn(
            'font-semibold text-white',
            {
              'text-lg': size === 'sm',
              'text-xl': size === 'md',
              'text-2xl': size === 'lg',
            }
          )}>
            Aura
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-400">Your AI assistant</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
