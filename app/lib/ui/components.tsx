'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';
import { buttonClasses, cardClasses, textClasses, statusClasses, loadingClasses } from './styles';
import { fadeInVariants, scaleInVariants } from './animations';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
  );
};

// Loading Dots Component
export const LoadingDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`${loadingClasses.dots} ${className}`}>
    <div className={`${loadingClasses.dot}`}></div>
    <div className={`${loadingClasses.dot}`} style={{ animationDelay: '0.1s' }}></div>
    <div className={`${loadingClasses.dot}`} style={{ animationDelay: '0.2s' }}></div>
  </div>
);

// Status Badge Component
export const StatusBadge: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}> = ({ type, children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[type]} ${className}`}>
    {type === 'success' && <Check className="w-3 h-3" />}
    {type === 'error' && <X className="w-3 h-3" />}
    {type === 'warning' && <AlertCircle className="w-3 h-3" />}
    {type === 'info' && <Info className="w-3 h-3" />}
    {children}
  </span>
);

// Card Component
export const Card: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
  className?: string;
  animate?: boolean;
}> = ({ children, variant = 'default', className = '', animate = false }) => {
  const Component = animate ? motion.div : 'div';
  const props = animate ? { variants: fadeInVariants, initial: 'hidden', animate: 'visible' } : {};

  return (
    <Component className={`${cardClasses[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 ${buttonClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

// Modal Component
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({ isOpen, onClose, children, title, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className={`${cardClasses.elevated} max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        variants={scaleInVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {title && (
          <div className="p-4 border-b border-border">
            <h2 className={textClasses.heading}>{title}</h2>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// Tooltip Component
export const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ children, content, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50`}>
        {content}
      </div>
    </div>
  );
};

// Divider Component
export const Divider: React.FC<{ className?: string; orientation?: 'horizontal' | 'vertical' }> = ({ 
  className = '', 
  orientation = 'horizontal' 
}) => (
  <div 
    className={`${
      orientation === 'horizontal' 
        ? 'w-full h-px bg-border' 
        : 'h-full w-px bg-border'
    } ${className}`} 
  />
);

// Empty State Component
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
    {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
    <h3 className={`${textClasses.subheading} mb-2`}>{title}</h3>
    {description && <p className={`${textClasses.muted} mb-4`}>{description}</p>}
    {action && <div>{action}</div>}
  </div>
); 