 import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left: Logo */}
      <div className="text-xl font-bold text-blue-600">
        TrackTime
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <a href="#">Home</a>
        <a href="#">My Projects</a>
        <a href="#">TimeLine</a>
        <a href="#">Leaderboard</a>
        <a href="#">Pricing</a>
      </div>

      {/* Right: Profile Icon */}
      <div className="relative group">
        <FaUserCircle className="text-2xl cursor-pointer text-gray-700" />
        
        {/* Dropdown (hidden by default) */}
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-red-500">Logout</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
