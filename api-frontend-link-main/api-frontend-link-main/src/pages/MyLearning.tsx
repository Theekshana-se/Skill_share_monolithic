import React from 'react';
import { Progress } from '@/components/ui/progress';

const MyLearning = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center">My Learning</h1>
    <div className="bg-white rounded-lg shadow p-8 mb-8">
      <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
      <p className="text-gray-500 mb-4">You are currently enrolled in 3 courses.</p>
      <div className="mb-4">
        <span className="font-medium">React for Beginners</span>
        <Progress value={60} className="h-2 mt-2" />
        <span className="text-sm text-gray-500">60% complete</span>
      </div>
      <div className="mb-4">
        <span className="font-medium">Data Science 101</span>
        <Progress value={40} className="h-2 mt-2" />
        <span className="text-sm text-gray-500">40% complete</span>
      </div>
      <div>
        <span className="font-medium">UI/UX Design Basics</span>
        <Progress value={80} className="h-2 mt-2" />
        <span className="text-sm text-gray-500">80% complete</span>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-semibold mb-2">Achievements</h2>
      <ul className="list-disc list-inside text-gray-500">
        <li>Completed 5 courses</li>
        <li>Earned "React Pro" badge</li>
        <li>Top 10% in Data Science</li>
      </ul>
    </div>
  </div>
);

export default MyLearning; 