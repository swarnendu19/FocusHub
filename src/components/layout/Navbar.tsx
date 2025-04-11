
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Crown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <NavLink to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1e35e573-d006-4552-9429-9212d9b8edb1.png" 
              alt="FocusHub Logo" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-bold text-blue-600">
              FocusHub
            </span>
          </NavLink>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              My Projects
            </NavLink>
            <NavLink 
              to="/timeline" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Timeline
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Leaderboard
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Pricing
            </NavLink>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-medium flex items-center">
            <span>6 days</span>
            <span className="ml-1 text-[10px]">trial left</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Crown size={16} className="text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
