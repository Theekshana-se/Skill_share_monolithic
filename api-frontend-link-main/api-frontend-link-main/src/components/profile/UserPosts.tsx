import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Post as BasePost } from '@/api/postService';
import { toast } from '@/components/ui/use-toast';
import { postService } from '@/api/postService';

interface Post extends BasePost {
  imageBase64?: string;
}

interface UserPostsProps {
  posts: Post[];
  isOwnProfile: boolean;
  onDeletePost: (postId: string) => void;
}

const UserPosts = ({ posts, isOwnProfile, onDeletePost }: UserPostsProps) => {
  const handleDeletePost = async (postId: string) => {
    toast({
      title: "Delete Post",
      description: "Are you sure you want to delete this post? This action cannot be undone.",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              await postService.deletePost(postId);
              onDeletePost(postId);
              toast({
                title: "Post deleted",
                description: "Your post has been successfully deleted.",
                className: "bg-green-50 border-green-200",
              });
            } catch (error) {
              console.error('Error deleting post:', error);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete post. Please try again.",
              });
            }
          }}
        >
          Confirm Delete
        </Button>
      ),
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>My Posts</CardTitle>
        {isOwnProfile && (
          <Link to="/create-post">
            <Button size="sm" className="ml-auto">Add Post</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                {post.imageBase64 && (
                  <div className="h-32 bg-gray-200 overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${post.imageBase64}`} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold mb-1">{post.title}</h3>
                    <div className="flex gap-2">
                      <Link to={`/posts/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      {isOwnProfile && (
                        <>
                          <Link to={`/posts/${post.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeletePost(post.id!)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
        
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPosts;
