import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, LogOut, Pause } from 'lucide-react';
import { useSimulationSession, beginSession, clearSession, recordEvent, resetEvents, setSessionResult, setSimStatus, setElapsedSeconds, setSafetyStatus, getSimulationSessionSnapshot, notify, type SafetyStatus } from '../features/simulation/sessionStore';
import { scenarioService } from '../services/scenarioService';
import { simulationService } from '../services/simulationService';
import { performanceService } from '../services/performanceService';
import { devResultFor, isDevFallback } from '../services/fallback/devData';
import { normalizeApiError, type ApiError } from '../lib/api';
import type { Scenario } from '../types/domain';
import { RoadCrossingSimulator } from '../components/simulation/RoadCrossingSimulator';
import { MissionPlazaSimulator } from '../components/simulation/MissionPlazaSimulator';
import { SimulationHUD } from '../components/simulation/SimulationHUD';
import { SimulationNotifications } from '../components/simulation/SimulationNotifications';
import { ROAD_EVENT, type SimulatorSceneProps } from '../components/simulation/simTypes';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';

const DANGER_LIMIT = 3;
const INITIAL_PROGRESS_STEPS = { looked: 20, signal: 15, entered: 30, reached: 35 };

interface FlowError {
  title: string;
  message: string;
}

export const SimulationPlayPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const session = useSimulationSession();

  const [scenario, setScenario] = useState<Scenario | null>(
    session.scenario?.id === scenarioId ? session.scenario : null
  );
  const [scenarioLoading, setScenarioLoading] = useState(!scenario);
  const [scenarioError, setScenarioError] = useState<ApiError | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<FlowError | null>(null);

  const [resetKey, setResetKey] = useState(0);
  const [paused, setPaused] = useState(session.status === 'paused');
  const [elapsed, setElapsed] = useState(session.elapsedSeconds);
  const [progress, setProgress] = useState(0);
  const [submitError, setSubmitError] = useState<FlowError | null>(null);
  const [exitConfirm, setExitConfirm] = useState(false);

  const accumRef = useRef(0);
  const runningRef = useRef(!paused);
  const finishLockRef = useRef(false);
  const bootedRef = useRef(false);
  const progressRef = useRef(0);
  const dangerCountRef = useRef(0);
  const lookedRef = useRef(0);
  const signalUsedRef = useRef(false);
  const crossedRef = useRef(false);

  const bumpProgress = useCallback((add: number) => {
    progressRef.current = Math.min(100, progressRef.current + add);
    setProgress(progressRef.current);
  }, []);

  /* Boot: ensure a started simulation session exists for this scenario */
  useEffect(() => {
    if (bootedRef.current || !scenarioId) return;
    bootedRef.current = true;

    let cancelled = false;
    const boot = async () => {
      let sc: Scenario | null = getSimulationSessionSnapshot().scenario;
      if (!sc || sc.id !== scenarioId) {
        try {
          sc = await scenarioService.getScenario(scenarioId);
        } catch (err) {
          if (!cancelled) {
            setScenarioError(normalizeApiError(err));
            setScenarioLoading(false);
          }
          return;
        }
        if (cancelled) return;
        setScenario(sc);
        setScenarioLoading(false);
      } else {
        setScenario(sc);
        setScenarioLoading(false);
      }

      const existing = getSimulationSessionSnapshot();
      if (existing.attempt && existing.attempt.scenario_id === sc.id && existing.status !== 'idle') {
        // Session already started (via briefing or a previous direct entry).
        setPaused(existing.status === 'paused');
        return;
      }

      // Fresh session — the start API must confirm before we render the scene.
      setStarting(true);
      try {
        const startResponse = await simulationService.start(sc.id);
        if (cancelled) return;
        beginSession(sc, startResponse);
        accumRef.current = 0;
        setElapsed(0);
        setPaused(false);
        runningRef.current = true;
      } catch (err) {
        const apiErr = normalizeApiError(err);
        if (!cancelled) {
          setStartError({
            title:
              apiErr.code === 'unauthorized'
                ? 'Your session expired'
                : apiErr.code === 'not_found'
                  ? 'Scenario unavailable'
                  : apiErr.code === 'timeout'
                    ? 'The request timed out'
                    : 'Simulation could not start',
            message: apiErr.message,
          });
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  /* Timer — frozen while paused or submitting */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (runningRef.current && !finishLockRef.current) {
        accumRef.current += (now - last) / 1000;
        const value = Math.floor(accumRef.current);
        setElapsed((prev) => (prev === value ? prev : value));
      }
      last = now;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    setElapsedSeconds(elapsed);
  }, [elapsed]);

  const handlePause = () => {
    if (finishLockRef.current) return;
    runningRef.current = false;
    setPaused(true);
    setSimStatus('paused');
  };

  const handleResume = () => {
    if (startError || submitError) return;
    runningRef.current = true;
    setPaused(false);
    setSimStatus('active');
  };

  const handleRestart = () => {
    resetEvents();
    accumRef.current = 0;
    setElapsed(0);
    progressRef.current = 0;
    setProgress(0);
    dangerCountRef.current = 0;
    lookedRef.current = 0;
    signalUsedRef.current = false;
    crossedRef.current = false;
    finishLockRef.current = false;
    setSubmitError(null);
    setStartError(null);
    setSimStatus('active');
    runningRef.current = true;
    setPaused(false);
    setResetKey((k) => k + 1);
  };

  const handleExit = () => {
    setExitConfirm(true);
  };

  const confirmExit = () => {
    const id = scenario?.id ?? scenarioId;
    clearSession();
    navigate(id ? `/scenarios/${id}` : '/scenarios');
  };

  const handleSafety = (level: SafetyStatus) => {
    // Deduplicated by the store; used as-is.
    setSafetyStatus(level);
  };

  const handleThenFailCheck = (outcome: 'completed' | 'failed') => {
    void finishAttempt(outcome);
  };

  const finishAttempt = async (outcome: 'completed' | 'failed') => {
    const snap = getSimulationSessionSnapshot();
    if (!snap.attempt || !snap.scenario) return;
    if (finishLockRef.current) return;
    finishLockRef.current = true;
    runningRef.current = false;
    setSimStatus('submitting');

    try {
      const completeRes = await simulationService.complete(snap.attempt.attempt_id, outcome);
      if (isDevFallback(completeRes)) {
        const result = devResultFor(snap.attempt.attempt_id, snap.scenario, outcome, snap.events);
        setSessionResult(result);
        navigate(`/results/${snap.attempt.attempt_id}`, { replace: true });
        return;
      }
      // Real backend confirmed the completion — fetch official scores.
      try {
        const result = await performanceService.getResult(snap.attempt.attempt_id);
        setSessionResult(result);
        navigate(`/results/${snap.attempt.attempt_id}`, { replace: true });
      } catch (err) {
        setSubmitError({
          title: 'Result retrieval failed',
          message: `${normalizeApiError(err).message} Your attempt was recorded on the backend.`,
        });
        setSimStatus(outcome === 'completed' ? 'completed' : 'failed');
        finishLockRef.current = false;
      }
    } catch (err) {
      const apiErr = normalizeApiError(err);
      setSubmitError({
        title: apiErr.code === 'network' || apiErr.code === 'timeout' ? 'Could not submit your results' : 'Simulation could not be completed',
        message: apiErr.message,
      });
      setSimStatus(paused ? 'paused' : 'active');
      finishLockRef.current = false;
    }
  };

  const handleTelemetry: SimulatorSceneProps['onTelemetry'] = useCallback((ev) => {
    recordEvent(ev.event_type, ev.is_safe, ev.payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSceneEvent: SimulatorSceneProps['onTelemetry'] = (ev) => {
    handleTelemetry(ev);
    switch (ev.event_type) {
      case ROAD_EVENT.LOOK_ACTION:
        lookedRef.current += 1;
        bumpProgress(INITIAL_PROGRESS_STEPS.looked * (lookedRef.current >= 2 ? 0.5 : 0.25));
        break;
      case ROAD_EVENT.SIGNAL_INTERACTION:
        signalUsedRef.current = true;
        bumpProgress(INITIAL_PROGRESS_STEPS.signal);
        notify('info', 'Pedestrian signal activated — cross during the walk phase.');
        break;
      case ROAD_EVENT.ROAD_ENTRY:
        crossedRef.current = true;
        if (ev.is_safe) {
          bumpProgress(INITIAL_PROGRESS_STEPS.entered);
          notify('success', 'You entered the road in a safe window. Keep scanning traffic.');
        } else {
          dangerCountRef.current += 1;
          notify('danger', 'Unsafe road entry — signal red or a vehicle is too close.');
        }
        break;
      case ROAD_EVENT.DANGER_PROXIMITY:
        dangerCountRef.current += 1;
        notify('danger', `Close call with an approaching vehicle (${dangerCountRef.current}/${DANGER_LIMIT}).`);
        if (dangerCountRef.current >= DANGER_LIMIT) {
          notify('danger', 'Too many hazardous events — mission failed.');
          handleThenFailCheck('failed');
        }
        break;
      case ROAD_EVENT.OBJECTIVE_REACHED:
        notify('success', 'Destination reached.');
        bumpProgress(INITIAL_PROGRESS_STEPS.reached);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const isRoad = scenario?.skill_category === 'road_safety';
  const sceneProps: SimulatorSceneProps = {
    scenario: scenario!,
    paused,
    resetKey,
    onTelemetry: onSceneEvent,
    onSafety: handleSafety,
    onReachedGoal: () => handleThenFailCheck('completed'),
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gl-bg">
      {scenario && !startError && !scenarioError && (
        <div className="absolute inset-0">
          {isRoad ? (
            <RoadCrossingSimulator {...sceneProps} />
          ) : (
            <MissionPlazaSimulator {...sceneProps} />
          )}
        </div>
      )}

      {scenario && !startError && !scenarioError && (
        <>
          <SimulationHUD
            scenario={scenario}
            elapsedSeconds={elapsed}
            safetyStatus={session.safetyStatus}
            progress={progress}
            status={session.status}
            isRoadMission={isRoad}
            onPause={handlePause}
            onResume={handleResume}
            onRestart={handleRestart}
            onExit={handleExit}
          />
          <SimulationNotifications />
        </>
      )}

      {/* Loading the briefing */}
      {scenarioLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg">
          <LoadingState label="Loading mission…" />
        </div>
      )}

      {/* Starting the simulation session */}
      {starting && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg/95 backdrop-blur">
          <LoadingState label="Starting simulation…" />
        </div>
      )}

      {/* Fatal scenario load error */}
      {scenarioError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg px-4">
          <div className="w-full max-w-md space-y-4">
            <h2 className="font-display text-xl font-semibold text-ink-high">Mission unavailable</h2>
            <p className="text-sm text-ink-mid">{scenarioError.message}</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/scenarios')}>Back to scenario library</Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation start failure */}
      {startError && !scenarioError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg/95 px-4 backdrop-blur">
          <div
            role="alert"
            className="w-full max-w-md rounded-xl border border-danger/30 bg-danger-subtle p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
              <div>
                <h2 className="font-display text-sm font-semibold text-danger-text">{startError.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-mid">{startError.message}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit failure */}
      {submitError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg/95 px-4 backdrop-blur">
          <div
            role="alert"
            className="w-full max-w-md rounded-xl border border-danger/30 bg-danger-subtle p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
              <div>
                <h2 className="font-display text-sm font-semibold text-danger-text">{submitError.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-mid">{submitError.message}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleRestart}>Try again</Button>
              <Button variant="ghost" onClick={confirmExit}>Exit to briefing</Button>
              <Button variant="outline" onClick={() => void finishAttempt(session.status === 'paused' || session.status === 'active' ? 'completed' : 'failed')}>
                Retry submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {paused && !submitError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gl-bg/90 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-5 rounded-2xl border border-gl-border bg-gl-surface p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary-text">
              <Pause className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-high">Simulation paused</h2>
              <p className="mt-1 text-xs text-ink-mid">Telemetry collection is on hold. Resume to continue the mission.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleResume}>Resume</Button>
              <Button variant="secondary" onClick={handleRestart}>Restart mission</Button>
              <Button variant="ghost" onClick={handleExit}>Exit to briefing</Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit confirm */}
      {exitConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-5 rounded-2xl border border-gl-border bg-gl-surface p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle text-warning-text">
              <LogOut className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-high">Exit this mission?</h2>
              <p className="mt-1 text-xs text-ink-mid">
                Progress on this attempt will be lost. You can start a fresh attempt from the briefing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={() => setExitConfirm(false)}>Stay in mission</Button>
              <Button onClick={confirmExit}>Exit to briefing</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPlayPage;