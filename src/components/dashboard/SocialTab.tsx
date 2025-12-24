// src/components/dashboard/SocialTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, UserMinus, Users, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  usertag: string;
  image?: string;
  league: string;
  totalScore: number;
}

export default function SocialTab() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load following list on component mount
  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    try {
      const response = await fetch('/api/users/following');
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following.map((user: User) => user._id));
      }
    } catch (error) {
      console.error('Failed to load following list:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId }),
      });

      if (response.ok) {
        setFollowing(prev => [...prev, targetUserId]);
      }
    } catch (error) {
      console.error('Follow failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/follow?targetUserId=${targetUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFollowing(prev => prev.filter(id => id !== targetUserId));
      }
    } catch (error) {
      console.error('Unfollow failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeagueColor = (league: string) => {
    const colors = {
      bronze: 'bg-amber-600',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-cyan-400',
      diamond: 'bg-blue-500',
      master: 'bg-purple-500',
      grandmaster: 'bg-red-500',
    };
    return colors[league as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Users
          </CardTitle>
          <CardDescription>
            Search for users by their usertag or name to connect and follow their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by usertag or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className="flex-1"
            />
            <Button onClick={searchUsers} disabled={isSearching || searchQuery.length < 2}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">@{user.usertag}</div>
                    </div>
                    <Badge className={`${getLeagueColor(user.league)} text-white`}>
                      <Trophy className="h-3 w-3 mr-1" />
                      {user.league}
                    </Badge>
                  </div>
                  {following.includes(user._id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(user._id)}
                      disabled={isLoading}
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleFollow(user._id)}
                      disabled={isLoading}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Follow
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Following List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Following ({following.length})
          </CardTitle>
          <CardDescription>
            Users you're following and tracking their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {following.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You haven't followed anyone yet.</p>
              <p className="text-sm">Search for users above to start following!</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Following list will be displayed here.</p>
              <p className="text-sm">This feature is under development.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}