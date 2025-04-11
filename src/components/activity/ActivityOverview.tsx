
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define the ActivityData type correctly
type ActivityData = {
  date: string;
  count: number;
};

// Function to generate days for the past year
const generatePastYear = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Generate dummy activity data
const generateActivityData = (): ActivityData[] => {
  const dates = generatePastYear();
  
  return dates.map(date => {
    // Create more realistic patterns with more empty days
    const isActive = Math.random() > 0.6;
    
    // If active, generate between 1-4 activity count, weighted towards lower numbers
    const count = isActive 
      ? Math.floor(Math.random() * 4) + 1 
      : 0;
      
    return {
      date,
      count
    };
  });
};

const ActivityOverview = () => {
  const activityData = generateActivityData();
  const totalHours = "12h 30m";
  
  // Group by week for display
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];
  
  activityData.forEach((day, index) => {
    currentWeek.push(day);
    
    if (currentWeek.length === 7 || index === activityData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  // Get months for labels
  const months: string[] = [];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  activityData.forEach((day, index) => {
    const date = new Date(day.date);
    const month = date.getMonth();
    const firstDayOfMonth = date.getDate() === 1 || index === 0;
    
    if (firstDayOfMonth) {
      months.push(monthLabels[month]);
    }
  });
  
  // Get intensity class based on activity count
  const getIntensityClass = (count: number) => {
    switch(count) {
      case 0:
        return "bg-gray-100";
      case 1:
        return "bg-blue-200";
      case 2:
        return "bg-blue-300";
      case 3:
        return "bg-blue-400";
      case 4:
        return "bg-blue-500";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card className="shadow-sm bg-white w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Activity Overview</CardTitle>
        <div className="text-sm text-gray-500">
          Total: <span className="text-blue-600 font-medium">{totalHours}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col gap-1">
            {/* Month labels */}
            <div className="col-span-1"></div>
            <div className="flex justify-between px-2 text-xs text-gray-500">
              {months.map((month, idx) => (
                <div key={`month-${idx}`} className="text-center">
                  {month}
                </div>
              ))}
            </div>
          </div>
          
          {/* Activity grid */}
          <div className="grid grid-flow-col gap-1 pt-2">
            {/* Day labels */}
            <div className="grid grid-rows-7 gap-1">
              {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((day, idx) => (
                <div key={`day-${idx}`} className="h-3 text-xs text-gray-500 flex items-center justify-end pr-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Activity squares */}
            <div className="grid grid-flow-col gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={`week-${weekIdx}`} className="grid grid-rows-7 gap-1">
                  {week.map((day, dayIdx) => {
                    const date = new Date(day.date);
                    return (
                      <div 
                        key={`day-${weekIdx}-${dayIdx}`}
                        className={`h-3 w-3 rounded-sm ${getIntensityClass(day.count)}`}
                        title={`${date.toDateString()}: ${day.count} hours`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-end items-center mt-4 space-x-1">
            <span className="text-xs text-gray-500">Less</span>
            <div className={`h-3 w-3 rounded-sm ${getIntensityClass(0)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getIntensityClass(1)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getIntensityClass(2)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getIntensityClass(3)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getIntensityClass(4)}`}></div>
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityOverview;
