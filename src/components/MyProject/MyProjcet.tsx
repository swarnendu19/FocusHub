 

const MyProject = () => {
  // Mock project data
  const projects = [
    {
      id: 1,
      shortName: "DS",
      name: "Dsa",
      description: "Hello There, This is DSa",
      isPrivate: false,
    },
    {
      id: 2,
      shortName: "FR",
      name: "Freelancing",
      description: "BEtmium Work on games",
      isPrivate: true,
    },
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Project Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-semibold">
                {project.shortName}
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.isPrivate && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Private
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProject;
