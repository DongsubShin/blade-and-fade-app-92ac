import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div>
      <section id="home" className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-[#ED1C24] font-bold text-xs uppercase tracking-wider mb-4">
                Est. 2024 • Premium Grooming
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Precision Cuts for the <span className="text-[#ED1C24]">Modern Gentleman.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Experience the art of barbering. From classic fades to modern styling, 
                we provide top-tier grooming services tailored to your style.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking" className="px-8 py-4 bg-[#ED1C24] text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg">
                  Book Appointment
                </Link>
                <a href="#queue" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-all">
                  Join Walk-in Queue
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80')] bg-cover bg-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Classic Fade', price: '$35', time: '45 mins' },
              { name: 'Beard Trim', price: '$25', time: '30 mins' },
              { name: 'Full Service', price: '$55', time: '75 mins' }
            ].map((service) => (
              <div key={service.name} className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <div className="flex justify-between items-center text-slate-600">
                  <span>{service.time}</span>
                  <span className="text-[#ED1C24] font-bold">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;