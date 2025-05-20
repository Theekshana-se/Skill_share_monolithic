import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center animate-fade-in">Contact & Support</h1>
    {/* Telephone Emoji at the Top */}
    <div className="flex flex-col items-center mb-6 animate-fade-in">
      <div className="text-[5rem] md:text-[7rem] animate-phone-bounce select-none mb-2" style={{ filter: 'drop-shadow(0 4px 16px #a78bfa55)' }}>
        <span role="img" aria-label="landline">☎️</span>
      </div>
      <p className="text-center text-gray-400 text-sm">We're just a message away!</p>
    </div>
    {/* Contact Form Centered Below Emoji */}
    <div className="flex justify-center mb-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-14 w-full max-w-2xl border border-gray-200 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-purple-700 text-center">Contact Us</h2>
        <p className="text-gray-500 text-lg mb-8 text-center max-w-lg">Have a question, suggestion, or need help? Fill out the form below and our team will get back to you as soon as possible.</p>
        <form className="space-y-7 w-full max-w-lg">
          <Input placeholder="Your Name" required className="bg-white/90 text-lg px-6 py-4 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition" />
          <Input type="email" placeholder="Your Email" required className="bg-white/90 text-lg px-6 py-4 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition" />
          <Textarea placeholder="Your Message" rows={6} required className="bg-white/90 text-lg px-6 py-4 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition" />
          <Button type="submit" className="w-full text-lg py-3 rounded-xl bg-purple-700 hover:bg-purple-800 transition font-semibold shadow-md">Send Message</Button>
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