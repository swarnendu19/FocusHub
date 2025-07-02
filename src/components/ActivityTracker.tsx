import React, { useState } from 'react';
import { Play, Clock, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export default function ActivityTracker() {
  const [selectedDuration, setSelectedDuration] = useState('30m');
  
  // Generate calendar data for the year
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const days = ['Tue', 'Thu', 'Sat'];
  
  // Generate activity grid data (mostly empty with some random activity)
  const generateActivityData = () => {
    const data : any = [];
    months.forEach((month, monthIndex) => {
      days.forEach((day, dayIndex) => {
        const weekData = [];
        for (let week = 0; week < 53; week++) {
          // Random activity level (mostly 0, some 1-4)
          const activity = Math.random() < 0.95 ? 0 : Math.floor(Math.random() * 4) + 1;
          weekData.push(activity);
        }
        data.push({ month, day, weeks: weekData });
      });
    });
    return data;
  };
  
  const activityData = generateActivityData();
  
  const getActivityColor = (level: any) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-blue-200';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-600';
      case 4: return 'bg-blue-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Activity</h1>
        <p className="text-gray-500">Track progress and see your activity</p>
      </div>
      
      <div className="flex gap-8">
        {/* Left Panel - Timer */}
        <div className="w-96">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Circular Timer */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="#d1d5db"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="534"
                    strokeDashoffset="534"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900">30:00</div>
                  <Clock className="w-6 h-6 text-gray-400 mt-1" />
                </div>
              </div>
            </div>
            
            {/* Dropdown */}
            <div className="mb-6">
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>FocusWork</option>
                  <option>Break</option>
                  <option>Study</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Duration Buttons */}
            <div className="flex gap-2 mb-6">
              {['30m', '1h', '2h'].map((duration) => (
                <Button
                  variant="super" 
                  size="lg"
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedDuration === duration
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}
                </Button>
              ))}
            </div>
            
            {/* Start Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Start Timer
            </button>
          </div>
        </div>
        
        {/* Right Panel - Activity Overview */}
        <div className="flex-1">
          {/* Activity Overview Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
            <span className="text-gray-500">Total: 0h 0m</span>
          </div>
          
          {/* Calendar Heatmap */}
          <div className="mb-8">
            {/* Month Headers */}
            <div className="flex mb-2">
              <div className="w-12"></div> {/* Space for day labels */}
              {months.map((month) => (
                <div key={month} className="flex-1 text-xs text-gray-500 text-center">
                  {month}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="space-y-1">
              {days.map((day, dayIndex) => (
                <div key={day} className="flex items-center gap-1">
                  <div className="w-8 text-xs text-gray-500 text-right">{day}</div>
                  <div className="flex gap-1">
                    {Array.from({ length: 53 }, (_, weekIndex) => (
                      <div
                        key={weekIndex}
                        className={`w-3 h-3 rounded-sm ${getActivityColor(0)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-gray-500">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                />
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
          
          {/* Weekly Goal Progress */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Weekly Goal Progress</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Update Goal
              </button>
            </div>
            
            <div className="text-gray-500 mb-4">0% Complete</div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">1s</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-sm text-gray-500">Goal: 3h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}