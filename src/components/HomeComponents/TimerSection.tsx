


const TimerSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[300px]">
        {/* Timer Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Outer circle - gray background */}
          <div className="w-full h-full rounded-full bg-gray-200">
            {/* Blue progress arc - this would be animated in a real timer */}
            <div className="absolute top-0 right-0 w-16 h-16 border-8 border-blue-400 rounded-full border-r-transparent border-b-transparent rotate-45"></div>
          </div>
          
          {/* Timer Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-mono font-bold">102:25</div>
            <div className="mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown (Static) */}
        <div className="mb-6">
          <select className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
            <option>DSA</option>
            <option>Coding</option>
            <option>Reading</option>
          </select>
        </div>

        {/* Time Selection Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
            30m
          </button>
          <button className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
            1h
          </button>
          <button className="py-2 px-4 rounded-lg bg-blue-400 text-white hover:bg-blue-500">
            2h
          </button>
        </div>

        {/* Stop Timer Button */}
        <button className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          Stop Timer
        </button>
      </div>
    </div>
  );
};

export default TimerSection;
