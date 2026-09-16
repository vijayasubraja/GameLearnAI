import React from 'react';
import { cn } from '../../lib/cn';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  sublabel?: string;
  className?: string;
}

const tones = {
  primary: '#3D7BFF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  stroke = 10,
  tone = 'primary',
  label,
  sublabel,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Score'}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tones[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-2xl font-bold text-ink-high tabular-nums">{Math.round(pct)}</span>
        {label && <span className="label-hud -mt-0.5">{label}</span>}
        {sublabel && <span className="mt-0.5 text-[10px] text-ink-low">{sublabel}</span>}
      </div>
    </div>
  );
};