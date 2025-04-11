 
const BadgeProgress = () => {
  const badges = [
    {
      id: 1,
      name: "First Focus",
      progress: 84,
      description: "25m / 30m in one session",
      icon: "🎯",
      color: "bg-indigo-500",
    },
    {
      id: 2,
      name: "Power Hour",
      progress: 42,
      description: "25m / 1h in one session",
      icon: "⚡",
      color: "bg-orange-400",
    },
    {
      id: 3,
      name: "Half Day Hero",
      progress: 21,
      description: "50m / 4h in one day",
      icon: "⬇️",
      color: "bg-emerald-500",
    },
    {
      id: 4,
      name: "Deep Work Master",
      progress: 21,
      description: "25m / 2h in one session",
      icon: "🌟",
      color: "bg-purple-500",
    },
    {
      id: 5,
      name: "Flame Starter",
      progress: 14,
      description: "1 / 7 days streak",
      icon: "🔥",
      color: "bg-red-400",
    },
    {
      id: 6,
      name: "Full Day Finisher",
      progress: 11,
      description: "50m / 8h in one day",
      icon: "🏃",
      color: "bg-blue-500",
    },
    {
      id: 7,
      name: "Flame Keeper",
      progress: 7,
      description: "1 / 14 days streak",
      icon: "⭐",
      color: "bg-yellow-400",
    },
    {
      id: 8,
      name: "Part-timer",
      progress: 4,
      description: "50m / 20h this week",
      icon: "⏰",
      color: "bg-red-500",
    },
    {
      id: 9,
      name: "Deep Work Pioneer",
      progress: 4,
      description: "50m / 24h total time",
      icon: "💫",
      color: "bg-blue-400",
    },
    {
      id: 10,
      name: "Flame Master",
      progress: 3,
      description: "1 / 30 days streak",
      icon: "🎯",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">Badge Progress</h1>
      <p className="text-gray-600 mb-6">Track your progress towards earning new badges</p>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
            {/* Badge Icon */}
            <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center text-white text-xl`}>
              {badge.icon}
            </div>

            {/* Badge Info */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{badge.name}</span>
                <span className="text-gray-600">{badge.progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${badge.progress}%` }}
                ></div>
              </div>
              
              {/* Description */}
              <span className="text-sm text-gray-600">{badge.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeProgress;
