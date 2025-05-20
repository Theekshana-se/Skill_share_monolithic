import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Users, MessageCircle, Calendar, Info, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { to: '/courses', label: 'Courses', icon: <BookOpen className="h-5 w-5" /> },
  { to: '/posts', label: 'Community', icon: <MessageCircle className="h-5 w-5" /> },
  { to: '/instructors', label: 'Instructors', icon: <Users className="h-5 w-5" /> },
  { to: '/events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
  { to: '/about', label: 'About', icon: <Info className="h-5 w-5" /> },
  { to: '/contact', label: 'Contact', icon: <Phone className="h-5 w-5" /> },
];

const DrawerNav = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Header with Hamburger */}
      <header className="bg-white shadow-md sticky top-0 z-20 flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-purple-700">SkillShareX</Link>
        <button
          className="md:hidden p-2 rounded hover:bg-purple-50 focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-7 w-7 text-purple-700" />
        </button>
        {/* Desktop nav (hidden on mobile) */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors font-medium ${location.pathname === link.to ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout} className="ml-2">Logout</Button>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </nav>
      </header>
      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
      )}
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: 'transform' }}
        aria-label="Navigation Drawer"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link to="/" className="text-2xl font-bold text-purple-700" onClick={() => setOpen(false)}>SkillShareX</Link>
          <button className="p-2 rounded hover:bg-purple-50" onClick={() => setOpen(false)} aria-label="Close navigation menu">
            <X className="h-7 w-7 text-purple-700" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 mt-6 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${location.pathname === link.to ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
              onClick={() => setOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-4">
          {isAuthenticated ? (
            <Button variant="outline" size="lg" onClick={logout} className="w-full">Logout</Button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="w-1/2"><Button variant="outline" size="lg" className="w-full">Login</Button></Link>
              <Link to="/signup" className="w-1/2"><Button size="lg" className="w-full">Sign Up</Button></Link>
            </div>
          )}
        </div>
      </aside>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

export default DrawerNav; 