import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  AlertCircle,
  Clock,
  Target,
  Shield,
  ShieldAlert,
  Keyboard,
  ListChecks,
  Info,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { scenarioService } from '../services/scenarioService';
import { simulationService } from '../services/simulationService';
import { normalizeApiError } from '../lib/api';
import { beginSession } from '../features/simulation/sessionStore';
import { isDevFallback } from '../services/fallback/devData';
import type { Scenario } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { DevBanner } from '../components/DevBanner';
import { difficultyTone, formatDuration } from '../lib/format';
import { skillMetaByKey } from '../features/skills/skillCatalog';

interface StartError {
  title: string;
  message: string;
}

export const ScenarioBriefingPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();

  const {
    data: scenario,
    loading,
    error,
    refetch,
  } = useApi<Scenario>(() => scenarioService.getScenario(scenarioId ?? ''), {
    immediate: true,
  });

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<StartError | null>(null);

  const handleStart = async () => {
    if (!scenario) return;
    // Do not claim the simulation started until the backend confirms the session.
    setStarting(true);
    setStartError(null);
    try {
      const startResponse = await simulationService.start(scenario.id);
      beginSession(scenario, startResponse);
      navigate(`/simulation/${scenario.id}`, { replace: true });
    } catch (err) {
      const apiErr = normalizeApiError(err);
      const title =
        apiErr.code === 'unauthorized'
          ? 'Your session expired'
          : apiErr.code === 'not_found'
            ? 'Scenario unavailable'
            : apiErr.code === 'timeout'
              ? 'The request timed out'
              : apiErr.code === 'validation'
                ? 'Scenario configuration rejected'
                : 'Could not start the simulation';
      setStartError({
        title,
        message: apiErr.message,
      });
    } finally {
      setStarting(false);
    }
  };

  const isPreview = scenario ? isDevFallback(scenario) : false;

  return (
    <div className="space-y-6">
      <DevBanner />

      <Link
        to="/scenarios"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-mid transition-colors hover:text-ink-high"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to mission library
      </Link>

      {error && (
        <ErrorState
          title="Briefing unavailable"
          message={error.message}
          onRetry={refetch}
          className="mx-auto max-w-2xl"
        />
      )}

      {loading && (
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse-soft rounded-md bg-white/[0.06]" />
          <div className="h-40 w-full animate-pulse-soft rounded-xl bg-white/[0.06]" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-40 w-full animate-pulse-soft rounded-xl bg-white/[0.06]" />
            <div className="h-40 w-full animate-pulse-soft rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      )}

      {scenario && !error && (
        <>
          {isPreview && (
            <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
          )}

          <PageHeader
            eyebrow={
              <div className="flex items-center gap-2">
                <Badge tone="primary" size="sm">
                  {skillMetaByKey(scenario.skill_category).code} · {skillMetaByKey(scenario.skill_category).short}
                </Badge>
                <Badge tone={difficultyTone(scenario.difficulty_level)} size="sm">
                  {scenario.difficulty_level}
                </Badge>
                {scenario.is_recommended && (
                  <Badge tone="primary" size="sm">Recommended</Badge>
                )}
              </div>
            }
            title={scenario.title}
            subtitle={scenario.description}
            actions={
              <Button
                size="lg"
                onClick={handleStart}
                isLoading={starting}
                leftIcon={<Play className="h-4 w-4" />}
                disabled={!scenario.environment_config}
              >
                {starting ? 'Starting simulation…' : 'Start simulation'}
              </Button>
            }
          />

          {startError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-subtle px-4 py-3 text-xs leading-relaxed"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
              <div>
                <p className="font-medium text-danger-text">{startError.title}</p>
                <p className="mt-0.5 text-ink-mid">{startError.message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {/* Objective */}
              <Card>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary-text" aria-hidden />
                  <h2 className="label-hud">Mission objective</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-high">{scenario.objective}</p>
              </Card>

              {/* Real-world context */}
              <Card>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary-text" aria-hidden />
                  <h2 className="label-hud">Real-world context</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-mid">{scenario.real_world_context}</p>
              </Card>

              {/* Skills tested */}
              <Card>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary-text" aria-hidden />
                  <h2 className="label-hud">Skills being tested</h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {scenario.skills_tested.map((skill) => (
                    <li key={skill} className="flex items-center gap-2.5 text-sm text-ink-high">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {skill}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Meta */}
              <Card className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-mid">
                    <Clock className="h-4 w-4" aria-hidden />
                    Estimated time
                  </span>
                  <span className="font-medium tabular-nums text-ink-high">
                    {formatDuration(scenario.estimated_duration_minutes)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-mid">
                    <ListChecks className="h-4 w-4" aria-hidden />
                    Skills covered
                  </span>
                  <span className="font-medium tabular-nums text-ink-high">
                    {scenario.skills_tested.length}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-mid">
                    <Shield className="h-4 w-4" aria-hidden />
                    Difficulty
                  </span>
                  <Badge tone={difficultyTone(scenario.difficulty_level)} size="sm">
                    {scenario.difficulty_level}
                  </Badge>
                </div>
              </Card>

              {/* Controls */}
              <Card>
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-primary-text" aria-hidden />
                  <h2 className="label-hud">Simulator controls</h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {scenario.controls.map((control) => (
                    <li key={control} className="text-xs leading-relaxed text-ink-mid">
                      {control}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Success / failure */}
              <Card tone="success">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success-text" aria-hidden />
                  <h2 className="label-hud text-success-text">Success conditions</h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {scenario.success_conditions.map((cond) => (
                    <li key={cond} className="flex items-start gap-2.5 text-xs text-ink-high">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" aria-hidden />
                      {cond}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card tone="danger">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-danger-text" aria-hidden />
                  <h2 className="label-hud text-danger-text">Failure conditions</h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {scenario.failure_conditions.map((cond) => (
                    <li key={cond} className="flex items-start gap-2.5 text-xs text-ink-high">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-danger" aria-hidden />
                      {cond}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioBriefingPage;