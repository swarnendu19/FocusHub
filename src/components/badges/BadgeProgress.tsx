
import React from 'react';
import { Target, Clock, Flame, Star, Award, Zap, TimerOff, Timer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Badge = {
  id: string;
  name: string;
  progress: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  badgeType: string;
};

const badges: Badge[] = [
  {
    id: 'first-focus',
    name: 'First Focus',
    progress: 26,
    icon: <Target className="h-6 w-6" />,
    description: '7m / 30m in one session',
    color: 'bg-indigo-500',
    badgeType: 'blue'
  },
  {
    id: 'flame-starter',
    name: 'Flame Starter',
    progress: 14,
    icon: <Flame className="h-6 w-6" />,
    description: '1 / 7 days streak',
    color: 'bg-red-500',
    badgeType: 'indigo'
  },
  {
    id: 'power-hour',
    name: 'Power Hour',
    progress: 13,
    icon: <Zap className="h-6 w-6" />,
    description: '7m / 1h in one session',
    color: 'bg-yellow-500',
    badgeType: 'blue'
  },
  {
    id: 'flame-keeper',
    name: 'Flame Keeper',
    progress: 7,
    icon: <Star className="h-6 w-6" />,
    description: '1 / 14 days streak',
    color: 'bg-yellow-500',
    badgeType: 'indigo'
  },
  {
    id: 'deep-work-master',
    name: 'Deep Work Master',
    progress: 6,
    icon: <Award className="h-6 w-6" />,
    description: '7m / 2h in one session',
    color: 'bg-purple-500',
    badgeType: 'blue'
  },
  {
    id: 'half-day-hero',
    name: 'Half Day Hero',
    progress: 5,
    icon: <Timer className="h-6 w-6" />,
    description: '12m / 4h in one day',
    color: 'bg-blue-500',
    badgeType: 'indigo'
  },
  {
    id: 'flame-master',
    name: 'Flame Master',
    progress: 3,
    icon: <Flame className="h-6 w-6" />,
    description: '1 / 30 days streak',
    color: 'bg-purple-500',
    badgeType: 'blue'
  },
  {
    id: 'full-day-finisher',
    name: 'Full Day Finisher',
    progress: 3,
    icon: <Clock className="h-6 w-6" />,
    description: '12m / 8h in one day',
    color: 'bg-blue-500',
    badgeType: 'indigo'
  }
];

const BadgeProgress = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Badge Progress</h2>
        <p className="text-gray-500 text-sm">Track your progress towards earning new badges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <Card key={badge.id} className="shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`relative flex items-center justify-center rounded-full p-4 ${badge.badgeType === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'} text-white`}>
                  {badge.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold">{badge.name}</h3>
                    <span className="text-sm font-medium">{badge.progress}%</span>
                  </div>
                  <Progress value={badge.progress} className="h-2 mb-2" />
                  <p className="text-sm text-gray-500">{badge.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BadgeProgress;
