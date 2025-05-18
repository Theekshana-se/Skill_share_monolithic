
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
import { User } from 'lucide-react';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">SkillShare</Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">Home</Link>
              <Link to="/courses" className="px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">Courses</Link>
              <Link to="/posts" className="px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">Posts</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
