import React from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HomeIcon, TaskIcon, ChatIcon, AlarmIcon, SettingsIcon } from '@/lib/icons';

interface NavBarProps {
  className?: string;
}

export function NavBar({ className }: NavBarProps) {
  const [location] = useLocation();
  
  const routes = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/tasks', icon: TaskIcon, label: 'Tasks' },
    // Chat is center button with special styling
    { path: '/alarms', icon: AlarmIcon, label: 'Alarms' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className={cn(
      "h-16 bg-[#1A0B2E]/80 backdrop-blur-md border-t border-purple-800/20 flex justify-around items-center px-2",
      className
    )}>
      {routes.slice(0, 2).map((route) => (
        <NavButton
          key={route.path}
          to={route.path}
          icon={route.icon}
          label={route.label}
          isActive={location === route.path}
        />
      ))}
      
      <div className="relative -top-5">
        <Link to="/chat">
          <button className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <ChatIcon className="h-6 w-6 text-white" />
          </button>
        </Link>
      </div>
      
      {routes.slice(2).map((route) => (
        <NavButton
          key={route.path}
          to={route.path}
          icon={route.icon}
          label={route.label}
          isActive={location === route.path}
        />
      ))}
    </div>
  );
}

interface NavButtonProps {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
}

function NavButton({ to, icon: Icon, label, isActive }: NavButtonProps) {
  return (
    <Link to={to}>
      <button className="w-14 h-14 flex flex-col items-center justify-center">
        <Icon className={cn(
          "h-6 w-6",
          isActive ? "text-purple-400" : "text-gray-500"
        )} />
        <span className={cn(
          "text-xs mt-1",
          isActive ? "text-purple-400" : "text-gray-500"
        )}>
          {label}
        </span>
        
        {isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute bottom-0 w-10 h-0.5 bg-purple-400 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    </Link>
  );
}

export default NavBar;
