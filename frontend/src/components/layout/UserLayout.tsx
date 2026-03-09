import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="fixed top-0 w-full bg-white border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-slate-900">
                Blade <span className="text-[#ED1C24]">and</span> Fade
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-800 hover:text-[#ED1C24] font-medium transition-colors">Services</a>
              <a href="#queue" className="text-slate-800 hover:text-[#ED1C24] font-medium transition-colors">Walk-In Queue</a>
              <Link to="/booking" className="bg-[#ED1C24] text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all shadow-sm">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Blade and Fade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;