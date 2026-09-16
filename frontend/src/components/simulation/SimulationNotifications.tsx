import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, ShieldAlert } from 'lucide-react';
import { dismissNotification, useSimulationSession, type NotificationTone } from '../../features/simulation/sessionStore';
import { cn } from '../../lib/cn';

const toneStyles: Record<NotificationTone, { wrap: string; icon: React.ReactNode }> = {
  info: { wrap: 'border-primary/30 bg-gl-surface/95 text-ink-high', icon: <Info className="h-4 w-4 text-primary-text" /> },
  success: { wrap: 'border-success/30 bg-gl-surface/95 text-ink-high', icon: <CheckCircle2 className="h-4 w-4 text-success-text" /> },
  warning: { wrap: 'border-warning/30 bg-gl-surface/95 text-ink-high', icon: <AlertTriangle className="h-4 w-4 text-warning-text" /> },
  danger: { wrap: 'border-danger/40 bg-gl-surface/95 text-ink-high', icon: <ShieldAlert className="h-4 w-4 text-danger-text" /> },
};

export const SimulationNotifications: React.FC = () => {
  const { notifications } = useSimulationSession();

  if (notifications.length === 0) return null;

  return (
    <div className="absolute right-3 top-24 z-30 flex w-72 flex-col gap-2 sm:top-28" aria-live="polite">
      {notifications.map((n) => {
        const style = toneStyles[n.tone];
        return (
          <div
            key={n.id}
            role="status"
            className={cn(
              'animate-slide-up flex items-start gap-2.5 rounded-xl border px-3 py-2.5 shadow-panel backdrop-blur',
              style.wrap
            )}
          >
            <span className="mt-0.5 shrink-0">{style.icon}</span>
            <p className="min-w-0 flex-1 text-xs leading-relaxed">{n.message}</p>
            <button
              type="button"
              onClick={() => dismissNotification(n.id)}
              className="shrink-0 rounded p-0.5 text-ink-low transition-colors hover:text-ink-high"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SimulationNotifications;