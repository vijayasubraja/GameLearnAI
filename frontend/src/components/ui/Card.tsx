import React from 'react';
import { cn } from '../../lib/cn';

type CardTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  pad?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const toneClasses: Record<CardTone, string> = {
  default: 'border-gl-border',
  primary: 'border-primary/30',
  success: 'border-success/30',
  warning: 'border-warning/30',
  danger: 'border-danger/30',
};

const padClasses: Record<NonNullable<CardProps['pad']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  tone = 'default',
  pad = 'md',
  interactive = false,
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={cn(
        'panel rounded-xl',
        toneClasses[tone],
        padClasses[pad],
        interactive && 'transition-all hover:border-gl-borderStrong hover:shadow-panel-hover',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};