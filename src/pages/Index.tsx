
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Timer from '@/components/timer/Timer';
import ActivityOverview from '@/components/activity/ActivityOverview';
import WeeklyGoal from '@/components/goals/WeeklyGoal';
import BadgeProgress from '@/components/badges/BadgeProgress';
import CommunityActivity from '@/components/community/CommunityActivity';
import { Flame, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-800">My Activity</h1>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full">
              <Flame className="h-5 w-5" />
              <span>1</span>
              <Trophy className="h-5 w-5 ml-2" />
              <span>1</span>
              <div className="ml-1 text-yellow-400">⭐</div>
            </div>
          </div>
          <p className="text-gray-500">Track progress and see your activity</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-1">
            <Timer />
          </div>
          <div className="md:col-span-2 flex flex-col space-y-6">
            <ActivityOverview />
            <WeeklyGoal />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <CommunityActivity />
          <BadgeProgress />
        </div>
      </main>
    </div>
  );
};

export default Index;
