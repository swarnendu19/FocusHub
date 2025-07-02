
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leaderboard = () => {
  const weeklyLeaders = [
    { rank: 1, name: "Alex Chen", xp: 2850, hours: 42.5, streak: 12, avatar: "AC" },
    { rank: 2, name: "Sarah Johnson", xp: 2650, hours: 38.2, streak: 8, avatar: "SJ" },
    { rank: 3, name: "Mike Davis", xp: 2480, hours: 35.7, streak: 15, avatar: "MD" },
    { rank: 4, name: "Emma Wilson", xp: 2340, hours: 33.1, streak: 6, avatar: "EW" },
    { rank: 5, name: "David Brown", xp: 2220, hours: 31.8, streak: 9, avatar: "DB" },
    { rank: 6, name: "Lisa Garcia", xp: 2180, hours: 30.5, streak: 4, avatar: "LG" },
    { rank: 7, name: "James Miller", xp: 2050, hours: 28.9, streak: 7, avatar: "JM" },
    { rank: 8, name: "You", xp: 1950, hours: 27.3, streak: 3, avatar: "YU", isCurrentUser: true },
  ];

  const monthlyLeaders = [
    { rank: 1, name: "Sarah Johnson", xp: 12850, hours: 182.5, streak: 25, avatar: "SJ" },
    { rank: 2, name: "Alex Chen", xp: 11650, hours: 168.2, streak: 18, avatar: "AC" },
    { rank: 3, name: "Mike Davis", xp: 10480, hours: 155.7, streak: 22, avatar: "MD" },
    { rank: 4, name: "You", xp: 9950, hours: 147.3, streak: 12, avatar: "YU", isCurrentUser: true },
    { rank: 5, name: "Emma Wilson", xp: 9340, hours: 143.1, streak: 16, avatar: "EW" },
  ];

  const allTimeLeaders = [
    { rank: 1, name: "Mike Davis", xp: 45850, hours: 682.5, streak: 45, avatar: "MD" },
    { rank: 2, name: "Sarah Johnson", xp: 42650, hours: 638.2, streak: 38, avatar: "SJ" },
    { rank: 3, name: "Alex Chen", xp: 38480, hours: 585.7, streak: 28, avatar: "AC" },
    { rank: 4, name: "Emma Wilson", xp: 35340, hours: 523.1, streak: 32, avatar: "EW" },
    { rank: 5, name: "You", xp: 28950, hours: 447.3, streak: 28, avatar: "YU", isCurrentUser: true },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank.toString();
    }
  };

  const LeaderboardTable = ({ leaders }: { leaders: typeof weeklyLeaders }) => (
    <div className="space-y-3">
      {leaders.map((leader) => (
        <Card 
          key={`${leader.rank}-${leader.name}`}
          className={`transition-all hover:shadow-md ${
            leader.isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-8 text-center">
                  {getRankIcon(leader.rank)}
                </div>
                <Avatar>
                  <AvatarFallback>{leader.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {leader.name}
                    {leader.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {leader.hours}h focused • {leader.streak} day streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{leader.xp.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you stack up against other focused learners</p>
      </div>

      {/* Your Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">8th</div>
              <div className="text-sm text-muted-foreground">Weekly Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">4th</div>
              <div className="text-sm text-muted-foreground">Monthly Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">5th</div>
              <div className="text-sm text-muted-foreground">All-Time Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">↑3</div>
              <div className="text-sm text-muted-foreground">Rank Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly">
              <LeaderboardTable leaders={weeklyLeaders} />
            </TabsContent>
            
            <TabsContent value="monthly">
              <LeaderboardTable leaders={monthlyLeaders} />
            </TabsContent>
            
            <TabsContent value="alltime">
              <LeaderboardTable leaders={allTimeLeaders} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievement Spotlight */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Spotlight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
              <div className="text-3xl mb-2">👑</div>
              <div className="font-semibold">Weekly Champion</div>
              <div className="text-sm text-muted-foreground">Alex Chen</div>
              <div className="text-xs text-muted-foreground">42.5 hours focused</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-semibold">Longest Streak</div>
              <div className="text-sm text-muted-foreground">Mike Davis</div>
              <div className="text-xs text-muted-foreground">45 days straight</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold">Most Improved</div>
              <div className="text-sm text-muted-foreground">You!</div>
              <div className="text-xs text-muted-foreground">+3 ranks this week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
