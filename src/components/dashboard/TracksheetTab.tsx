// src/components/dashboard/TracksheetTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Trophy, Target, Download, FileText, FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';

interface Session {
  _id: string;
  problemTitle: string;
  problemRating: number;
  problemUrl?: string;
  totalTime: number;
  score: number;
  streakBonus: number;
  laps: Array<{
    name: string;
    time: number;
    comment?: string;
  }>;
  comments?: string;
  createdAt: string;
}

export default function TracksheetTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvData = filteredSessions.map(session => ({
      'Date': formatDate(session.createdAt),
      'Problem Title': session.problemTitle,
      'Rating': session.problemRating,
      'Problem URL': session.problemUrl || '',
      'Total Time': formatTime(session.totalTime),
      'Score': session.score,
      'Streak Bonus': session.streakBonus,
      'Laps': session.laps?.map(lap => `${lap.name}: ${formatTime(lap.time)}`).join(' | ') || '',
      'Comments': session.comments || ''
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tracksheet_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = async () => {
    const excelData = filteredSessions.map(session => ({
      'Date': formatDate(session.createdAt),
      'Problem Title': session.problemTitle,
      'Rating': session.problemRating,
      'Problem URL': session.problemUrl || '',
      'Total Time': formatTime(session.totalTime),
      'Score': session.score,
      'Streak Bonus': session.streakBonus,
      'Laps': session.laps?.map(lap => `${lap.name}: ${formatTime(lap.time)}`).join(' | ') || '',
      'Comments': session.comments || ''
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tracksheet');

    // Add headers
    worksheet.addRow(Object.keys(excelData[0]));

    // Add data rows
    excelData.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Write file
    await workbook.xlsx.writeFile(`tracksheet_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredSessions = sessions.filter(session =>
    session.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.problemRating.toString().includes(searchTerm)
  );

  const totalTime = sessions.reduce((acc, session) => acc + session.totalTime, 0);
  const averageRating = sessions.length > 0
    ? Math.round(sessions.reduce((acc, session) => acc + session.problemRating, 0) / sessions.length)
    : 0;
  const totalScore = sessions.reduce((acc, session) => acc + session.score, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Score</p>
                <p className="text-2xl font-bold">{totalScore.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search sessions by problem title or rating..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex-1"
                disabled={filteredSessions.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="flex-1"
                disabled={filteredSessions.length === 0}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No sessions found. Start solving problems to see your tracksheet!</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{session.problemTitle}</CardTitle>
                    <CardDescription>
                      Rating: {session.problemRating} • Score: {session.score.toLocaleString()}
                      {session.streakBonus > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          +{session.streakBonus} streak bonus
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(session.createdAt)}</p>
                    <p className="text-lg font-mono font-bold">{formatTime(session.totalTime)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {session.problemUrl && (
                  <p className="mb-4">
                    <a
                      href={session.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Problem →
                    </a>
                  </p>
                )}

                {session.laps && session.laps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Time Breakdown:</h4>
                    <div className="space-y-1">
                      {session.laps.map((lap, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{lap.name}</span>
                          <span className="font-mono">{formatTime(lap.time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.comments && (
                  <div>
                    <h4 className="font-semibold mb-2">Comments:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {session.comments}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}