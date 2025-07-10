
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
 
import FocusTimer from "@/components/Home/FocusTimer";
import ActivityOverview from "@/components/Home/ActivityOverview";
import WeeklyGoalProgress from "@/components/Home/WeeklyGoalProgress";
import Projects from "./Projects";

const Home = () => {
 

  const badges = [
    { name: "First Timer", progress: 100, total: 100, unlocked: true },
    { name: "Focused Warrior", progress: 75, total: 100, unlocked: false },
    { name: "Time Master", progress: 30, total: 100, unlocked: false },
    { name: "Productivity Guru", progress: 10, total: 100, unlocked: false },
  ];

  return (
    <div className="space-y-8 bg-[#131F24] min-h-screen py-6 px-2 md:px-8">
      {/* Header is handled globally */}
      {/* Focus Timer & Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FocusTimer/></div>
        <div><ActivityOverview/></div>
      </div>
      {/* Progress Bar */}
      <div>
        <WeeklyGoalProgress/>
      </div>
      {/* Recent Projects */}
      <Card className="bg-[#1A2B32] border-none shadow-md">
        <CardHeader>
          <CardTitle className="font-[din-round] text-[#58CC02] text-xl">Your Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Projects />
        </CardContent>
      </Card>
      {/* All Badges */}
      <Card className="bg-[#1A2B32] border-none shadow-md">
        <CardHeader>
          <CardTitle className="font-[din-round] text-[#1CB0F6] text-xl">All Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
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
