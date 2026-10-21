import React, { useState } from 'react';
import { Edit3, Check, DollarSign, Calendar, MapPin, Sparkles, HeartHandshake, User } from 'lucide-react';
import { FullEventPlan, PlanHealthMetrics, SensitivityAnalysis, EventType } from '../../types';
import { EVENT_TYPE_METADATA } from '../../constants/presets';
import { CountdownTimer } from './CountdownTimer';
import { HealthScoreGauge } from './HealthScoreGauge';
import { GuestSensitivityCard } from './GuestSensitivityCard';
import { formatCurrency } from '../../services/calculationService';

interface OverviewTabProps {
  plan: FullEventPlan;
  healthMetrics: PlanHealthMetrics;
  sensitivity: SensitivityAnalysis;
  onUpdateDetails: (updated: Partial<FullEventPlan['details']>) => void;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  plan,
  healthMetrics,
  sensitivity,
  onUpdateDetails,
  onNavigateToTab
}) => {
  const { details } = plan;
  const meta = EVENT_TYPE_METADATA[details.type];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: details.title,
    hostNames: details.hostNames,
    date: details.date,
    time: details.time,
    city: details.city,
    venueName: details.venueName,
    vibe: details.vibe,
    totalBudget: details.totalBudget
  });

  const handleSave = () => {
    onUpdateDetails(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Event Countdown Banner */}
      <CountdownTimer
        eventDate={details.date}
        eventTime={details.time}
        city={details.city}
        venueName={details.venueName}
      />

      {/* Main Details Card (Editable) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {meta.badge}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {meta.tagline}
              </span>
            </div>
            {!isEditing ? (
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-2">
                {details.title}
              </h1>
            ) : null}
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className={`self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
            }`}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Details'}</span>
          </button>
        </div>

        {/* Content View / Form */}
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Host / Honoree Names</label>
              <input
                type="text"
                value={formData.hostNames}
                onChange={(e) => setFormData({ ...formData, hostNames: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Event Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">City & Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Venue Name</label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Total Budget ($)</label>
              <input
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Theme / Vibe</label>
              <select
                value={formData.vibe}
                onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              >
                {meta.vibes.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-start gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-xl">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">Hosts</span>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  {details.hostNames || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">Total Budget</span>
                <p className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  {formatCurrency(details.totalBudget)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">Venue & City</span>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5 truncate">
                  {details.venueName}, {details.city}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">Aesthetic Vibe</span>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5 truncate" title={details.vibe}>
                  {details.vibe}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Two-Column Grid: Health Score & Guest Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <HealthScoreGauge
          metrics={healthMetrics}
          onNavigateToTab={onNavigateToTab}
        />
        <GuestSensitivityCard
          guestCount={details.guestCount}
          totalBudget={details.totalBudget}
          onGuestCountChange={(count) => onUpdateDetails({ guestCount: count })}
          sensitivity={sensitivity}
        />
      </div>

    </div>
  );
};
