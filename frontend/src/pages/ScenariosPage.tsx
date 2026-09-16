import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Library, Star, SlidersHorizontal } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { scenarioService } from '../services/scenarioService';
import { isDevFallback } from '../services/fallback/devData';
import type { Scenario, ScenarioFilters, SkillCategoryKey } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { DevBanner } from '../components/DevBanner';
import { ScenarioCard } from '../components/learning/ScenarioCard';
import { SKILL_CATALOG } from '../features/skills/skillCatalog';
import { cn } from '../lib/cn';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
const STATUSES = ['available', 'completed', 'locked'] as const;

type StatusFilter = ScenarioFilters['status'];

const filterBtn = (active: boolean) =>
  cn(
    'h-8 rounded-md border px-3 text-xs font-medium transition-colors',
    active
      ? 'border-primary/40 bg-primary-subtle text-primary-text'
      : 'border-gl-border bg-gl-surface text-ink-mid hover:border-gl-borderStrong hover:text-ink-high'
  );

export const ScenariosPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = (searchParams.get('skill') as SkillCategoryKey | null) ?? 'all';

  const [skill, setSkill] = useState<SkillCategoryKey | 'all'>(initialSkill);
  const [difficulty, setDifficulty] = useState<ScenarioFilters['difficulty']>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [recommendedOnly, setRecommendedOnly] = useState(false);

  const filters = useMemo<ScenarioFilters>(
    () => ({ skill, difficulty, status }),
    [skill, difficulty, status]
  );

  const { data: scenarios, loading, error, refetch } = useApi<Scenario[]>(
    () => scenarioService.listScenarios(filters),
    { immediate: true }
  );

  const setSkillFilter = (value: SkillCategoryKey | 'all') => {
    setSkill(value);
    if (value === 'all') searchParams.delete('skill');
    else searchParams.set('skill', value);
    setSearchParams(searchParams, { replace: true });
  };

  const visible = useMemo(() => {
    if (!scenarios) return [];
    return recommendedOnly ? scenarios.filter((s) => s.is_recommended) : scenarios;
  }, [scenarios, recommendedOnly]);

  const isPreview = scenarios ? isDevFallback(scenarios) : false;
  const hasFilters = skill !== 'all' || difficulty !== 'all' || status !== 'all';

  return (
    <div className="space-y-6">
      <DevBanner />

      <PageHeader
        eyebrow={
          <Badge tone="primary" size="sm">
            <Library className="mr-1 h-3 w-3" /> Mission Library
          </Badge>
        }
        title="Scenario missions"
        subtitle="Each mission trains one skill at a matched difficulty. Open a briefing to review the objective before entering the simulator."
      />

      {error && (
        <ErrorState
          title="Scenarios unavailable"
          message={error.message}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
      )}

      {/* Filters */}
      <div className="space-y-3 rounded-xl border border-gl-border bg-gl-surface/60 p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-low">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Filters
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-ink-mid">Skill</span>
          <button type="button" className={filterBtn(skill === 'all')} onClick={() => setSkillFilter('all')}>All</button>
          {SKILL_CATALOG.map((s) => (
            <button key={s.key} type="button" className={filterBtn(skill === s.key)} onClick={() => setSkillFilter(s.key)}>
              {s.short}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-ink-mid">Difficulty</span>
          <button type="button" className={filterBtn(difficulty === 'all')} onClick={() => setDifficulty('all')}>All</button>
          {DIFFICULTIES.map((d) => (
            <button key={d} type="button" className={filterBtn(difficulty === d)} onClick={() => setDifficulty(d)}>
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-ink-mid">Status</span>
          <button type="button" className={filterBtn(status === 'all')} onClick={() => setStatus('all')}>All</button>
          {STATUSES.map((s) => (
            <button key={s} type="button" className={filterBtn(status === s)} onClick={() => setStatus(s)}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button
            type="button"
            className={filterBtn(recommendedOnly)}
            onClick={() => setRecommendedOnly((v) => !v)}
          >
            <Star className={cn('mr-1 inline-block h-3 w-3', recommendedOnly && 'text-primary')} />
            Recommended only
          </button>
        </div>
      </div>

      {isPreview && (
        <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
      )}

      {(hasFilters || recommendedOnly) && scenarios && (
        <p className="label-hud">
          {visible.length} {visible.length === 1 ? 'mission' : 'missions'} matched
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <EmptyState
          title={hasFilters || recommendedOnly ? 'No missions match these filters' : 'No scenarios available'}
          description={
            hasFilters || recommendedOnly
              ? 'Try widening the filters or clearing the recommended-only toggle.'
              : 'Missions will appear here once the scenario engine is provisioned.'
          }
          action={
            hasFilters || recommendedOnly ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSkillFilter('all');
                  setDifficulty('all');
                  setStatus('all');
                  setRecommendedOnly(false);
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {visible.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} recommended={scenario.is_recommended} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenariosPage;