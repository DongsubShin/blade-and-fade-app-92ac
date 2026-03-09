import React from 'react';
import { useBookings } from '../../hooks/useBookings';

const DashboardPage: React.FC = () => {
  const { data: bookings, isLoading } = useBookings();

  const stats = [
    { label: 'Today\'s Bookings', value: bookings?.length || 0, icon: 'calendar' },
    { label: 'Queue Length', value: '4', icon: 'users' },
    { label: 'Revenue (Today)', value: '$420.00', icon: 'dollar' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
          <button className="text-sm text-[#ED1C24] font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : (
                bookings?.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{booking.client?.firstName} {booking.client?.lastName}</td>
                    <td className="px-6 py-4">{booking.service?.name}</td>
                    <td className="px-6 py-4">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;