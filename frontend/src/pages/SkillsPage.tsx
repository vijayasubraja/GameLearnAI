import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Radar, Layers } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { profileService } from '../services/profileService';
import { isDevFallback } from '../services/fallback/devData';
import type { SkillInfo } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { DevBanner } from '../components/DevBanner';
import { skillTone } from '../lib/format';
import { skillMetaByKey } from '../features/skills/skillCatalog';
import { cn } from '../lib/cn';

const statusMeta = {
  not_started: { tone: 'neutral' as const, label: 'Not started' },
  in_progress: { tone: 'primary' as const, label: 'In progress' },
  completed: { tone: 'success' as const, label: 'Completed' },
} as const;

export const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: skills, loading, error, refetch } = useApi<SkillInfo[]>(() => profileService.getSkills());

  const isPreview = skills ? isDevFallback(skills) : false;

  return (
    <div className="space-y-6">
      <DevBanner />

      <PageHeader
        eyebrow={
          <Badge tone="primary" size="sm">
            <Radar className="mr-1 h-3 w-3" /> Skill Map
          </Badge>
        }
        title="Your skill map"
        subtitle={
          <>
            Skill level measures your capability in each domain. Scenario difficulty is the
            challenge level of a mission — the two are tracked separately.
          </>
        }
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/scenarios')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Browse scenarios
          </Button>
        }
      />

      {error && (
        <ErrorState
          title="Skills unavailable"
          message={error.message}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && (!skills || skills.length === 0) && (
        <EmptyState
          title="No skills mapped yet"
          description="Your skill profile appears here once the assessment engine records your first results."
          action={
            <Button onClick={() => navigate('/scenarios')} leftIcon={<Compass className="h-4 w-4" />}>
              Start a scenario
            </Button>
          }
        />
      )}

      {skills && skills.length > 0 && (
        <>
          {isPreview && (
            <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => {
              const meta = skillMetaByKey(skill.skill_id);
              const status = statusMeta[skill.status] ?? statusMeta.not_started;
              return (
                <Card key={skill.skill_id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label-hud text-primary-text">{meta.code} · {meta.short}</p>
                      <h3 className="mt-1 font-display text-base font-semibold text-ink-high">
                        {skill.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge tone={skillTone(skill.level)} size="sm">{skill.level}</Badge>
                      <Badge tone={status.tone} size="sm" dot>{status.label}</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="label-hud">Capability progress</span>
                      <span className="text-xs font-semibold tabular-nums text-primary-text">
                        {skill.progress}%
                      </span>
                    </div>
                    <ProgressBar value={skill.progress} size="sm" tone="primary" />
                  </div>

                  <div className={cn('mt-4 flex items-center justify-between gap-2 rounded-lg border border-gl-border bg-white/[0.02] px-3 py-2.5 text-xs')}>
                    <span className="inline-flex items-center gap-1.5 text-ink-mid">
                      <Layers className="h-3.5 w-3.5" aria-hidden />
                      Scenarios
                    </span>
                    <span className="font-medium tabular-nums text-ink-high">
                      {skill.completed_scenarios}/{skill.total_scenarios} complete
                    </span>
                  </div>

                  <div className="mt-3 min-h-[2.5rem]">
                    <p className="text-xs leading-relaxed text-ink-mid">
                      <span className="font-medium text-ink-high">Next: </span>
                      {skill.next_action ?? 'Complete the next available scenario for this skill.'}
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/scenarios?skill=${skill.skill_id}`)}
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      View scenarios
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillsPage;