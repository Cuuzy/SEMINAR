import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDateStr: string; // ISO string e.g., '2026-08-22T08:30:00'
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDateStr }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetTime = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0 || isNaN(targetTime)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (timeLeft.isExpired) {
    return (
      <div className="bg-emerald-950/80 backdrop-blur-md border border-amber-400/30 rounded-2xl p-4 text-center text-amber-300 font-semibold shadow-lg">
        <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
          Acara Sedang Berlangsung atau Pendaftaran Telah Selesai
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950/90 via-emerald-900/90 to-emerald-950/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 sm:p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-3 border-b border-emerald-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-amber-200 uppercase">
            Hitung Mundur Acara (Countdown)
          </span>
        </div>
        <span className="text-[11px] bg-amber-400/20 text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-400/30">
          Live Real-Time
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {/* Days */}
        <div className="bg-emerald-900/80 rounded-xl p-2 sm:p-3 border border-amber-400/20 shadow-inner">
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-emerald-200 uppercase mt-0.5 sm:mt-1">
            Hari
          </div>
        </div>

        {/* Hours */}
        <div className="bg-emerald-900/80 rounded-xl p-2 sm:p-3 border border-amber-400/20 shadow-inner">
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-emerald-200 uppercase mt-0.5 sm:mt-1">
            Jam
          </div>
        </div>

        {/* Minutes */}
        <div className="bg-emerald-900/80 rounded-xl p-2 sm:p-3 border border-amber-400/20 shadow-inner">
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-emerald-200 uppercase mt-0.5 sm:mt-1">
            Menit
          </div>
        </div>

        {/* Seconds */}
        <div className="bg-emerald-900/80 rounded-xl p-2 sm:p-3 border border-amber-400/20 shadow-inner">
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-mono tracking-tight animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-emerald-200 uppercase mt-0.5 sm:mt-1">
            Detik
          </div>
        </div>
      </div>
    </div>
  );
};
