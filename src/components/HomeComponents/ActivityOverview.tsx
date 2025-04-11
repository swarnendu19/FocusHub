 

const ActivityOverview = () => {
  // Mock data for months
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const days = ['', 'Tue', '', 'Thu', '', 'Sat'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Activity Overview</h2>
        <span className="text-gray-600">Total: 0h 25m</span>
      </div>

      {/* Activity Grid */}
      <div className="w-full">
        {/* Months row */}
        <div className="flex justify-between mb-2">
          {months.map((month) => (
            <span key={month} className="text-xs text-gray-600 w-8 text-center">
              {month}
            </span>
          ))}
        </div>

        {/* Days and squares grid */}
        <div className="flex">
          {/* Days column */}
          <div className="flex flex-col justify-around pr-2">
            {days.map((day) => (
              <span key={day} className="text-xs text-gray-600 h-6 flex items-center">
                {day}
              </span>
            ))}
          </div>

          {/* Activity squares */}
          <div className="flex-1">
            <div className="grid grid-cols-52 gap-1">
              {[...Array(312)].map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-gray-100 rounded-sm"
                  title="No activity"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-end items-center mt-4 text-xs text-gray-600">
          <span className="mr-2">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview; 