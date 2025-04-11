
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Code, Pencil, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Generate dummy timeline data
const generateTimelineData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random session count for each day
    const sessionCount = Math.floor(Math.random() * 4);
    const sessions = [];
    
    for (let j = 0; j < sessionCount; j++) {
      const types = ['Coding', 'Design', 'Reading'];
      const type = types[Math.floor(Math.random() * types.length)];
      const duration = Math.floor(Math.random() * 120) + 15; // 15 to 135 minutes
      
      sessions.push({
        id: `session-${i}-${j}`,
        type,
        duration,
        startTime: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        icon: type === 'Coding' ? <Code className="h-4 w-4" /> :
              type === 'Design' ? <Pencil className="h-4 w-4" /> : 
              <Book className="h-4 w-4" />
      });
    }
    
    data.push({
      date,
      sessions
    });
  }
  
  return data;
};

const Timeline = () => {
  const timelineData = generateTimelineData();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  return (
    <div className="min-h-screen bg-focus-dark text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Timeline</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                This Week
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">View your focus sessions over time</p>
        </div>
        
        <div className="space-y-6">
          {timelineData.map((day, index) => (
            <Card key={index} className="neon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{formatDate(day.date)}</CardTitle>
              </CardHeader>
              <CardContent>
                {day.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {day.sessions.map((session) => (
                      <div key={session.id} className="flex items-center p-3 rounded-lg bg-focus-dark/60 border border-focus-purple/20">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${session.type === 'Coding' ? 'bg-focus-aqua' : 
                            session.type === 'Design' ? 'bg-focus-purple' : 'bg-focus-gold'}`}>
                          {session.icon}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium">{session.type}</div>
                          <div className="text-sm text-muted-foreground">Started at {session.startTime}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatMinutes(session.duration)}</div>
                          <div className="text-xs text-focus-aqua">Completed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No focus sessions on this day
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Timeline;
