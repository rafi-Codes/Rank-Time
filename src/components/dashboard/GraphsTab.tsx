// src/components/dashboard/GraphsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar
} from 'recharts';

interface SessionData {
  date: string;
  score: number;
  rating: number;
  time: number;
  totalTime: number;
}

export default function GraphsTab() {
  const [data, setData] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchGraphData();
  }, [timeRange]);

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`/api/sessions/graph?days=${timeRange}`);
      if (response.ok) {
        const graphData = await response.json();
        setData(graphData);
      }
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scoreVsRatingData = data.map(item => ({
    rating: item.rating,
    score: item.score,
    date: item.date
  }));

  const timeVsRatingData = data.map(item => ({
    rating: item.rating,
    time: item.time / 60, // Convert to minutes
    date: item.date
  }));

  const dailyProgressData = data.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing.score += item.score;
      existing.sessions += 1;
    } else {
      acc.push({
        date: item.date,
        score: item.score,
        sessions: 1
      });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchGraphData} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score vs Problem Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Score vs Problem Rating</CardTitle>
          <CardDescription>
            How your scores correlate with problem difficulty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scoreVsRatingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="rating"
                  name="Problem Rating"
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <YAxis
                  type="number"
                  dataKey="score"
                  name="Score"
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'rating' ? value : value.toLocaleString(),
                    name === 'rating' ? 'Problem Rating' : 'Score'
                  ]}
                />
                <Scatter
                  name="Sessions"
                  data={scoreVsRatingData}
                  fill="#3b82f6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Time vs Problem Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Time vs Problem Rating</CardTitle>
          <CardDescription>
            How much time you spend on problems of different difficulties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={timeVsRatingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="rating"
                  name="Problem Rating"
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <YAxis
                  type="number"
                  dataKey="time"
                  name="Time (minutes)"
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'rating' ? value : `${value} min`,
                    name === 'rating' ? 'Problem Rating' : 'Time Spent'
                  ]}
                />
                <Scatter
                  name="Sessions"
                  data={timeVsRatingData}
                  fill="#10b981"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Progress</CardTitle>
          <CardDescription>
            Your daily score accumulation over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [
                    name === 'score' ? value.toLocaleString() : value,
                    name === 'score' ? 'Total Score' : 'Sessions'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Score"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Score Efficiency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length > 0
                  ? `Average score per session: ${Math.round(data.reduce((acc, item) => acc + item.score, 0) / data.length).toLocaleString()}`
                  : 'No data available'
                }
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Time Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length > 0
                  ? `Average time per session: ${Math.round(data.reduce((acc, item) => acc + item.time, 0) / data.length / 60)} minutes`
                  : 'No data available'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}