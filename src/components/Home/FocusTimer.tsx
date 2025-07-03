import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";




const FocusTimer = () => {

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

  return (
    <div> 
         <Card>
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              
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

    </div>
  )
}

export default FocusTimer