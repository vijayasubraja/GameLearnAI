import { useSyncExternalStore } from 'react';
import type {
  PerformanceResult,
  Scenario,
  SimulationEventPayload,
  SimulationStartResponse,
} from '../../types/domain';

export type SimStatus = 'idle' | 'active' | 'paused' | 'submitting' | 'completed' | 'failed';
export type SafetyStatus = 'ok' | 'warning' | 'danger';
export type NotificationTone = 'info' | 'success' | 'warning' | 'danger';

export interface HUDNotification {
  id: string;
  tone: NotificationTone;
  message: string;
  at: number;
}

export interface SimulationSession {
  scenario: Scenario | null;
  attempt: SimulationStartResponse | null;
  startedAt: number | null;
  status: SimStatus;
  events: SimulationEventPayload[];
  eventSeq: number;
  result: PerformanceResult | null;
  safetyStatus: SafetyStatus;
  notifications: HUDNotification[];
  elapsedSeconds: number;
}

const STORAGE_KEY = 'gamelearn_sim_session';

const INITIAL: SimulationSession = {
  scenario: null,
  attempt: null,
  startedAt: null,
  status: 'idle',
  events: [],
  eventSeq: 0,
  result: null,
  safetyStatus: 'ok',
  notifications: [],
  elapsedSeconds: 0,
};

function restoreState(): SimulationSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as SimulationSession;
    // A stale active/paused session from a previous page load must not resume silently.
    const status: SimStatus =
      parsed.status === 'completed' || parsed.status === 'failed' ? parsed.status : 'idle';
    return {
      ...INITIAL,
      ...parsed,
      status,
      elapsedSeconds: parsed.startedAt ? Math.floor((Date.now() - parsed.startedAt) / 1000) : 0,
    };
  } catch {
    return INITIAL;
  }
}

let state: SimulationSession = restoreState();
const listeners = new Set<() => void>();

function persist(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* sessionStorage may be unavailable (private mode) — keep in-memory state */
  }
}

function setState(patch: Partial<SimulationSession>): void {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

function pushNotification(tone: NotificationTone, message: string): void {
  const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const notification: HUDNotification = { id, tone, message, at: Date.now() };
  setState({ notifications: [...state.notifications.slice(-4), notification] });
}

export function dismissNotification(id: string): void {
  setState({ notifications: state.notifications.filter((n) => n.id !== id) });
}

export function beginSession(scenario: Scenario, attempt: SimulationStartResponse): void {
  const startedAt = Date.now();
  setState({
    scenario,
    attempt,
    startedAt,
    status: 'active',
    events: [],
    eventSeq: 0,
    result: null,
    safetyStatus: 'ok',
    notifications: [],
    elapsedSeconds: 0,
  });
}

export function recordEvent(
  eventType: string,
  isSafe: boolean,
  payload?: Record<string, unknown>
): void {
  if (!state.attempt || (state.status !== 'active' && state.status !== 'paused')) return;
  const seq = state.eventSeq + 1;
  const timestamp_ms = state.startedAt ? Math.max(0, Date.now() - state.startedAt) : 0;
  const event: SimulationEventPayload = {
    attempt_id: state.attempt.attempt_id,
    event_type: eventType,
    timestamp_offset: Math.floor(timestamp_ms / 1000),
    is_safe: isSafe,
    payload,
  };
  setState({ events: [...state.events, event], eventSeq: seq });
}

export function setSimStatus(status: SimStatus): void {
  setState({ status });
}

export function setSafetyStatus(status: SafetyStatus): void {
  setState({ safetyStatus: status });
}

export function setSessionResult(result: PerformanceResult): void {
  setState({ result, status: result.completion_status === 'completed' ? 'completed' : 'failed' });
}

export function setElapsedSeconds(elapsedSeconds: number): void {
  if (Math.abs(elapsedSeconds - state.elapsedSeconds) < 1) return;
  setState({ elapsedSeconds });
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
  setState({ ...INITIAL });
}

export function resetEvents(): void {
  setState({
    events: [],
    eventSeq: 0,
    notifications: [],
    safetyStatus: 'ok',
    result: null,
    elapsedSeconds: 0,
  });
}

export function notify(tone: NotificationTone, message: string): void {
  pushNotification(tone, message);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SimulationSession {
  return state;
}

export function useSimulationSession(): SimulationSession {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function getSimulationSessionSnapshot(): SimulationSession {
  return state;
}