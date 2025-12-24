// src/components/dashboard/TimerTab.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

export default function TimerTab() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              // Timer finished
              setIsRunning(false);
              setIsBreak(!isBreak);
              return isBreak ? 0 : 5 * 60; // 5 minutes break or back to 25 minutes
            }
            setMinutes(prev => prev - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes, seconds, isBreak]);

  const formatTime = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (minutes > 0 || seconds > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const handleCustomTime = () => {
    const customMinutes = prompt('Enter minutes:');
    const customSeconds = prompt('Enter seconds:');

    if (customMinutes && customSeconds) {
      const mins = parseInt(customMinutes);
      const secs = parseInt(customSeconds);

      if (!isNaN(mins) && !isNaN(secs) && mins >= 0 && secs >= 0 && secs < 60) {
        setMinutes(mins);
        setSeconds(secs);
        setIsRunning(false);
        setIsBreak(false);
      }
    }
  };

  const startPomodoro = () => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(true);
    setIsBreak(false);
  };

  const startBreak = () => {
    setMinutes(5);
    setSeconds(0);
    setIsRunning(true);
    setIsBreak(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            Use the Pomodoro Technique to maintain focus and productivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`text-6xl font-mono font-bold ${
              isBreak ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {formatTime()}
            </div>
            <div className="mt-2">
              <Badge variant={isBreak ? "secondary" : "default"}>
                {isBreak ? "Break Time" : "Focus Time"}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" disabled={minutes === 0 && seconds === 0}>
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Preset Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={startPomodoro} variant="outline">
              25 min Focus
            </Button>
            <Button onClick={startBreak} variant="outline">
              5 min Break
            </Button>
            <Button onClick={handleCustomTime} variant="outline">
              Custom Time
            </Button>
          </div>

          {/* Timer Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label htmlFor="seconds">Seconds</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Technique Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Work for 25 minutes straight</li>
            <li>• Take a 5-minute break</li>
            <li>• After 4 cycles, take a longer 15-30 minute break</li>
            <li>• Use breaks to stretch, walk, or do light exercise</li>
            <li>• Avoid checking social media during focus periods</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}