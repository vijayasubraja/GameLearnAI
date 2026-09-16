import React from 'react';
import { ArrowRight, Target, AlertCircle, Compass } from 'lucide-react';
import type { CoachRecommendation, RecommendationAction } from '../../types/domain';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ErrorState } from '../ui/ErrorState';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '../../lib/cn';

const kindMeta: Record<RecommendationAction['kind'], { tone: 'primary' | 'success' | 'warning' | 'danger'; icon: React.ReactNode; label: string }> = {
  recommendation: { tone: 'primary', icon: <Compass className="h-4 w-4" />, label: 'Recommendation' },
  weak_area: { tone: 'warning', icon: <AlertCircle className="h-4 w-4" />, label: 'Weak area' },
  mistake: { tone: 'danger', icon: <AlertCircle className="h-4 w-4" />, label: 'Mistake review' },
  practice: { tone: 'success', icon: <Target className="h-4 w-4" />, label: 'Practice' },
  focus: { tone: 'primary', icon: <Target className="h-4 w-4" />, label: 'Focus' },
};

interface LearningCoachCardProps {
  coach?: CoachRecommendation;
  loading?: boolean;
  error?: Error | React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable learning coach panel. Renders backend-generated guidance only —
 * no educational logic lives in React.
 */
export const LearningCoachCard: React.FC<LearningCoachCardProps> = ({
  coach,
  loading,
  error,
  onRetry,
  className,
}) => {
  if (loading) {
    return (
      <Card className={cn('p-5', className)}>
        <Skeleton className="h-4 w-40" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Coach unavailable" message="Guidance could not be loaded." onRetry={onRetry} className={className} />;
  }

  if (!coach) {
    return <ErrorState title="No guidance yet" message="Your coach will appear after your first simulation." className={className} />;
  }

  return (
    <Card className={cn('p-5', className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="label-hud">Learning Coach</p>
          <h3 className={cn('mt-0.5 font-display text-sm font-semibold text-ink-high')}>AI Study Guide</h3>
        </div>
        {coach.current_focus && <Badge tone="primary" size="sm">Focus: {coach.current_focus}</Badge>}
      </div>

      <ul className="space-y-2.5">
        {coach.actions.map((action, idx) => {
          const meta = kindMeta[action.kind] ?? kindMeta.recommendation;
          return (
            <li
              key={`${action.kind}-${idx}`}
              className="flex items-start gap-3 rounded-lg border border-gl-border bg-white/[0.02] p-3"
            >
              <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', {
                'bg-primary-subtle text-primary-text': meta.tone === 'primary',
                'bg-success-subtle text-success-text': meta.tone === 'success',
                'bg-warning-subtle text-warning-text': meta.tone === 'warning',
                'bg-danger-subtle text-danger-text': meta.tone === 'danger',
              })} aria-hidden>
                {meta.icon}
              </span>
              <div className="min-w-0">
                <p className="label-hud">{meta.label}</p>
                <p className="mt-1 text-xs font-medium text-ink-high">{action.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-mid">{action.message}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {coach.next_scenario_title && (
        <Button variant="ghost" size="sm" className="mt-4 w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
          Next: {coach.next_scenario_title}
        </Button>
      )}
    </Card>
  );
};