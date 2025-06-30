import Navbar from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Users, Filter, Clock, Calendar, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Generate dummy leaderboard data
const generateLeaderboardData = () => {
  const names = [
    'Alex Johnson', 'Taylor Swift', 'Jamie Smith', 
    'Jordan Peterson', 'Casey Williams', 'Riley Brown',
    'Sydney Clark', 'Morgan Lewis', 'Dakota Green',
    'Quinn Davis', 'Avery Miller', 'Reese Wilson'
  ];
  
  return names.map((name, index) => {
    // Decrease hours as rank increases
    const totalHours = Math.max(5, 40 - index * 3 + Math.floor(Math.random() * 5));
    const streak = Math.max(1, 30 - index * 2 + Math.floor(Math.random() * 3));
    
    return {
      id: `user-${index}`,
      name,
      rank: index + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
      totalHours,
      streak,
      badges: Math.max(2, 15 - index),
      isCurrentUser: index === 4 // Make the 5th user the current user
    };
  });
};

const Leaderboard = () => {
  const leaderboardData = generateLeaderboardData();
  
  return (
    <div className="min-h-screen bg-focus-dark text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">See how you stack up against other focus champions</p>
        </div>
        
        <Tabs defaultValue="global" className="mb-8">
          <TabsList className="bg-focus-dark/70 border border-focus-purple/30">
            <TabsTrigger value="global" className="data-[state=active]:bg-focus-purple/20">
              <Users className="h-4 w-4 mr-2" />
              Global
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-focus-purple/20">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-focus-purple/20">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="alltime" className="data-[state=active]:bg-focus-purple/20">
              <Clock className="h-4 w-4 mr-2" />
              All Time
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="mt-6">
            <Card className="neon-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="h-5 w-5 mr-2 text-focus-gold" />
                  Global Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((user) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center p-3 rounded-lg ${user.isCurrentUser 
                        ? 'bg-focus-purple/20 border border-focus-purple' 
                        : 'bg-focus-dark/60 border border-focus-purple/20'}`}
                    >
                      <div className="w-8 flex justify-center">
                        {user.rank <= 3 ? (
                          <Medal className={`h-6 w-6 ${
                            user.rank === 1 ? 'text-focus-gold' : 
                            user.rank === 2 ? 'text-gray-300' : 'text-amber-700'
                          }`} />
                        ) : (
                          <span className="font-bold">{user.rank}</span>
                        )}
                      </div>
                      
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-focus-purple/30 ml-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="font-medium flex items-center">
                          {user.name}
                          {user.isCurrentUser && (
                            <span className="ml-2 text-xs bg-focus-aqua/20 text-focus-aqua px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {user.totalHours}h total
                          <span className="mx-2">•</span>
                          <Flame className="h-3 w-3 mr-1 text-focus-red" />
                          {user.streak} day streak
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold flex items-center justify-end">
                          <Trophy className="h-4 w-4 mr-1 text-focus-gold" />
                          {user.badges}
                        </div>
                        <div className="text-xs text-focus-aqua">Badges earned</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="friends">
            <div className="text-center p-10 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No friends added yet</h3>
              <p>Add friends to see how you compare on the leaderboard</p>
              <Button className="mt-4 bg-focus-purple hover:bg-focus-purple/90">
                Add Friends
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="text-center p-10 text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Weekly leaderboard</h3>
              <p>The weekly leaderboard resets every Monday</p>
            </div>
          </TabsContent>
          
          <TabsContent value="alltime">
            <div className="text-center p-10 text-muted-foreground">
              <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">All-time leaderboard</h3>
              <p>View the all-time focus champions</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Leaderboard;
