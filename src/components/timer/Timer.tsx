
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimerProps = {
  onTimeUpdate?: (seconds: number) => void;
};

const Timer = ({ onTimeUpdate }: TimerProps) => {
  const [time, setTime] = useState(30 * 60); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Preset durations in seconds
  const presets = [
    { label: '30m', value: 30 * 60 },
    { label: '1h', value: 60 * 60 },
    { label: '2h', value: 120 * 60 },
  ];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          if (newTime === 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
          }
          
          if (onTimeUpdate) {
            onTimeUpdate(prevTime - newTime);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const selectPreset = (presetValue: number) => {
    setTime(presetValue);
    setIsRunning(false);
  };

  return (
    <div className="neon-card p-6 flex flex-col items-center">
      <div className="relative mb-6 w-48 h-48 rounded-full flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div 
          className={`absolute inset-0 rounded-full border-4 border-t-focus-purple border-r-focus-aqua border-b-focus-aqua border-l-focus-purple ${isRunning ? 'animate-spin' : ''}`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div className="absolute inset-2 rounded-full bg-focus-dark flex flex-col items-center justify-center">
          <div className="text-4xl font-mono font-bold text-white">
            {formatTime(time)}
          </div>
          <Clock className="mt-2 text-focus-aqua/70" size={24} />
        </div>
      </div>

      <div className="w-full mb-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="bg-focus-dark/60 border-focus-purple/30 text-white">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design">UI Design</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 mb-4 w-full">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className={`flex-1 border-focus-purple/30 hover:border-focus-purple ${time === preset.value && !isRunning ? 'bg-focus-purple/20 border-focus-purple' : 'bg-focus-dark/60'}`}
            onClick={() => selectPreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <Button 
        className={`w-full text-white ${isRunning ? 'bg-focus-red hover:bg-focus-red/90' : 'bg-focus-purple hover:bg-focus-purple/90'} glow`}
        onClick={toggleTimer}
      >
        {isRunning ? (
          <>
            <Pause className="mr-2" size={18} />
            Pause Timer
          </>
        ) : (
          <>
            <Play className="mr-2" size={18} />
            Start Timer
          </>
        )}
      </Button>
    </div>
  );
};

export default Timer;
