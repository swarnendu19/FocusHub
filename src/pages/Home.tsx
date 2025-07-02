
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ActivityChart } from "@/components/ActivityChart";

const Home = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const badges = [
    { name: "First Timer", progress: 100, total: 100, unlocked: true },
    { name: "Focused Warrior", progress: 75, total: 100, unlocked: false },
    { name: "Time Master", progress: 30, total: 100, unlocked: false },
    { name: "Productivity Guru", progress: 10, total: 100, unlocked: false },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Ready to focus and achieve your goals?</p>
      </div>

      {/* Focus Timer and Activity Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Focus Timer */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold mb-4">{formatTime(time)}</div>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="super" 
                className="flex-1" 
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                disabled={!selectedTask}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {
                  setIsRunning(false);
                  setTime(0);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Badge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Focused Warrior</span>
              <span className="text-sm text-muted-foreground">75/100 hours</span>
            </div>
            <Progress value={75} className="h-3" />
            <p className="text-sm text-muted-foreground">25 more hours to unlock this badge!</p>
          </div>
        </CardContent>
      </Card>

      {/* All Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={badge.name} 
                className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                  badge.unlocked 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted/50 border-muted grayscale'
                }`}
              >
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-sm mb-2">{badge.name}</h3>
                <Progress value={badge.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {badge.progress}/{badge.total}
                </p>
                {badge.unlocked && (
                  <Badge variant="default" className="mt-2 text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
