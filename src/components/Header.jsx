import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate('/ConnectPage'); 
  };

  return (
    <header className="top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-xl shadow-slate-400">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto text-[#40dad3]">
        {/* Left: Project Name */}
        <div className="flex-shrink-0">
          <span className="text-4xl font-extrabold text-red-950">ORBITLOW</span>
        </div>

        {/* Right: Connect Button */}
        <div>
          <button
            onClick={handleConnectClick}
            className="bg-[#40dad3] hover:bg-cyan-600 text-red-950 font-semibold px-4 py-2 rounded transition-colors duration-200"
          >
            Connect
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;










  


