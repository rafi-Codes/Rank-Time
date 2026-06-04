"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapData {
  date: string;
  count: number;
  points: number;
  totalTime: number;
  averageScore: number;
  activities: any[];
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
  stats: {
    totalActivities: number;
    totalPoints: number;
    totalTime: number;
    averageDaily: number;
    mostActiveDay?: string;
  } | null;
  loading: boolean;
  period: '30d' | '90d' | '1y';
  onPeriodChange: (period: '30d' | '90d' | '1y') => void;
}

type ThemeType = 'cyan' | 'github' | 'codeforces' | 'sunset';

export default function ActivityHeatmap({
  data,
  stats,
  loading,
  period,
  onPeriodChange
}: ActivityHeatmapProps) {
  const [theme, setTheme] = useState<ThemeType>('cyan');
  const [tooltip, setTooltip] = useState<{
    content: string | null;
    x: number;
    y: number;
    visible: boolean;
  }>({ content: null, x: 0, y: 0, visible: false });

  // 1. Group data into weeks (columns)
  const weeks = useMemo(() => {
    if (!data || data.length === 0) return [];

    const weekList: HeatmapData[][] = [];
    let currentWeek: HeatmapData[] = [];

    // Align dates so that each week column represents Sun-Sat
    const firstDate = new Date(data[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Pad the first week with dummy entries if necessary
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: `pad-start-${i}`,
        count: -1, // sentinel value for padding
        points: 0,
        totalTime: 0,
        averageScore: 0,
        activities: []
      });
    }

    data.forEach((day) => {
      if (currentWeek.length === 7) {
        weekList.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Pad the last week to make it complete (7 days)
    if (currentWeek.length > 0) {
      const paddingNeeded = 7 - currentWeek.length;
      for (let i = 0; i < paddingNeeded; i++) {
        currentWeek.push({
          date: `pad-end-${i}`,
          count: -1,
          points: 0,
          totalTime: 0,
          averageScore: 0,
          activities: []
        });
      }
      weekList.push(currentWeek);
    }

    return weekList;
  }, [data]);

  // 2. Compute month labels and their column offsets
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = '';

    weeks.forEach((week, colIndex) => {
      // Find first non-padded day in this week
      const firstValidDay = week.find(d => d.count !== -1);
      if (firstValidDay) {
        const date = new Date(firstValidDay.date);
        const monthName = date.toLocaleString('default', { month: 'short' });
        if (monthName !== lastMonth) {
          labels.push({ text: monthName, colIndex });
          lastMonth = monthName;
        }
      }
    });

    return labels;
  }, [weeks]);

  // 3. Style maps for intensity levels based on active theme
  const getCellClassName = (count: number) => {
    if (count === -1) return 'opacity-0 pointer-events-none w-3.5 h-3.5'; // padded spacer

    const baseClass = 'w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-all duration-200 hover:scale-125 hover:z-10';

    if (theme === 'cyan') {
      if (count === 0) return cn(baseClass, 'bg-cyan-500/5 border border-cyan-500/10 dark:bg-cyan-500/5 dark:border-cyan-500/5');
      if (count === 1) return cn(baseClass, 'bg-cyan-500/20 shadow-[0_0_4px_rgba(6,182,212,0.1)] border border-cyan-500/10');
      if (count === 2) return cn(baseClass, 'bg-cyan-500/45 shadow-[0_0_6px_rgba(6,182,212,0.2)] border border-cyan-500/20');
      if (count <= 4) return cn(baseClass, 'bg-cyan-500/75 shadow-[0_0_8px_rgba(6,182,212,0.35)] border border-cyan-400/30');
      return cn(baseClass, 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] border border-cyan-300/40');
    }

    if (theme === 'github') {
      if (count === 0) return cn(baseClass, 'bg-zinc-100 dark:bg-zinc-800 border border-transparent');
      if (count === 1) return cn(baseClass, 'bg-emerald-200 dark:bg-emerald-950/80');
      if (count === 2) return cn(baseClass, 'bg-emerald-350 dark:bg-emerald-800 bg-[#9be9a8]');
      if (count <= 4) return cn(baseClass, 'bg-emerald-500 dark:bg-emerald-600 bg-[#40c463]');
      return cn(baseClass, 'bg-emerald-700 dark:bg-emerald-400 bg-[#216e39]');
    }

    if (theme === 'codeforces') {
      if (count === 0) return cn(baseClass, 'bg-zinc-100 dark:bg-zinc-800 border border-transparent');
      if (count === 1) return cn(baseClass, 'bg-gray-400 dark:bg-gray-600'); // Newbie
      if (count === 2) return cn(baseClass, 'bg-emerald-500 dark:bg-emerald-600'); // Pupil
      if (count === 3) return cn(baseClass, 'bg-cyan-500 dark:bg-cyan-500'); // Specialist
      if (count === 4) return cn(baseClass, 'bg-blue-600 dark:bg-blue-500'); // Expert
      if (count === 5) return cn(baseClass, 'bg-violet-600 dark:bg-violet-500'); // Candidate Master
      if (count === 6) return cn(baseClass, 'bg-orange-500 dark:bg-orange-500'); // Master
      return cn(baseClass, 'bg-red-600 dark:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'); // Grandmaster
    }

    // Sunset theme
    if (count === 0) return cn(baseClass, 'bg-zinc-100 dark:bg-zinc-800 border border-transparent');
    if (count === 1) return cn(baseClass, 'bg-amber-250 dark:bg-amber-950 bg-amber-100');
    if (count === 2) return cn(baseClass, 'bg-orange-300 dark:bg-orange-850');
    if (count <= 4) return cn(baseClass, 'bg-orange-500 dark:bg-orange-600');
    return cn(baseClass, 'bg-red-500 dark:bg-red-500');
  };

  // Helper for mouse hover to trigger tooltip
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, day: HeatmapData) => {
    if (day.count === -1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dateFormatted = new Date(day.date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    setTooltip({
      content: `${day.count} activities • ${day.points} points on ${dateFormatted}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      visible: true
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <Card className="glass-tier-1 overflow-hidden relative border-[var(--glass-subtle-border)]">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight">
              <BarChart3 className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span>Activity Heatmap</span>
            </CardTitle>
            <CardDescription>
              Visualize your practice consistency and rating progress
            </CardDescription>
          </div>
          
          {/* Period Toggle Selector (Glass Pills) */}
          <div className="flex items-center space-x-1 bg-white/5 dark:bg-black/20 p-1 rounded-xl border border-white/10 max-w-fit">
            {(['30d', '90d', '1y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  "px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer duration-300",
                  period === p
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {loading ? (
          <div className="h-44 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updating consistency matrix...</p>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-4">
            
            {/* Heatmap Outer Container with Horizontal Scroll */}
            <div className="flex flex-col w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
              <div className="min-w-max pr-4 pl-1">
                
                {/* Month Labels Line */}
                <div className="relative h-5 mb-1 text-[10px] font-medium text-gray-400 dark:text-zinc-500 ml-8">
                  {monthLabels.map((label, idx) => {
                    // Compute absolute pixel offset (columns * (cell_width + gap) + offset)
                    // cell width is 14px (w-3.5 is 14px), gap is 4px (gap-1 is 4px)
                    const leftOffset = label.colIndex * 18;
                    return (
                      <span
                        key={idx}
                        className="absolute transform transition-all duration-300"
                        style={{ left: `${leftOffset}px` }}
                      >
                        {label.text}
                      </span>
                    );
                  })}
                </div>

                <div className="flex flex-row items-start">
                  {/* Day of Week Labels */}
                  <div className="flex flex-col justify-between h-[122px] text-[10px] font-medium text-gray-400 dark:text-zinc-500 w-8 pr-2 pt-0.5">
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                  </div>

                  {/* Grid of Weeks */}
                  <div className="flex flex-row gap-1">
                    {weeks.map((week, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className={getCellClassName(day.count)}
                            onMouseEnter={(e) => handleMouseEnter(e, day)}
                            onMouseLeave={handleMouseLeave}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-white/5">
              
              {/* Theme Presets Switcher */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                  <Settings2 className="w-3 h-3 text-cyan-400" />
                  Grid Theme:
                </span>
                <div className="flex bg-white/5 dark:bg-black/10 p-0.5 rounded-lg border border-white/5">
                  {(['cyan', 'github', 'codeforces', 'sunset'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all duration-200 capitalize",
                        theme === t
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-400 hover:text-gray-200 border border-transparent"
                      )}
                    >
                      {t === 'codeforces' ? 'CF Rating' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Legend */}
              <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-zinc-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {theme === 'codeforces' ? (
                    // Codeforces 8-tier legend
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={cn("w-3 h-3 rounded-sm", getCellClassName(i))} />
                    ))
                  ) : (
                    // Regular 5-tier legend
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={cn("w-3 h-3 rounded-sm", getCellClassName(i === 3 ? 3 : i === 4 ? 5 : i))} />
                    ))
                  )}
                </div>
                <span>More</span>
              </div>
            </div>

            {/* General statistics boxes */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/10 backdrop-blur-md">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-cyan-400 tracking-tight">{stats.totalActivities}</p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Total Sessions</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-3xl font-extrabold text-indigo-400 tracking-tight">{stats.totalPoints}</p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Honor Points</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.averageDaily}</p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Avg Daily</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-lg font-bold text-orange-400 truncate tracking-tight pt-1">
                    {stats.mostActiveDay ? new Date(stats.mostActiveDay).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1.5 uppercase tracking-wider">Peak Focus Day</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-56 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center">
            <div className="text-center max-w-sm px-6">
              <BarChart3 className="h-12 w-12 text-gray-500 dark:text-zinc-400 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-300 font-semibold">No activity logs recorded yet</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Solve coding problems using the Stopwatch or Timer console to generate metrics!
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Floating Glass Portal Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900/90 dark:bg-slate-950/95 border border-white/15 shadow-xl backdrop-blur-md transition-all duration-150 whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900/90 dark:border-t-slate-950/95" />
        </div>
      )}
    </Card>
  );
}
