import React from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  LogOut,
  Timer,
  Shield,
  AlertTriangle,
  Target,
  CheckCircle2,
} from 'lucide-react';
import type { Scenario } from '../../types/domain';
import type { SafetyStatus, SimStatus } from '../../features/simulation/sessionStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { difficultyTone, formatDuration } from '../../lib/format';
import { skillMetaByKey } from '../../features/skills/skillCatalog';
import { cn } from '../../lib/cn';

interface SimulationHUDProps {
  scenario: Scenario;
  elapsedSeconds: number;
  safetyStatus: SafetyStatus;
  progress: number;
  status: SimStatus;
  isRoadMission: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

const safetyTone: Record<SafetyStatus, 'success' | 'warning' | 'danger'> = {
  ok: 'success',
  warning: 'warning',
  danger: 'danger',
};

const safetyLabel: Record<SafetyStatus, string> = {
  ok: 'SAFE',
  warning: 'CAUTION',
  danger: 'HAZARD',
};

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const SimulationHUD: React.FC<SimulationHUDProps> = ({
  scenario,
  elapsedSeconds,
  safetyStatus,
  progress,
  status,
  isRoadMission,
  onPause,
  onResume,
  onRestart,
  onExit,
}) => {
  const paused = status === 'paused';
  const skill = skillMetaByKey(scenario.skill_category);

  return (
    <>
      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gl-border bg-gl-bg/85 px-3 py-2 backdrop-blur">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="label-hud text-primary-text">{skill.code}</span>
              <span className="truncate font-display text-sm font-semibold text-ink-high">
                {scenario.title}
              </span>
              <Badge tone={difficultyTone(scenario.difficulty_level)} size="sm" className="hidden sm:inline-flex">
                {scenario.difficulty_level}
              </Badge>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {isRoadMission && (
                <Badge tone={safetyTone[safetyStatus]} size="sm" dot className="hidden xs:inline-flex">
                  <Shield className="mr-0.5 h-3 w-3" /> {safetyLabel[safetyStatus]}
                </Badge>
              )}
              <Badge tone="neutral" size="sm" className="tabular-nums">
                <Timer className="mr-0.5 h-3 w-3" /> {formatClock(elapsedSeconds)}
              </Badge>
              <span className="pointer-events-auto">
                {paused ? (
                  <Button size="icon" variant="secondary" onClick={onResume} aria-label="Resume simulation">
                    <Play className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="icon" variant="secondary" onClick={onPause} aria-label="Pause simulation">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
              </span>
              <span className="pointer-events-auto">
                <Button size="icon" variant="secondary" onClick={onRestart} aria-label="Restart simulation">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </span>
              <span className="pointer-events-auto">
                <Button size="icon" variant="ghost" onClick={onExit} aria-label="Exit simulation">
                  <LogOut className="h-4 w-4" />
                </Button>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gl-border bg-gl-bg/80 px-3 py-1.5 backdrop-blur">
            <Target className="h-3.5 w-3.5 shrink-0 text-primary-text" aria-hidden />
            <p className="min-w-0 truncate text-xs text-ink-mid">{scenario.objective}</p>
            <span className="ml-auto label-hud shrink-0">{formatDuration(scenario.estimated_duration_minutes)}</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-2">
          {isRoadMission && (
            <div className="flex items-center gap-2 rounded-xl border border-gl-border bg-gl-bg/80 px-3 py-1.5 backdrop-blur">
              <span className="label-hud shrink-0">Objective progress</span>
              <ProgressBar value={progress} max={100} size="sm" tone={progress >= 100 ? 'success' : 'primary'} className="flex-1" />
              <span className="shrink-0 text-xs font-semibold tabular-nums text-primary-text">{progress}%</span>
            </div>
          )}

          <div
            className={cn(
              'flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-gl-border bg-gl-bg/85 px-3 py-2 text-[11px] text-ink-low backdrop-blur'
            )}
          >
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-gl-border bg-gl-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-mid">WASD</kbd>
              Move
            </span>
            {isRoadMission && (
              <>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-gl-border bg-gl-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-mid">L / R</kbd>
                  Look left / right
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-gl-border bg-gl-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-mid">E</kbd>
                  Press crossing signal
                </span>
              </>
            )}
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-gl-border bg-gl-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-mid">E</kbd>
              Interact
            </span>
            {safetyStatus === 'danger' && (
              <span className="ml-auto flex items-center gap-1 text-danger-text">
                <AlertTriangle className="h-3 w-3" /> Hazard — wait for a safe gap
              </span>
            )}
            {safetyStatus === 'ok' && (
              <span className="ml-auto flex items-center gap-1 text-success-text">
                <CheckCircle2 className="h-3 w-3" /> Live telemetry: ON
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimulationHUD;