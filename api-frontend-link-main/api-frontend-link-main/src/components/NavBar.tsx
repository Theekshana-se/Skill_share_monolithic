import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Home, BookOpen, Users, MessageCircle, Calendar, Info, Phone } from 'lucide-react';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed left-1/2 top-6 z-50 -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-2xl rounded-full px-8 py-3 max-w-5xl w-[90vw] flex items-center border border-gray-200">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="text-2xl font-bold text-purple-700">SkillShareX</Link>
      </div>
      {/* Navigation Tabs */}
      <div className="hidden md:flex flex-1 justify-center mx-8">
        <div className="flex space-x-2">
          <Link to="/" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><Home className="h-5 w-5" />Home</Link>
          <Link to="/courses" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><BookOpen className="h-5 w-5" />Courses</Link>
          <Link to="/posts" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><MessageCircle className="h-5 w-5" />Community</Link>
          <Link to="/instructors" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><Users className="h-5 w-5" />Instructors</Link>
          <Link to="/events" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><Calendar className="h-5 w-5" />Events</Link>
          <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><Info className="h-5 w-5" />About</Link>
          <Link to="/contact" className="px-3 py-2 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-2"><Phone className="h-5 w-5" />Contact</Link>
        </div>
      </div>
      {/* User/Profile or Login/Signup Buttons */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/profile/${user?.id || '1'}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/profile/${user?.id || '1'}?tab=courses`}>
                My Courses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/profile/${user?.id || '1'}?tab=posts`}>
                My Posts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
// NOTE: To prevent content from being cut off by the floating navbar, add 'pt-32' or 'mt-32' to your main content wrapper in App.tsx or your main layout.
