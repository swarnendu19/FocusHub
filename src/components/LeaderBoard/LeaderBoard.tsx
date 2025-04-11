 
const LeaderBoard = () => {
  // Mock data for focused time leaders
  const focusedTimeLeaders = [
    {
      id: 1,
      rank: 1,
      username: "thisyousuf",
      avatar: "/avatars/thisyousuf.jpg",
      time: "25h 41m",
      backgroundColor: "bg-yellow-50"
    },
    {
      id: 2,
      rank: 2,
      username: "Abdul_Basit",
      avatar: "/avatars/abdul.jpg",
      time: "16h 43m",
      backgroundColor: "bg-gray-50"
    },
    {
      id: 3,
      rank: 3,
      username: "gabrieltodirenchi",
      avatar: "/avatars/gabriel.jpg",
      time: "11h 7m",
      backgroundColor: "bg-orange-50"
    }
  ];

  // Mock data for streak leaders
  const streakLeaders = [
    {
      id: 1,
      rank: 1,
      username: "FlorinPop17",
      avatar: "/avatars/florin.jpg",
      days: "68 days",
      backgroundColor: "bg-yellow-50"
    },
    {
      id: 2,
      rank: 2,
      username: "GabiM22",
      avatar: "/avatars/gabi.jpg",
      days: "48 days",
      backgroundColor: "bg-gray-50"
    },
    {
      id: 3,
      rank: 3,
      username: "thisyousuf",
      avatar: "/avatars/thisyousuf.jpg",
      days: "30 days",
      backgroundColor: "bg-orange-50"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Top Active Members</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Focused Time Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Focused Time</h2>
          
          {/* Time Period Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button className="px-4 py-2 rounded-md bg-white font-medium shadow-sm">Weekly</button>
            <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-white/50">Monthly</button>
            <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-white/50">All Time</button>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {focusedTimeLeaders.map((leader) => (
              <div key={leader.id} className={`${leader.backgroundColor} rounded-lg p-4 flex items-center gap-4`}>
                {/* Rank Medal */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-500">🏆</span>
                  <span className="absolute text-xs font-bold">{leader.rank}</span>
                </div>
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  <img src={leader.avatar} alt={leader.username} className="w-full h-full object-cover" />
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">{leader.username}</h3>
                  <p className="text-gray-600">{leader.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streaks Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Streaks</h2>
          
          {/* Time Period Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button className="px-4 py-2 rounded-md bg-white font-medium shadow-sm">Current</button>
            <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-white/50">All-Time</button>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {streakLeaders.map((leader) => (
              <div key={leader.id} className={`${leader.backgroundColor} rounded-lg p-4 flex items-center gap-4`}>
                {/* Rank Medal */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-500">🏆</span>
                  <span className="absolute text-xs font-bold">{leader.rank}</span>
                </div>
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  <img src={leader.avatar} alt={leader.username} className="w-full h-full object-cover" />
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">{leader.username}</h3>
                  <p className="text-gray-600">{leader.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
