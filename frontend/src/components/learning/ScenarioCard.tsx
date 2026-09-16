import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Lock, Play, CalendarCheck, Star, Target } from 'lucide-react';
import type { Scenario } from '../../types/domain';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDuration } from '../../lib/format';
import { difficultyTone } from '../../lib/format';
import { skillMetaByKey } from '../../features/skills/skillCatalog';
import { cn } from '../../lib/cn';

interface ScenarioCardProps {
  scenario: Scenario;
  recommended?: boolean;
  className?: string;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, recommended = false, className }) => {
  const navigate = useNavigate();
  const skill = skillMetaByKey(scenario.skill_category);
  const locked = scenario.availability === 'locked';
  const completed = scenario.availability === 'completed';

  return (
    <Card
      interactive={!locked}
      className={cn('flex flex-col', !locked && 'cursor-pointer', recommended && 'border-primary/40', className)}
      onClick={!locked ? () => navigate(`/scenarios/${scenario.id}`) : undefined}
      tone={recommended ? 'primary' : 'default'}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="label-hud text-xs text-primary-text">
          {skill.code} · {skill.short}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge tone={difficultyTone(scenario.difficulty_level)} size="sm">
            {scenario.difficulty_level}
          </Badge>
          {completed && (
            <Badge tone="success" size="sm">
              <CalendarCheck className="mr-0.5 h-3 w-3" /> Completed
            </Badge>
          )}
          {locked && (
            <Badge tone="neutral" size="sm">
              <Lock className="mr-0.5 h-3 w-3" /> Locked
            </Badge>
          )}
        </div>
      </div>

      <h3 className="mt-3 font-display text-base font-semibold text-ink-high">{scenario.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-mid">{scenario.description}</p>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-2 text-xs text-ink-low">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(scenario.estimated_duration_minutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            {scenario.skills_tested.length} skills
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant={completed ? 'secondary' : 'primary'}
            className="flex-1"
            leftIcon={locked ? <Lock className="h-3.5 w-3.5" /> : completed ? <CalendarCheck className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            disabled={locked}
            onClick={(e) => {
              e.stopPropagation();
              if (!locked) navigate(`/scenarios/${scenario.id}`);
            }}
          >
            {locked ? 'Locked' : completed ? 'View brief' : 'Start mission'}
          </Button>
          {recommended && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary-subtle px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-text">
              <Star className="h-3 w-3" /> Recommended
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};