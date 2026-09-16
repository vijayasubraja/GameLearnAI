import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Flame,
  Play,
  ArrowRight,
  Brain,
  Gauge,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { profileService } from '../services/profileService';
import { isDevFallback } from '../services/fallback/devData';
import type { DashboardPayload } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { DevBanner } from '../components/DevBanner';
import { LearningCoachCard } from '../components/learning/LearningCoachCard';
import { ScenarioCard } from '../components/learning/ScenarioCard';
import { skillTone, difficultyTone, formatDate } from '../lib/format';
import { skillMetaByKey } from '../features/skills/skillCatalog';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const shellContext = useOutletContext<{ dashboard: DashboardPayload | null }>();
  const { data: dashboard, loading, error, refetch } = useApi<DashboardPayload>(
    () => profileService.getDashboard(),
    { immediate: !shellContext?.dashboard }
  );

  const payload = shellContext?.dashboard ?? dashboard;
  const isLoading = !payload && loading;
  const hasError = !payload && !loading && !!error;

  if (hasError) {
    return (
      <div className="space-y-6">
        <DevBanner />
        <ErrorState
          title="Dashboard unavailable"
          message={error?.message ?? ''}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DevBanner />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = payload?.learner?.name || user?.full_name || user?.username || 'Learner';
  const isPreview = payload ? isDevFallback(payload) : false;

  return (
    <div className="space-y-6">
      <DevBanner />

      {/* 1. Welcome header */}
      <PageHeader
        eyebrow={<Badge tone="primary" size="sm"><Brain className="mr-1 h-3 w-3" /> Adaptive Learning Command</Badge>}
        title={`Welcome back, ${displayName}`}
        subtitle="Your learning performance is synced from the GameLearn intelligence engine. Choose a scenario to keep progressing."
        actions={
          payload?.recommended_scenario && (
            <Button onClick={() => navigate(`/scenarios/${payload.recommended_scenario.id}`)} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start recommended
            </Button>
          )
        }
      />

      {isPreview && (
        <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* 2+3. Skill level + progress summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Overall skill level"
              value={
                <span className="inline-flex items-center gap-2">
                  {payload?.overall_level ?? '—'}
                  <Gauge className="h-5 w-5 text-primary-text" />
                </span>
              }
              sublabel="Learner capability, not scenario difficulty"
              tone="primary"
            />
            <StatCard
              label="Learning streak"
              value={payload ? `${payload.learning_streak_days}d` : '—'}
              sublabel="Consecutive active days"
              icon={<Flame className="h-4 w-4" />}
              tone="warning"
            />
          </div>

          {/* 8. Recommended scenario */}
          <div>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-low">
              Next recommended challenge
            </h2>
            {payload?.recommended_scenario ? (
              <ScenarioCard scenario={payload.recommended_scenario} recommended />
            ) : (
              <EmptyState title="No recommendation yet" description="Your personalised next challenge appears after your first simulation." />
            )}
          </div>

          {/* 6. Recent simulation results */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-low">Recent simulation results</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/progress')} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                View all
              </Button>
            </div>

            {payload && payload.recent_results.length > 0 ? (
              <Card pad="none" className="divide-y divide-gl-border">
                {payload.recent_results.map((attempt) => {
                  const meta = skillMetaByKey(attempt.skill_category);
                  return (
                    <button
                      key={attempt.attempt_id}
                      type="button"
                      onClick={() => navigate(`/results/${attempt.attempt_id}`)}
                      className="flex w-full flex-col gap-2 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-high">{attempt.scenario_title}</p>
                        <p className="mt-0.5 text-xs text-ink-low">{meta.short} · {formatDate(attempt.completed_at)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={difficultyTone(attempt.difficulty_level)} size="sm">{attempt.difficulty_level}</Badge>
                        {attempt.overall_score != null ? (
                          <span className="font-display text-base font-bold tabular-nums text-success-text">{attempt.overall_score}</span>
                        ) : (
                          <Badge tone="warning" size="sm">{attempt.status}</Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </Card>
            ) : (
              <EmptyState
                title="No simulations yet"
                description="Run your first scenario to start building a performance record."
                action={
                  <Button onClick={() => navigate('/scenarios')} leftIcon={<Play className="h-4 w-4" />}>
                    Browse scenarios
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* 10. Learning coach */}
          <LearningCoachCard
            coach={payload?.coach}
            loading={isLoading}
            className="lg:sticky lg:top-0"
          />

          {/* 4. Skill progress */}
          <div>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-low">Skill progress</h2>
            <Card className="space-y-4">
              {payload && payload.skill_progress.length > 0 ? (
                payload.skill_progress.slice(0, 5).map((skill) => (
                  <div key={skill.skill_id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('/skills')}
                        className="truncate text-xs font-medium text-ink-high transition-colors hover:text-primary-text"
                      >
                        {skill.name}
                      </button>
                      <Badge tone={skillTone(skill.level)} size="sm">{skill.level}</Badge>
                    </div>
                    <ProgressBar value={skill.progress} size="sm" tone="primary" />
                  </div>
                ))
              ) : (
                <EmptyState title="No skills mapped" description="Complete an assessment to map your skills." />
              )}
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/skills')} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Open skill map
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;