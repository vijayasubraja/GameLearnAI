import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DEV_FALLBACK_ENABLED } from '../services/fallback/devData';

/**
 * Floating banner — visible only when VITE_ENABLE_DEV_FALLBACK=true.
 * Renders inline at the top of AppShell content so reviewers always see it.
 */
export const DevBanner: React.FC = () => {
  if (!DEV_FALLBACK_ENABLED) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-subtle px-4 py-3 text-xs leading-relaxed"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
      <div>
        <p className="font-medium text-warning-text">Development preview mode</p>
        <p className="mt-0.5 text-ink-mid">
          Some pages are showing marked fallback data because the real backend endpoints
          are not available. No real API data is being shown. Set
          <code className="mx-1 rounded bg-black/30 px-1 py-0.5 font-mono text-warning-text">VITE_ENABLE_DEV_FALLBACK=false</code>
          to disable.
        </p>
      </div>
    </div>
  );
};