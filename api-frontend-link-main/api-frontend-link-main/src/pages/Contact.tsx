import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center animate-fade-in">Contact & Support</h1>
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-8 max-w-3xl mx-auto animate-fade-in">
      {/* Landline Phone Emoji Animation */}
      <div className="flex-shrink-0 mb-8 md:mb-0 flex flex-col items-center">
        <div className="text-[5rem] md:text-[7rem] animate-phone-bounce select-none" style={{ filter: 'drop-shadow(0 4px 16px #a78bfa55)' }}>
          <span role="img" aria-label="landline">☎️</span>
        </div>
        <p className="text-center text-gray-400 text-sm mt-2">We're just a message away!</p>
      </div>
      {/* Contact Form Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-100">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Contact Us</h2>
        <form className="space-y-5">
          <Input placeholder="Your Name" required className="bg-white/80" />
          <Input type="email" placeholder="Your Email" required className="bg-white/80" />
          <Textarea placeholder="Your Message" rows={4} required className="bg-white/80" />
          <Button type="submit" className="w-full text-lg py-2">Send Message</Button>
        </form>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow p-8 max-w-xl mx-auto animate-fade-in border border-purple-100">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Frequently Asked Questions</h2>
      <ul className="list-disc list-inside text-gray-500">
        <li>How do I enroll in a course? <span className="block text-gray-400">Go to Courses, select a course, and click Enroll.</span></li>
        <li>How can I become an instructor? <span className="block text-gray-400">Contact us with your expertise and we'll get in touch!</span></li>
        <li>How do I reset my password? <span className="block text-gray-400">Use the Forgot Password link on the login page.</span></li>
      </ul>
    </div>
    <style>{`
      .animate-fade-in { animation: fadeIn 1s ease; }
      .animate-phone-bounce { animation: phoneBounce 2.5s infinite; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      @keyframes phoneBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
    `}</style>
  </div>
);

export default Contact; 