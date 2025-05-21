import React from 'react';

const events = [
  {
    title: 'React Live Q&A',
    date: '2024-06-20',
    desc: 'Join our experts for a live React Q&A session.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Data Science Bootcamp',
    date: '2024-06-25',
    desc: 'A hands-on bootcamp for aspiring data scientists.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'UI/UX Design Workshop',
    date: '2024-07-01',
    desc: 'Learn the fundamentals of UI/UX design.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Cloud Careers Panel',
    date: '2024-07-10',
    desc: 'Hear from top cloud professionals about career paths and certifications.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Mobile App Hackathon',
    date: '2024-07-15',
    desc: 'Build and launch your first mobile app in a weekend!',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
];

const Events = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center animate-fade-in">Upcoming Events</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-0 overflow-hidden hover:scale-105 transition-transform duration-300 animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-purple-600">{event.title}</h2>
            <p className="text-gray-500 mb-1 font-medium">{event.date}</p>
            <p className="text-gray-600 mb-4">{event.desc}</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-purple-700 transition-colors animate-pulse">Register</button>
          </div>
        </div>
      ))}
    </div>
    <style>{`
      .animate-fade-in { animation: fadeIn 1s ease; }
      .animate-pulse { animation: pulse 2s infinite; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    `}</style>
  </div>
);

export default Events; 