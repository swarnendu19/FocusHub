
import { useMemo } from "react";

export function ActivityChart() {
  // Generate mock data for the last 365 days
  const contributionData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random activity level (0-4)
      const level = Math.floor(Math.random() * 5);
      data.push({
        date: date.toISOString().split('T')[0],
        level,
        count: level * Math.floor(Math.random() * 3) + level
      });
    }
    
    return data;
  }, []);

  // Group data by weeks
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < contributionData.length; i += 7) {
      result.push(contributionData.slice(i, i + 7));
    }
    return result;
  }, [contributionData]);

  const getLevelClass = (level: number) => {
    return `contribution-level-${level}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Activity in the last year
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`contribution-box ${getLevelClass(day.level)}`}
                  title={`${day.date}: ${day.count} hours focused`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`contribution-box ${getLevelClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
