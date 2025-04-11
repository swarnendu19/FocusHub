 
const CommunitySection = () => {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      user: "swarnendu",
      avatar: "🔴",
      project: "Dsa",
      duration: "25 mins",
      message: "Done",
      timeAgo: "16 minutes ago"
    },
    {
      id: 2,
      user: "swarnendu",
      avatar: "🔴",
      project: "Dsa",
      duration: "13 mins",
      message: "Another one",
      timeAgo: "43 minutes ago"
    },
    {
      id: 3,
      user: "gabrieltodirenchi",
      avatar: "👔",
      project: "Storytelling Youtube channel",
      duration: "29 mins",
      message: "generating some scripts",
      timeAgo: "about 1 hour ago"
    }
  ];

  // Mock data for badge awards
  const badgeAwards = [
    {
      id: 1,
      user: "user_KLNvy",
      avatar: "👤",
      badge: "Welcome",
      badgeIcon: "✅",
      timeAgo: "about 3 hours ago"
    },
    {
      id: 2,
      user: "swarnendu",
      avatar: "🔴",
      badge: "Welcome",
      badgeIcon: "✅",
      timeAgo: "about 8 hours ago"
    },
    {
      id: 3,
      user: "thisyousuf",
      avatar: "👤",
      badge: "Flame Master",
      badgeIcon: "🟣",
      timeAgo: "about 9 hours ago"
    },
    {
      id: 4,
      user: "user_w6iri",
      avatar: "👤",
      badge: "Welcome",
      badgeIcon: "✅",
      timeAgo: "about 1 day ago"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Community Timeline</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{activity.user}</span>
                      <span className="text-gray-600">Worked on</span>
                      <span className="text-blue-600">{activity.project}</span>
                      <span className="text-gray-600">for {activity.duration}</span>
                    </div>
                    <p className="text-gray-800 mt-1">{activity.message}</p>
                    <span className="text-sm text-gray-500 mt-2 block">{activity.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Badge Awards Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Badge Awards</h2>
          <div className="space-y-4">
            {badgeAwards.map((award) => (
              <div key={award.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {award.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{award.user}</span>
                        <span className="text-gray-600">Earned the</span>
                        <span className="text-blue-600">{award.badge}</span>
                        <span className="text-gray-600">badge</span>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        {award.badgeIcon}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 block">{award.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
