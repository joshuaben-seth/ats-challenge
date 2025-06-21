// Common CSS class combinations for consistent styling

// Card styles
export const cardClasses = {
  default: 'bg-card rounded-lg shadow-lg border border-border overflow-hidden',
  elevated: 'bg-card rounded-lg shadow-xl border border-border/50 overflow-hidden',
  flat: 'bg-card rounded-lg border border-border overflow-hidden'
};

// Button styles
export const buttonClasses = {
  primary: 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors',
  secondary: 'px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors border border-border',
  ghost: 'px-4 py-2 text-foreground hover:bg-secondary/50 rounded-md transition-colors',
  icon: 'p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors border border-border'
};

// Loading states
export const loadingClasses = {
  spinner: 'w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin',
  dots: 'flex items-center gap-1',
  dot: 'w-2 h-2 bg-primary rounded-full animate-bounce'
};

// Status indicators
export const statusClasses = {
  success: 'text-green-500 bg-green-500/10 border-green-500/20',
  error: 'text-red-500 bg-red-500/10 border-red-500/20',
  warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
};

// Text utilities
export const textClasses = {
  heading: 'text-xl font-bold text-foreground',
  subheading: 'text-lg font-semibold text-foreground',
  body: 'text-sm text-foreground',
  muted: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground'
}; 