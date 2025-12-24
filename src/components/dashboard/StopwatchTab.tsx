// src/components/dashboard/StopwatchTab.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Square, Plus, Trash2 } from 'lucide-react';

interface Lap {
  id: string;
  name: string;
  time: number;
  comment?: string;
}

export default function StopwatchTab() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [currentLapName, setCurrentLapName] = useState('Thinking Time');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemRating, setProblemRating] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [comments, setComments] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - time;
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    startTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning && time > 0) {
      const newLap: Lap = {
        id: Date.now().toString(),
        name: currentLapName,
        time: time,
        comment: ''
      };
      setLaps(prev => [...prev, newLap]);
    }
  };

  const updateLapComment = (lapId: string, comment: string) => {
    setLaps(prev => prev.map(lap =>
      lap.id === lapId ? { ...lap, comment } : lap
    ));
  };

  const removeLap = (lapId: string) => {
    setLaps(prev => prev.filter(lap => lap.id !== lapId));
  };

  const saveSession = async () => {
    if (!problemTitle || !problemRating) {
      alert('Please enter problem title and rating');
      return;
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemTitle,
          problemRating: parseInt(problemRating),
          problemUrl,
          totalTime: Math.floor(time / 1000),
          laps: laps.map(lap => ({
            name: lap.name,
            time: Math.floor(lap.time / 1000),
            comment: lap.comment
          })),
          comments
        }),
      });

      if (response.ok) {
        alert('Session saved successfully!');
        handleReset();
        setProblemTitle('');
        setProblemRating('');
        setProblemUrl('');
        setComments('');
      } else {
        alert('Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session');
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem Information */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Information</CardTitle>
          <CardDescription>Enter details about the problem you're working on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="problem-title">Problem Title</Label>
              <Input
                id="problem-title"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g., Two Sum"
              />
            </div>
            <div>
              <Label htmlFor="problem-rating">Problem Rating</Label>
              <Input
                id="problem-rating"
                type="number"
                value={problemRating}
                onChange={(e) => setProblemRating(e.target.value)}
                placeholder="e.g., 800"
              />
            </div>
            <div>
              <Label htmlFor="problem-url">Problem URL (Optional)</Label>
              <Input
                id="problem-url"
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stopwatch */}
      <Card>
        <CardHeader>
          <CardTitle>Stopwatch</CardTitle>
          <CardDescription>Track your problem-solving time with customizable laps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatTime(time)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg">
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
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Lap Controls */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="lap-name">Lap Name</Label>
              <Input
                id="lap-name"
                value={currentLapName}
                onChange={(e) => setCurrentLapName(e.target.value)}
                placeholder="e.g., Thinking Time, Debugging Time"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleLap} disabled={!isRunning}>
                <Plus className="w-4 h-4 mr-2" />
                Add Lap
              </Button>
            </div>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Laps</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {laps.map((lap, index) => (
                  <Card key={lap.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <span className="font-medium">{lap.name}</span>
                        <span className="font-mono text-sm">{formatTime(lap.time)}</span>
                      </div>
                      <Button
                        onClick={() => removeLap(lap.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Input
                        placeholder="Add comment for this lap..."
                        value={lap.comment || ''}
                        onChange={(e) => updateLapComment(lap.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <Label htmlFor="comments">Session Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about this problem-solving session..."
              rows={3}
            />
          </div>

          {/* Save Session */}
          <div className="flex justify-end">
            <Button onClick={saveSession} disabled={!problemTitle || !problemRating}>
              Save Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}