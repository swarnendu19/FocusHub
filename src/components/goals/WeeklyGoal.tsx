
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Target } from 'lucide-react';

const WeeklyGoal = () => {
  const [goal, setGoal] = useState<number>(20);
  const [currentProgress, setCurrentProgress] = useState<number>(8);
  const [showGoalSetter, setShowGoalSetter] = useState<boolean>(false);
  const [tempGoal, setTempGoal] = useState<number>(goal);
  
  const handleGoalChange = (value: number[]) => {
    setTempGoal(value[0]);
  };
  
  const saveGoal = () => {
    setGoal(tempGoal);
    setShowGoalSetter(false);
  };
  
  const progressPercentage = (currentProgress / goal) * 100;
  
  return (
    <Card className="shadow-sm bg-white w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">Set a Weekly Goal</CardTitle>
          {!showGoalSetter && (
            <Button 
              variant="outline" 
              className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
              onClick={() => setShowGoalSetter(true)}
            >
              Set Goal
            </Button>
          )}
        </div>
        <CardDescription>Track your progress by setting a weekly working hours goal</CardDescription>
      </CardHeader>
      <CardContent>
        {showGoalSetter ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly goal (hours):</span>
              <span className="font-bold text-blue-600">{tempGoal}h</span>
            </div>
            <Slider
              defaultValue={[tempGoal]}
              max={50}
              min={1}
              step={1}
              onValueChange={handleGoalChange}
              className="py-4"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowGoalSetter(false)}>Cancel</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={saveGoal}
              >
                Save Goal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Target className="mr-2 text-blue-600" size={20} />
                <span className="font-medium">Weekly Goal: {goal} hours</span>
              </div>
              <span className="text-sm font-medium">
                {currentProgress}h / {goal}h 
                <span className="text-blue-600 ml-2">({Math.round(progressPercentage)}%)</span>
              </span>
            </div>
            
            <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
              <div 
                className="h-full rounded-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            <div className="pt-2 text-sm text-gray-500">
              {progressPercentage < 30 
                ? "Just getting started! Keep going!" 
                : progressPercentage < 70 
                  ? "You're making good progress!" 
                  : progressPercentage < 100 
                    ? "Almost there! You can do it!" 
                    : "Goal achieved! Amazing work!"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyGoal;
