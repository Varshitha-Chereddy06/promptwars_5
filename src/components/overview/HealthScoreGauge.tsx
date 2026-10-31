import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { PlanHealthMetrics } from '../../types';

interface HealthScoreGaugeProps {
  metrics: PlanHealthMetrics;
  onNavigateToTab?: (tab: string) => void;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ metrics, onNavigateToTab }) => {
  const { score, rating, budgetHealthScore, timelineHealthScore, vendorHealthScore, rsvpHealthScore, issues, recommendations } = metrics;

  // SVG circular progress calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
    if (s >= 60) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
    return { stroke: '#e11d48', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="planner-card bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Plan Health Score
            </h3>
            <p className="text-xs text-stone-500">Real-time algorithmic readiness assessment</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xl ${colors.badge}`}>
          {rating}
        </span>
      </div>

      {/* Main Gauge & Sub-metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* SVG Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-stone-100 dark:stroke-stone-800"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={colors.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-3xl font-extrabold ${colors.text}`}>
                {score}
              </span>
              <span className="text-[10px] font-semibold uppercase text-stone-400">
                Out of 100
              </span>
            </div>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Budget Health */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300">Budget Discipline</span>
              <span className="font-mono text-stone-500">{budgetHealthScore} / 30 pts</span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(budgetHealthScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Timeline Health */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300">Milestone Pace</span>
              <span className="font-mono text-stone-500">{timelineHealthScore} / 30 pts</span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(timelineHealthScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Vendor Coverage */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300">Vendor Hiring</span>
              <span className="font-mono text-stone-500">{vendorHealthScore} / 20 pts</span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(vendorHealthScore / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* RSVP Health */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300">Guest RSVPs</span>
              <span className="font-mono text-stone-500">{rsvpHealthScore} / 20 pts</span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(rsvpHealthScore / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-100 dark:border-stone-800">
        
        {/* Issues */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Attention Items ({issues.length})</span>
          </p>
          {issues.length === 0 ? (
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>No critical bottlenecks detected! Plan is in great shape.</span>
            </p>
          ) : (
            <ul className="space-y-1.5">
              {issues.slice(0, 3).map((issue, idx) => (
                <li key={idx} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quick Wins to Improve Score</span>
          </p>
          {recommendations.length === 0 ? (
            <p className="text-xs text-stone-500">Keep maintaining current pace and vendor follow-ups.</p>
          ) : (
            <ul className="space-y-1.5">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
};
