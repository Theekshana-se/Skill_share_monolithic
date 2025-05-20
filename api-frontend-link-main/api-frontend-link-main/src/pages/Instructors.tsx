import React from 'react';
import { Button } from '@/components/ui/button';

const instructors = [
  {
    name: 'Alice Johnson',
    expertise: 'Web Development',
    bio: 'Full-stack developer and passionate teacher. Loves React and Node.js.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    courses: 8,
    rating: 4.9,
  },
  {
    name: 'Bob Lee',
    expertise: 'Data Science',
    bio: 'Data scientist with 10+ years of experience. Python and ML enthusiast.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    courses: 5,
    rating: 4.8,
  },
  {
    name: 'Carla Smith',
    expertise: 'Graphic Design',
    bio: 'Award-winning designer and mentor. Figma and Adobe expert.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    courses: 6,
    rating: 4.7,
  },
  {
    name: 'James T.',
    expertise: 'Mobile Development',
    bio: 'Android/iOS developer. Loves teaching Flutter and React Native.',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    courses: 4,
    rating: 4.8,
  },
  {
    name: 'Sofia L.',
    expertise: 'UI/UX Design',
    bio: 'UI/UX specialist. Passionate about user-centered design.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    courses: 7,
    rating: 4.9,
  },
  {
    name: 'Wei C.',
    expertise: 'Cloud Computing',
    bio: 'Cloud architect and DevOps mentor. AWS and Azure certified.',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    courses: 3,
    rating: 4.6,
  },
];

const Instructors = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center animate-fade-in">Meet Our Instructors</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {instructors.map((inst, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <img src={inst.avatar} alt={inst.name} className="w-20 h-20 mx-auto rounded-full mb-4 border-4 border-purple-100 animate-bounce" />
          <h2 className="text-xl font-semibold mb-1 text-purple-700">{inst.name}</h2>
          <p className="text-purple-500 font-medium mb-2">{inst.expertise}</p>
          <p className="text-gray-500 mb-2">{inst.bio}</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{inst.courses} Courses</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">⭐ {inst.rating}</span>
          </div>
        </div>
      ))}
    </div>
    {/* Become an Instructor Section */}
    <div className="mt-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl shadow-lg p-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
      <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Become Instructor" className="w-40 h-40 object-cover rounded-full shadow-lg mb-4 md:mb-0 animate-bounce" />
      <div className="text-left">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Become an Instructor</h2>
        <p className="text-gray-600 mb-4 max-w-md">Share your expertise, inspire learners, and earn recognition. Join our growing team of passionate instructors and make a difference in the world of skill sharing!</p>
        <a href="/contact">
          <Button size="lg" className="animate-pulse">Apply Now</Button>
        </a>
      </div>
    </div>
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

export default Instructors; 