import React from 'react';

const team = [
  {
    name: 'Jane Doe',
    role: 'Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    bio: 'Visionary leader and lifelong learner.',
  },
  {
    name: 'John Smith',
    role: 'CTO',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    bio: 'Tech enthusiast and platform architect.',
  },
  {
    name: 'Emily Brown',
    role: 'Community Manager',
    avatar: 'https://randomuser.me/api/portraits/women/92.jpg',
    bio: 'Building bridges and empowering users.',
  },
  {
    name: 'Carlos Mendez',
    role: 'Lead Designer',
    avatar: 'https://randomuser.me/api/portraits/men/93.jpg',
    bio: 'Crafting beautiful, user-friendly experiences.',
  },
];

const roadmap = [
  { year: '2022', milestone: 'SkillShareX founded with a mission to democratize learning.' },
  { year: '2023', milestone: 'Launched first 100+ courses and built a thriving community.' },
  { year: '2024', milestone: 'Introduced AI-powered search and live events.' },
  { year: 'Future', milestone: 'Expanding globally and adding more interactive features.' },
];

const About = () => (
  <div className="container mx-auto px-4 py-12">
    {/* Hero Section */}
    <div className="relative mb-12 animate-fade-in">
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
        alt="About SkillShareX"
        className="w-full h-64 object-cover rounded-xl shadow-lg mb-8 animate-fade-in"
        style={{ maxHeight: 280 }}
      />
      <h1 className="text-4xl font-bold mb-4 text-purple-700 drop-shadow-lg animate-fade-in">About SkillShareX</h1>
      <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-100 max-w-2xl mx-auto">
        Empowering everyone to learn, teach, and grow by sharing skills and knowledge in a supportive, global community.
      </p>
    </div>
    {/* Team Group Image Section */}
    <div className="mb-16 animate-fade-in">
      <img
        src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=80"
        alt="Our Team at SkillShareX"
        className="w-full max-w-3xl mx-auto h-64 object-cover rounded-2xl shadow-xl mb-4"
        style={{ maxHeight: 260 }}
      />
      <p className="text-center text-gray-500 italic">Our diverse and passionate team, united by a love for learning and sharing.</p>
    </div>
    {/* Mission, Vision, Values */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in hover:scale-105 transition-transform duration-300">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Mission" className="w-14 h-14 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Our Mission</h2>
        <p className="text-gray-500">To make learning accessible, collaborative, and lifelong for all.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in hover:scale-105 transition-transform duration-300 delay-100">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Vision" className="w-14 h-14 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Our Vision</h2>
        <p className="text-gray-500">A world where everyone can teach, learn, and thrive together.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in hover:scale-105 transition-transform duration-300 delay-200">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="Values" className="w-14 h-14 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2 text-purple-600">Our Values</h2>
        <ul className="text-gray-500 list-disc list-inside text-left">
          <li>Inclusivity</li>
          <li>Collaboration</li>
          <li>Innovation</li>
          <li>Empowerment</li>
        </ul>
      </div>
    </div>
    {/* Team Section */}
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-purple-700 mb-8 animate-fade-in">Meet the Team</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <img src={member.avatar} alt={member.name} className="w-20 h-20 mx-auto rounded-full mb-4 border-4 border-purple-100 animate-bounce" />
            <h3 className="text-lg font-semibold text-purple-700 mb-1">{member.name}</h3>
            <p className="text-purple-500 font-medium mb-1">{member.role}</p>
            <p className="text-gray-500 text-sm mb-2">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
    {/* Roadmap/Timeline Section */}
    <div className="mb-16 animate-fade-in">
      <h2 className="text-2xl font-bold text-purple-700 mb-8">Our Journey</h2>
      <div className="relative max-w-2xl mx-auto">
        <div className="border-l-4 border-purple-200 absolute h-full left-6 top-0"></div>
        <ul className="space-y-8 pl-16">
          {roadmap.map((item, idx) => (
            <li key={idx} className="relative animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="absolute left-[-38px] top-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold shadow animate-bounce">
                {item.year}
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-700 font-medium">{item.milestone}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {/* Call to Action */}
    <div className="mt-20 text-center animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Join Us on Our Mission!</h2>
      <a href="/contact">
        <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-purple-700 transition-colors animate-pulse text-lg">Contact the Team</button>
      </a>
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

export default About; 