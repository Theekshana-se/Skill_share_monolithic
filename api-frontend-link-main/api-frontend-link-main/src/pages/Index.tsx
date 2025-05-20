
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Your Skills, <span className="text-purple-600">Grow Together</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A community platform where passionate teachers meet eager learners. Exchange knowledge, build portfolios, and advance your career.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/posts">
                <Button size="lg" className="px-8">
                  Explore Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="px-8">
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Showcase your skills, experience, and expertise to attract learners.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
              <p className="text-gray-600">Post courses, tutorials, and offer your services to the community.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Grow</h3>
              <p className="text-gray-600">Engage with other users, receive feedback, and improve your skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Posts</h2>
            <Link to="/posts" className="text-purple-600 hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* These would be filled with actual data, but using placeholders for now */}
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" alt="Post" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">Web Development Mastery</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Learn modern web development with hands-on projects and real-world applications.</p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" alt="Post" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">Java Programming Fundamentals</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Master Java from scratch with comprehensive tutorials and exercises.</p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Post" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">UI/UX Design Workshop</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Create beautiful, user-friendly interfaces with modern design principles.</p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
