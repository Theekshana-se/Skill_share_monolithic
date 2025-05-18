
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/api/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Edit, MapPin, Mail, User as UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => {
  return (
    <Card className="mb-6 overflow-hidden">
      {user?.coverPhotoUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={user.coverPhotoUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className={`p-6 ${!user?.coverPhotoUrl ? '' : '-mt-16'}`}>
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32 border-4 border-white">
            {user?.profilePhotoUrl ? (
              <img 
                src={user.profilePhotoUrl} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-4xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user?.name}</h1>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
              
              {isOwnProfile && (
                <Link to={`/profile/edit/${user.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              {user?.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-1" />
                <span>{user?.email}</span>
              </div>
              {user?.age && (
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{user.age} years old</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
