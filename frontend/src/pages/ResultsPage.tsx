import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LayoutDashboard, RotateCcw, XCircle, AlertCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { performanceService } from '../services/performanceService';
import { getSimulationSessionSnapshot } from '../features/simulation/sessionStore';
import { isDevFallback } from '../services/fallback/devData';
import type { PerformanceResult } from '../types/domain';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Skeleton, SkeletonLine } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { DevBanner } from '../components/DevBanner';
import { difficultyTone } from '../lib/format';
import { cn } from '../lib/cn';

const scoreLabel: Record<string, string> = {
  accuracy_score: 'Accuracy',
  safety_score: 'Safety',
  decision_score: 'Decision-making',
  reaction_score: 'Reaction time',
  completion_score: 'Completion',
};

export const ResultsPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const fromSession = getSimulationSessionSnapshot();
  const sessionResult =
    fromSession.result && attemptId && fromSession.result.attempt_id === attemptId
      ? fromSession.result
      : null;

  const { data, loading, error, refetch } = useApi<PerformanceResult>(
    () => performanceService.getResult(attemptId ?? ''),
    { immediate: !sessionResult }
  );

  const result = sessionResult ?? data;
  const isPreview = result ? isDevFallback(result) : false;

  if (loading) {
    return (
      <div className="space-y-6">
        <DevBanner />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <SkeletonLine width="45%" />
            <SkeletonLine width="30%" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 w-full lg:col-span-2" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="space-y-6">
        <DevBanner />
        <ErrorState
          title="Result unavailable"
          message={error.message}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
        <div className="flex justify-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
          <Button onClick={() => navigate('/scenarios')}>Browse scenarios</Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <DevBanner />
        <ErrorState
          title="No performance data"
          message="No score or completion status is available for this attempt yet."
          className="mx-auto max-w-2xl"
        />
      </div>
    );
  }

  const failed = result.completion_status !== 'completed';
  const ringTone = failed ? 'danger' : result.overall_score >= 80 ? 'success' : result.overall_score >= 60 ? 'warning' : 'danger';
  const nextScenarioPath = result.next_scenario_id
    ? `/scenarios/${result.next_scenario_id}`
    : '/scenarios';

  return (
    <div className="space-y-6">
      <DevBanner />

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={failed ? 'danger' : 'success'} size="sm" dot>
          {failed ? 'Mission failed' : 'Mission completed'}
        </Badge>
        {isPreview && (
          <Badge tone="warning" size="sm">Marked development preview score</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score summary */}
        <Card className="flex flex-col items-center justify-center gap-4 py-8 text-center lg:col-span-1">
          <ProgressRing
            value={result.overall_score}
            size={150}
            stroke={12}
            tone={ringTone}
            label="Overall"
            sublabel={`${result.attempt_id.length > 18 ? result.attempt_id.slice(0, 18) + '…' : result.attempt_id}`}
          />
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-ink-high">{result.scenario_title}</h1>
            <p className="mt-1 text-xs text-ink-low">{result.mistake_count} mistake{result.mistake_count === 1 ? '' : 's'} recorded</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge tone={difficultyTone(result.next_difficulty)} size="sm">Next: {result.next_difficulty}</Badge>
          </div>
        </Card>

        {/* Detailed breakdown */}
        <Card className="lg:col-span-2">
          <h2 className="label-hud">Performance breakdown</h2>
          <div className="mt-5 space-y-5">
            {(Object.keys(scoreLabel) as Array<keyof PerformanceResult>).map((key) => {
              const value = Number(result[key] ?? 0);
              const tone =
                value >= 80 ? 'success' : value >= 60 ? 'warning' : 'danger';
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-ink-mid">{scoreLabel[key]}</span>
                    <span className={cn(
                      'text-sm font-semibold tabular-nums',
                      tone === 'success' ? 'text-success-text' : tone === 'warning' ? 'text-warning-text' : 'text-danger-text'
                    )}>
                      {value}
                    </span>
                  </div>
                  <ProgressBar value={value} size="sm" tone={tone} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Successful actions */}
        <Card tone="success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success-text" aria-hidden />
            <h2 className="label-hud text-success-text">Successful actions</h2>
          </div>
          {result.successful_actions.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {result.successful_actions.map((action) => (
                <li key={action} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-high">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden />
                  {action}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-ink-mid">No successful actions recorded this attempt.</p>
          )}
        </Card>

        {/* Mistakes */}
        <Card tone="danger">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-danger-text" aria-hidden />
            <h2 className="label-hud text-danger-text">Mistakes</h2>
          </div>
          {result.mistakes.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {result.mistakes.map((mistake) => (
                <li key={mistake} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-high">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" aria-hidden />
                  {mistake}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-ink-mid">No mistakes were detected this attempt.</p>
          )}
        </Card>

        {/* Improvement tips */}
        <Card tone="primary">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary-text" aria-hidden />
            <h2 className="label-hud text-primary-text">Improvement tips</h2>
          </div>
          {result.improvement_tips.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {result.improvement_tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-mid">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-ink-mid">Keep up the strong habits.</p>
          )}
        </Card>
      </div>

      {/* Next steps */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="label-hud">Recommended next mission</p>
          <p className="mt-1 text-sm font-medium text-ink-high">
            {result.next_scenario_title || 'Continue with the next challenge'}
          </p>
          <p className="mt-0.5 text-xs text-ink-low">Matched next difficulty: {result.next_difficulty}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard')} leftIcon={<LayoutDashboard className="h-4 w-4" />}>
            Back to dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(nextScenarioPath)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Continue learning
          </Button>
          <Button
            onClick={() => navigate(`/scenarios/${result.scenario_id}`)}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResultsPage;