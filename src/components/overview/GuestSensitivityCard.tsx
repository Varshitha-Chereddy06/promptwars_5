import React from 'react';
import { Users, TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SensitivityAnalysis } from '../../types';
import { formatCurrency } from '../../services/calculationService';

interface GuestSensitivityCardProps {
  guestCount: number;
  totalBudget: number;
  onGuestCountChange: (count: number) => void;
  sensitivity: SensitivityAnalysis;
}

export const GuestSensitivityCard: React.FC<GuestSensitivityCardProps> = ({
  guestCount,
  totalBudget,
  onGuestCountChange,
  sensitivity
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Guest Slider & Cost Sensitivity
            </h3>
            <p className="text-xs text-stone-500">Live per-head economics and surge projection</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100">
            {guestCount}
          </span>
          <span className="text-xs text-stone-400 block font-medium">Expected Guests</span>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-stone-500 font-medium">
          <span>Intimate (10)</span>
          <span className="text-stone-900 dark:text-stone-100 font-semibold">{guestCount} Guests</span>
          <span>Grand Gala (500)</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="5"
          value={guestCount}
          onChange={(e) => onGuestCountChange(Number(e.target.value))}
          className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
          aria-label="Guest Count Slider"
        />
      </div>

      {/* Per Guest Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60">
          <span className="text-xs text-stone-500 block">Baseline Cost / Guest</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 block">
            {formatCurrency(sensitivity.baseCostPerGuest)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Based on {formatCurrency(totalBudget)} total budget
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50">
          <span className="text-xs text-rose-700 dark:text-rose-300 block flex items-center justify-between">
            <span>What If +20 Guests?</span>
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1 block">
            +{formatCurrency(sensitivity.cateringSurgeAmount)}
          </span>
          <span className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-0.5 block">
            Food & rentals surge at {guestCount + 20} heads
          </span>
        </div>
      </div>

      {/* Sensitivity Risk Alerts */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <ArrowUpRight className="w-4 h-4 text-rose-500" />
          <span>Surge Impact Analysis ({guestCount + 20} Total Guests)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            {sensitivity.budgetDeficitRisk ? (
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            )}
            <span>
              {sensitivity.budgetDeficitRisk
                ? 'Surge exceeds your planned buffer! Trimming needed.'
                : 'Emergency buffer can safely absorb the extra 20 guests.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-900 dark:text-stone-100">
              New Cost Per Guest:
            </span>
            <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
              {formatCurrency(sensitivity.projectedCostPerGuest)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
