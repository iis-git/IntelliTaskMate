import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function MobileContainer({
  children,
  className,
  fullHeight = true,
}: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 bg-gradient-to-b from-[#1A0B2E] to-[#13091F]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full max-w-md mx-auto overflow-hidden rounded-3xl shadow-2xl border border-gray-800 bg-[#13091F]",
          {
            "h-[700px] max-h-[90vh]": fullHeight,
          },
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default MobileContainer;
