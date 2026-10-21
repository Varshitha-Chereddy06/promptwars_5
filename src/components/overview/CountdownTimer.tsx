import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { calculateCountdown, formatDate } from '../../services/calculationService';

interface CountdownTimerProps {
  eventDate: string;
  eventTime: string;
  city: string;
  venueName: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  eventDate,
  eventTime,
  city,
  venueName
}) => {
  const [countdown, setCountdown] = useState(() => calculateCountdown(eventDate, eventTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(eventDate, eventTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  const units = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Mins', value: countdown.minutes },
    { label: 'Secs', value: countdown.seconds },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-stone-800">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Location & Date details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Countdown</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{formatDate(eventDate)} at {eventTime || '17:00'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{venueName ? `${venueName}, ` : ''}{city || 'Location TBD'}</span>
            </span>
          </div>
        </div>

        {/* Right: Countdown Cards */}
        {countdown.isPast ? (
          <div className="px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2">
            <span>🎉 Celebration day has arrived!</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 min-w-[62px] sm:min-w-[76px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner"
              >
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-stone-400 mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
