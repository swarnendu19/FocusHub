import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mockWeeklyGoal = {
  goalHours: 3,
  completedSeconds: 1,
};

const WeeklyGoalProgress = () => {
  const [goal, setGoal] = useState(mockWeeklyGoal.goalHours);
  const [completed, setCompleted] = useState(mockWeeklyGoal.completedSeconds);

  const percent = Math.min((completed / (goal * 3600)) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Goal Progress</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={() => {
            // For demo, just increment goal by 1 hour
            setGoal(g => g + 1);
          }}
        >
          Update Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{percent.toFixed(0)}% Complete</span>
          <span className="text-xs text-muted-foreground">Goal: {goal}h</span>
        </div>
        <Progress value={percent} className="h-2 mb-2" />
        <div className="text-xs text-muted-foreground">{Math.floor(completed / 3600)}h {Math.floor((completed % 3600) / 60)}m {completed % 60}s</div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoalProgress;
