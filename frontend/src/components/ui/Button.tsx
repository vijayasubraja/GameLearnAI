import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-primary/40 disabled:text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]',
  secondary:
    'bg-gl-raised text-ink-high border border-gl-border hover:border-gl-borderStrong hover:bg-gl-surface disabled:opacity-50',
  outline:
    'bg-transparent text-primary-text border border-primary/40 hover:bg-primary-subtle disabled:opacity-50',
  ghost:
    'bg-transparent text-ink-mid hover:text-ink-high hover:bg-white/[0.06] disabled:opacity-50',
  success:
    'bg-success text-white hover:bg-success-hover disabled:opacity-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]',
  danger:
    'bg-danger text-white hover:bg-danger-hover disabled:opacity-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
  icon: 'h-9 w-9 rounded-lg justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors select-none disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
        {children}
        {!isLoading ? rightIcon : null}
      </button>
    );
  }
);

Button.displayName = 'Button';