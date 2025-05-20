import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken, setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userDataParam = searchParams.get('userData');

    if (token && userDataParam) {
      try {
        // Parse the user data
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        
        // Update auth context with token and user data
        loginWithToken(token);
        setUser(userData);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userData.name}!`,
        });
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        toast({
          title: 'Login Failed',
          description: 'Error processing login data. Please try again.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    } else {
      toast({
        title: 'Login Failed',
        description: 'Could not complete Google login. Please try again.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [searchParams, navigate, toast, loginWithToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default OAuth2Callback; 