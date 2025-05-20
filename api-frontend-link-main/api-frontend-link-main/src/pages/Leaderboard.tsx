import React from 'react';

const learners = [
  { name: 'Alice Johnson', points: 1200 },
  { name: 'Bob Lee', points: 1100 },
  { name: 'Carla Smith', points: 1050 },
];
const instructors = [
  { name: 'Jane Doe', badge: 'Top Mentor' },
  { name: 'John Smith', badge: 'Expert Instructor' },
];

const Leaderboard = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center">Leaderboard</h1>
    <div className="bg-white rounded-lg shadow p-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">Top Learners</h2>
      <ol className="list-decimal list-inside text-gray-700">
        {learners.map((l, idx) => (
          <li key={idx} className="mb-2">{l.name} <span className="text-purple-500 font-medium">{l.points} pts</span></li>
        ))}
      </ol>
    </div>
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-semibold mb-4">Top Instructors</h2>
      <ul className="list-disc list-inside text-gray-700">
        {instructors.map((i, idx) => (
          <li key={idx} className="mb-2">{i.name} <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs ml-2">{i.badge}</span></li>
        ))}
      </ul>
    </div>
  </div>
);

export default Leaderboard; 