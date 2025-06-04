
/**
 * Profile preview component
 * Shows how a user's StacksBio profile will look to visitors
 */

import React from 'react';
import { UserProfile, Link } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfilePreviewProps {
  profile: UserProfile;
  links: Link[];
  className?: string;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile, links, className }) => {
  /**
   * Handle link click for analytics tracking
   * TODO: Implement actual click tracking
   */
  const handleLinkClick = (link: Link) => {
    console.log(`Link clicked: ${link.title} -> ${link.url}`);
    // Analytics tracking will be implemented here
  };

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Profile header */}
      <div 
        className="relative p-8 text-center"
        style={{ backgroundColor: profile.theme.backgroundColor }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="w-32 h-32 bg-gradient-to-br from-stacksYellow to-stacksBlue rounded-full absolute -top-16 -right-16"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-stacksBlue to-stacksNavy rounded-full absolute -bottom-12 -left-12"></div>
        </div>

        {/* Profile content */}
        <div className="relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stacksYellow to-stacksBlue flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and verification */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 
              className="text-2xl font-bold"
              style={{ color: profile.theme.textColor }}
            >
              {profile.displayName}
            </h1>
            {profile.isVerified && (
              <span className="text-stacksBlue">✓</span>
            )}
          </div>

          {/* Username */}
          <p className="text-gray-500 mb-3">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p 
              className="text-sm leading-relaxed max-w-xs mx-auto"
              style={{ color: profile.theme.textColor }}
            >
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Links section */}
      <div className="p-6 space-y-4">
        {links
          .filter(link => link.isActive)
          .sort((a, b) => a.order - b.order)
          .map((link) => (
            <Button
              key={link.id}
              variant="outline"
              className="w-full h-auto p-4 border-2 hover:scale-105 transition-all-smooth cursor-pointer"
              style={{
                backgroundColor: link.style.backgroundColor,
                color: link.style.textColor,
                borderColor: link.style.borderColor || link.style.backgroundColor,
                borderRadius: 
                  link.style.borderRadius === 'none' ? '0' :
                  link.style.borderRadius === 'sm' ? '0.375rem' :
                  link.style.borderRadius === 'md' ? '0.5rem' :
                  link.style.borderRadius === 'lg' ? '0.75rem' :
                  link.style.borderRadius === 'full' ? '9999px' : '0.5rem'
              }}
              onClick={() => handleLinkClick(link)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {link.icon && (
                    <span className="text-xl">{link.icon}</span>
                  )}
                  <div className="text-left">
                    <div className="font-semibold">{link.title}</div>
                    {link.description && (
                      <div className="text-xs opacity-75 mt-1">
                        {link.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-50">
                  {link.clickCount} clicks
                </div>
              </div>
            </Button>
          ))}

        {links.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No links added yet</p>
            <p className="text-sm mt-2">Add some links to get started!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-center">
        <div className="text-xs text-gray-400 mb-2">
          Powered by StacksBio
        </div>
        <div className="flex justify-center space-x-4 text-xs text-gray-500">
          <span>👀 {Math.floor(Math.random() * 1000)} views</span>
          <span>📊 Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
