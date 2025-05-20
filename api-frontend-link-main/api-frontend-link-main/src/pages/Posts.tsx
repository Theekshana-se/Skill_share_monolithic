import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '@/api/postService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPostImage = (post: Post) => {
    if (post.imageBase64) {
      return (
        <img 
          src={`data:image/jpeg;base64,${post.imageBase64}`}
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <img 
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
        alt={post.title} 
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Browse Posts</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {isAuthenticated && (
            <Link to="/create-post">
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-5 w-5" />
                Create Post
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 w-2/3 bg-gray-200 animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-4/5"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="no-underline">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {renderPostImage(post)}
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </CardContent>
                <CardFooter className="px-4 py-3 bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">{post.slogan}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No posts found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or create a new post</p>
          {isAuthenticated && (
            <Link to="/create-post" className="mt-6 inline-block">
              <Button>Create Post</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
