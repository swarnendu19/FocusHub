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
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full max-w-xs mx-auto bg-[#1A2B32] shadow-[0_4px_16px_rgba(88,204,2,0.15)] rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="font-[din-round] text-[#58CC02] text-2xl">Focus Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative flex flex-col items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#3B4F57"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#58CC02"
                strokeWidth="8"
                fill="none"
                strokeDasharray="534"
                strokeDashoffset="534"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-[#FFFFFF] font-[din-round] drop-shadow-lg">{formatTime(time)}</div>
              <Clock className="w-6 h-6 text-[#AFAFAF] mt-1" />
            </div>
          </div>
          <Select value={selectedTask} onValueChange={setSelectedTask}>
            <SelectTrigger className="w-full font-[din-round]">
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
          <div className="flex gap-2 mt-4">
            <Button
              variant="super"
              className="flex-1 font-[din-round] bg-gradient-to-r from-[#58CC02] to-[#89E219] text-white shadow-[0_4px_12px_rgba(88,204,2,0.3)] hover:from-[#58A700] hover:to-[#7BD117]"
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              disabled={!selectedTask}
            >
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="font-[din-round]"
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