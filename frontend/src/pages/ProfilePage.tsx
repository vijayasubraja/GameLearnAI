import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, ArrowRight, Flame, Gauge, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { profileService } from '../services/profileService';
import { isDevFallback } from '../services/fallback/devData';
import type { DashboardPayload } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { DevBanner } from '../components/DevBanner';
import { formatDate, skillTone } from '../lib/format';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: dashboard, loading, error, refetch } = useApi<DashboardPayload>(() => profileService.getDashboard());

  const displayName = user?.full_name || user?.username || 'Learner';
  const initials = displayName.slice(0, 2).toUpperCase();
  const isPreview = dashboard ? isDevFallback(dashboard) : false;

  return (
    <div className="space-y-6">
      <DevBanner />

      <PageHeader
        eyebrow={
          <Badge tone="primary" size="sm">
            <UserIcon className="mr-1 h-3 w-3" /> Learner Profile
          </Badge>
        }
        title="Your account"
        subtitle="Account details and a snapshot of your learning performance."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity */}
        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-subtle font-display text-2xl font-bold text-primary-text">
            {initials}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink-high">{displayName}</h2>
            <p className="label-hud mt-1">@{user?.username ?? '—'}</p>
          </div>
          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-ink-mid">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              <span className="truncate">{user?.email ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-mid">
              <AtSign className="h-3.5 w-3.5" aria-hidden />
              <span>Joined {formatDate(user?.created_at)}</span>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col gap-2">
            <Button variant="secondary" className="w-full" onClick={() => navigate('/skills')} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Open skill map
            </Button>
            <Button variant="ghost" className="w-full" onClick={logout}>
              Sign out
            </Button>
          </div>
        </Card>

        {/* Performance snapshot */}
        <div className="space-y-6 lg:col-span-2">
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-56 w-full" />
            </div>
          )}

          {error && dashboard === null && (
            <ErrorState title="Profile data unavailable" message={error.message} onRetry={refetch} />
          )}

          {dashboard && !error && (
            <>
              {isPreview && (
                <Badge tone="warning" size="sm">Showing marked development preview data</Badge>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Overall skill level"
                  value={
                    <span className="inline-flex items-center gap-2">
                      {dashboard.overall_level}
                      <Gauge className="h-5 w-5 text-primary-text" />
                    </span>
                  }
                  sublabel="Learner capability"
                  tone="primary"
                />
                <StatCard
                  label="Learning streak"
                  value={`${dashboard.learning_streak_days}d`}
                  sublabel="Consecutive active days"
                  icon={<Flame className="h-4 w-4" />}
                  tone="warning"
                />
                <StatCard
                  label="Skills tracked"
                  value={dashboard.skill_progress.length}
                  sublabel="across real-life domains"
                  icon={<ShieldCheck className="h-4 w-4" />}
                  tone="success"
                />
              </div>

              <Card>
                <h2 className="label-hud">Skill snapshots</h2>
                <div className="mt-4 space-y-4">
                  {dashboard.skill_progress.map((skill) => (
                    <div key={skill.skill_id}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/scenarios?skill=${skill.skill_id}`)}
                          className="truncate text-xs font-medium text-ink-high transition-colors hover:text-primary-text"
                        >
                          {skill.name}
                        </button>
                        <Badge tone={skillTone(skill.level)} size="sm">{skill.level}</Badge>
                      </div>
                      <ProgressBar value={skill.progress} size="sm" tone="primary" />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;