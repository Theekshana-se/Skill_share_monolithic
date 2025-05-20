import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: 'Priya S.',
    text: 'SkillShareX helped me land my first developer job! The community is so supportive and the courses are top-notch.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Ahmed R.',
    text: 'I love sharing my knowledge as an instructor. The platform makes it easy to connect with eager learners.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Maria G.',
    text: 'The events and webinars are fantastic. I learned so much about UI/UX design!',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'James T.',
    text: 'The AI-powered search is a game changer. I found the perfect React course in seconds!',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Sofia L.',
    text: 'I met my mentor here and now I am teaching others. The cycle of learning never ends!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Wei C.',
    text: 'The platform is so easy to use and the community is always ready to help.',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
  },
];

const Home = () => (
  <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
    {/* Hero Section */}
    <div className="relative mb-12">
      <img
        src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
        alt="Skill Sharing Hero"
        className="w-full h-72 object-cover rounded-xl shadow-lg mb-8 animate-fade-in"
        style={{ maxHeight: 320 }}
      />
      <h1 className="text-4xl font-bold mb-4 text-purple-700 drop-shadow-lg animate-fade-in">Welcome to SkillShareX!</h1>
      <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-100">
        Unlock your potential by learning and sharing skills with a vibrant community. Explore courses, join discussions, and grow together!
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12 animate-fade-in delay-200">
        <Link to="/courses"><Button size="lg">Browse Courses</Button></Link>
        <Link to="/posts"><Button size="lg" variant="outline">Community</Button></Link>
        <Link to="/instructors"><Button size="lg" variant="outline">Meet Instructors</Button></Link>
      </div>
    </div>
    {/* Highlights Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div className="bg-white rounded-lg shadow p-6 hover:scale-105 transition-transform duration-300 animate-fade-in">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Learn" className="w-16 h-16 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Learn Anything</h2>
        <p className="text-gray-500">From coding to cooking, find courses on a wide range of topics taught by passionate instructors.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 hover:scale-105 transition-transform duration-300 animate-fade-in delay-100">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Share" className="w-16 h-16 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Share Your Skills</h2>
        <p className="text-gray-500">Become an instructor and empower others by sharing your expertise and experience.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 hover:scale-105 transition-transform duration-300 animate-fade-in delay-200">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="Connect" className="w-16 h-16 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Connect & Grow</h2>
        <p className="text-gray-500">Join a supportive community, participate in events, and track your learning journey.</p>
      </div>
    </div>
    {/* Scrolling Testimonials Section */}
    <div className="mt-16 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">What Our Users Say</h2>
      <div className="relative w-full">
        <div className="marquee flex items-center gap-8 w-max">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 min-w-[320px] max-w-xs mx-2 animate-fade-in hover:shadow-xl transition-shadow duration-300">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-purple-100" />
              <p className="italic text-gray-600 mb-2">"{t.text}"</p>
              <p className="font-semibold text-purple-600">- {t.name}</p>
            </div>
          ))}
        </div>
        <style>{`
          .marquee {
            animation: marquee 32s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
    {/* Call to Action */}
    <div className="mt-20 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Ready to start your journey?</h2>
      <Link to="/signup"><Button size="lg" className="animate-pulse">Join SkillShareX Now</Button></Link>
    </div>
    {/* Animations */}
    <style>{`
      .animate-fade-in { animation: fadeIn 1s ease; }
      .animate-bounce { animation: bounce 2s infinite; }
      .animate-pulse { animation: pulse 2s infinite; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    `}</style>
  </div>
);

export default Home; 