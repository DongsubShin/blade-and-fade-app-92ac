import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navItems = [
    { to: '/admin', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
    { to: '/admin/queue', icon: 'lucide:users', label: 'Live Queue' },
    { to: '/admin/clients', icon: 'lucide:contact-2', label: 'Clients' },
    { to: '/admin/analytics', icon: 'lucide:bar-chart-3', label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-6">
          <span className="text-[#ED1C24] font-bold text-xl tracking-tight">Blade and Fade</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-red-50 text-[#ED1C24]' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg" /> {/* Iconify icon would go here */}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;