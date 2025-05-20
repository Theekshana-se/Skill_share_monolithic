import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  description: string;
  slogan: string;
  userEmail: string;
  imageBase64: string | null;
  createdAt: string;
}

interface PostListProps {
  userEmail?: string;
  refreshTrigger?: number;
}

const PostList: React.FC<PostListProps> = ({ userEmail, refreshTrigger }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = userEmail
          ? `http://localhost:8080/api/posts?userEmail=${encodeURIComponent(userEmail)}`
          : 'http://localhost:8080/api/posts';

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userEmail, refreshTrigger]);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500">No posts found.</div>;
  }

  const renderImage = (post: Post) => {
    if (!post.imageBase64) return null;

    // Handle the base64 string directly
    try {
      return (
        <div className="mb-4">
          <img
            src={`data:image/jpeg;base64,${post.imageBase64}`}
            alt={post.title}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              console.error('Error loading image');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    } catch (error) {
      console.error('Error rendering image:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{post.title}</CardTitle>
              {user?.email === post.userEmail && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Posted by {post.userEmail} on {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            {renderImage(post)}
            <div className="space-y-2">
              <p className="font-semibold text-purple-600">{post.slogan}</p>
              <p className="text-gray-700">{post.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList; 