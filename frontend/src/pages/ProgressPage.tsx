import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, BarChart3, CalendarCheck, Flame, Medal, Trophy } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { performanceService } from '../services/performanceService';
import { isDevFallback } from '../services/fallback/devData';
import type { ProgressHistoryPayload, ScoreSeriesPoint } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { DevBanner } from '../components/DevBanner';
import { difficultyTone, formatDate, skillTone, scoreTone } from '../lib/format';
import { skillMetaByKey } from '../features/skills/skillCatalog';

function MiniScoreChart({ points }: { points: ScoreSeriesPoint[] }) {
  const width = 600;
  const height = 180;
  const padX = 12;
  const padY = 24;

  if (points.length === 0) return null;

  const minScore = Math.min(...points.map((p) => p.overall_score)) - 5;
  const maxScore = Math.max(...points.map((p) => p.overall_score)) + 5;
  const span = Math.max(1, maxScore - minScore);

  const x = (i: number) => padX + (i / Math.max(1, points.length - 1)) * (width - padX * 2);
  const y = (score: number) => height - padY - ((score - minScore) / span) * (height - padY * 2);

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.overall_score).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${height - padY} L${padX},${height - padY} Z`;

  const gridLines = [0, 25, 50, 75, 100].map((g) => {
    const gy = height - padY - ((g - minScore) / span) * (height - padY * 2);
    return { g, gy };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Scores over time">
      <defs>
        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D7BFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3D7BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map(({ g, gy }) => (
        <g key={g}>
          <line x1={padX} x2={width - padX} y1={gy} y2={gy} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={2} y={gy + 3} fill="#6B7484" fontSize="9" fontFamily="ui-monospace, monospace">
            {g}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#scoreFill)" />
      <path d={line} fill="none" stroke="#3D7BFF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={p.attempt_id}>
          <circle cx={x(i)} cy={y(p.overall_score)} r="3.2" fill="#0B0E14" stroke={scoreTone(p.overall_score) === 'success' ? '#22C55E' : scoreTone(p.overall_score) === 'warning' ? '#F59E0B' : '#EF4444'} strokeWidth="2" />
          {i === points.length - 1 && (
            <text x={x(i) - 8} y={y(p.overall_score) - 8} fill="#F2F5FA" fontSize="10" fontWeight="600">
              {p.overall_score}
            </text>
          )}
        </g>
      ))}
      {points.map((p, i) =>
        points.length <= 6 ? (
          <text key={p.attempt_id} x={x(i) - 16} y={height - 8} fill="#6B7484" fontSize="9">
            {formatDate(p.completed_at)}
          </text>
        ) : null
      )}
    </svg>
  );
}

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: progress, loading, error, refetch } = useApi<ProgressHistoryPayload>(() => performanceService.getProgress());

  const isPreview = progress ? isDevFallback(progress) : false;

  return (
    <div className="space-y-6">
      <DevBanner />

      <PageHeader
        eyebrow={
          <Badge tone="primary" size="sm">
            <Activity className="mr-1 h-3 w-3" /> Progress History
          </Badge>
        }
        title="Your learning journey"
        subtitle="Scores over time, per-skill progress, and difficulty progression across your completed missions."
        actions={
          <Button variant="secondary" onClick={() => navigate('/skills')} rightIcon={<ArrowRight className="h-4 w-4" />}>
            View skill map
          </Button>
        }
      />

      {error && (
        <ErrorState
          title="Progress unavailable"
          message={error.message}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
      )}

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}

      {progress && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total missions" value={progress.totals.scenarios_completed} icon={<CalendarCheck className="h-4 w-4" />} tone="primary" />
            <StatCard label="Average score" value={progress.totals.average_score} sublabel="across completed missions" icon={<BarChart3 className="h-4 w-4" />} tone={progress.totals.average_score >= 80 ? 'success' : 'warning'} />
            <StatCard label="Current streak" value={`${progress.totals.current_streak_days}d`} sublabel="consecutive days" icon={<Flame className="h-4 w-4" />} tone="warning" />
            <StatCard label="Best score" value={progress.totals.best_score} icon={<Trophy className="h-4 w-4" />} tone="success" />
          </div>

          {isPreview && (
            <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Scores over time */}
            <Card className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="label-hud">Scores over time</h2>
                <Medal className="h-4 w-4 text-ink-low" aria-hidden />
              </div>
              {progress.scores_over_time.length > 1 ? (
                <MiniScoreChart points={progress.scores_over_time} />
              ) : (
                <EmptyState
                  title="Not enough data yet"
                  description="Complete at least two missions to see your score trend."
                  className="py-10"
                />
              )}
            </Card>

            {/* Difficulty progression */}
            <Card>
              <h2 className="label-hud">Difficulty progression</h2>
              {progress.difficulty_progression.length > 0 ? (
                <ol className="mt-4 space-y-3">
                  {[...progress.difficulty_progression].reverse().map((point) => (
                    <li key={point.attempt_id} className="flex items-center justify-between gap-2 rounded-lg border border-gl-border bg-white/[0.02] px-3 py-2">
                      <span className="text-xs text-ink-mid">{formatDate(point.completed_at)}</span>
                      <Badge tone={difficultyTone(point.difficulty_level)} size="sm">{point.difficulty_level}</Badge>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-xs text-ink-mid">Difficulty history will appear after your first simulation.</p>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Skill progress */}
            <Card>
              <h2 className="label-hud">Skill progress</h2>
              <div className="mt-4 space-y-4">
                {progress.skill_progress.map((skill) => (
                  <div key={skill.skill_id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/scenarios?skill=${skill.skill_id}`)}
                        className="truncate text-xs font-medium text-ink-high transition-colors hover:text-primary-text"
                      >
                        {skill.name}
                      </button>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={skillTone(skill.level)} size="sm">{skill.level}</Badge>
                        <span className="text-xs tabular-nums text-primary-text">{skill.progress}%</span>
                      </div>
                    </div>
                    <ProgressBar value={skill.progress} size="sm" tone="primary" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent attempts */}
            <Card>
              <h2 className="label-hud">Recent attempts</h2>
              {progress.recent_attempts.length > 0 ? (
                <div className="mt-3 divide-y divide-gl-border">
                  {progress.recent_attempts.map((attempt) => {
                    const meta = skillMetaByKey(attempt.skill_category);
                    return (
                      <button
                        key={attempt.attempt_id}
                        type="button"
                        onClick={() => navigate(`/results/${attempt.attempt_id}`)}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-high">{attempt.scenario_title}</p>
                          <p className="mt-0.5 text-xs text-ink-low">{meta.short} · {formatDate(attempt.completed_at ?? attempt.started_at)}</p>
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
                </div>
              ) : (
                <div className="mt-4">
                  <EmptyState
                    title="No attempts yet"
                    description="Run your first simulation to start building your history."
                    className="py-8"
                  />
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPage;