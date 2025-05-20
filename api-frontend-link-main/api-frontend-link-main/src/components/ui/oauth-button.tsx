import React from 'react';
import { Button } from './button';
import { FcGoogle } from 'react-icons/fc';

interface OAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function OAuthButton({ onClick, isLoading }: OAuthButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className="w-full"
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </div>
      )}
    </Button>
  );
} 