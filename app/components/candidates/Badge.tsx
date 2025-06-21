import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const badgeVariants = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-blue-500/20 text-blue-400',
  secondary: 'bg-purple-500/20 text-purple-400',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-orange-500/20 text-orange-400',
  danger: 'bg-red-500/20 text-red-400',
};

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const badgeClass = badgeVariants[variant] || badgeVariants.default;

  return (
    <span className={`px-2 py-0.5 rounded font-medium text-xs ${badgeClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge; 