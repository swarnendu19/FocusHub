
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const XP = () => {
  const currentStreak = 12;
  const longestStreak = 28;
  const currentXP = 2850;
  const nextLevelXP = 3000;
  const currentLevel = 15;

  // Mock data for charts
  const xpGrowthData = [
    { month: "Jan", xp: 500 },
    { month: "Feb", xp: 800 },
    { month: "Mar", xp: 1200 },
    { month: "Apr", xp: 1600 },
    { month: "May", xp: 2100 },
    { month: "Jun", xp: 2850 },
  ];

  const weeklyProductivityData = [
    { day: "Mon", hours: 4.5, tasks: 8 },
    { day: "Tue", hours: 6.2, tasks: 12 },
    { day: "Wed", hours: 3.8, tasks: 6 },
    { day: "Thu", hours: 5.5, tasks: 10 },
    { day: "Fri", hours: 7.1, tasks: 15 },
    { day: "Sat", hours: 2.3, tasks: 4 },
    { day: "Sun", hours: 1.5, tasks: 2 },
  ];

  const categoryBreakdown = [
    { category: "Coding", hours: 45, color: "#22C55E" },
    { category: "Learning", hours: 32, color: "#3B82F6" },
    { category: "Writing", hours: 18, color: "#F59E0B" },
    { category: "Planning", hours: 12, color: "#EF4444" },
  ];

  const aiInsights = [
    "Your peak productivity hours are between 9 AM - 11 AM",
    "You're 23% more focused on weekdays than weekends",
    "Taking breaks every 45 minutes improves your focus by 18%",
    "Your longest focus sessions happen during coding tasks"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">XP Dashboard</h1>
        <p className="text-muted-foreground">Track your experience points and productivity insights</p>
      </div>

      {/* Level and Streaks */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{currentLevel}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentXP} XP</span>
                  <span>{nextLevelXP} XP</span>
                </div>
                <Progress value={(currentXP / nextLevelXP) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {nextLevelXP - currentXP} XP to next level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">days</div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                🔥 On Fire!
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-500">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">days</div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                🏆 Personal Best
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* XP Growth */}
        <Card>
          <CardHeader>
            <CardTitle>XP Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={xpGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#22C55E" 
                  fill="#22C55E" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProductivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown and AI Assistant */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Time by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.hours}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(category.hours / Math.max(...categoryBreakdown.map(c => c.hours))) * 100}%`,
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Productivity Assistant */}
        <Card>
          <CardHeader>
            <CardTitle>🤖 AI Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
              <Button className="w-full bg-primary hover:bg-primary/90">
                Get More Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default XP;
