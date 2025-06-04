
/**
 * Enhanced Profile preview component
 * Interactive demonstration of how a user's StacksBio profile appears to visitors
 */

import React, { useState } from 'react';
import { UserProfile, Link } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, BarChart3, Heart, Share } from 'lucide-react';

interface ProfilePreviewProps {
  profile: UserProfile;
  links: Link[];
  className?: string;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile, links, className }) => {
  const [likedLinks, setLikedLinks] = useState<Set<string>>(new Set());
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  /**
   * Handle link click for analytics tracking with visual feedback
   */
  const handleLinkClick = (link: Link) => {
    console.log(`Link clicked: ${link.title} -> ${link.url}`);
    // Add click animation or feedback here
  };

  /**
   * Handle like toggle for links
   */
  const handleLikeTolgle = (linkId: string) => {
    setLikedLinks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(linkId)) {
        newSet.delete(linkId);
      } else {
        newSet.add(linkId);
      }
      return newSet;
    });
  };

  return (
    <div className={`max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all-smooth ${className}`}>
      {/* Enhanced profile header */}
      <div 
        className="relative p-8 text-center overflow-hidden"
        style={{ backgroundColor: profile.theme.backgroundColor }}
      >
        {/* Enhanced background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-40 h-40 bg-gradient-to-br from-stacksYellow via-stacksBlue to-stacksNavy rounded-full absolute -top-20 -right-20 animate-spin-slow"></div>
          <div className="w-32 h-32 bg-gradient-to-br from-stacksBlue to-stacksNavy rounded-full absolute -bottom-16 -left-16 animate-pulse"></div>
          <div className="w-24 h-24 bg-stacksYellow/50 rounded-full absolute top-1/2 left-1/4 animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Enhanced profile content */}
        <div className="relative z-10">
          {/* Enhanced avatar */}
          <div className="relative w-28 h-28 mx-auto mb-6 group">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stacksYellow to-stacksBlue flex items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>

          {/* Enhanced name and verification */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 
              className="text-3xl font-black"
              style={{ color: profile.theme.textColor }}
            >
              {profile.displayName}
            </h1>
            {profile.isVerified && (
              <div className="bg-blue-500 text-white p-1 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Username */}
          <p className="text-gray-500 mb-4 font-medium">@{profile.username}</p>

          {/* Enhanced bio */}
          {profile.bio && (
            <p 
              className="text-sm leading-relaxed max-w-xs mx-auto mb-6 font-medium"
              style={{ color: profile.theme.textColor }}
            >
              {profile.bio}
            </p>
          )}

          {/* Profile stats */}
          <div className="flex justify-center space-x-6 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-stacksNavy">2.3K</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-stacksNavy">12.5K</div>
              <div className="text-xs text-gray-500">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-stacksNavy">156</div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced links section */}
      <div className="p-6 space-y-4">
        {links
          .filter(link => link.isActive)
          .sort((a, b) => a.order - b.order)
          .map((link) => {
            const isHovered = hoveredLink === link.id;
            const isLiked = likedLinks.has(link.id);
            
            return (
              <div
                key={link.id}
                className="group relative"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 border-2 hover:scale-105 transition-all-smooth cursor-pointer relative overflow-hidden"
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
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center space-x-4">
                      {link.icon && (
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {link.icon}
                        </span>
                      )}
                      <div className="text-left">
                        <div className="font-bold text-lg">{link.title}</div>
                        {link.description && (
                          <div className="text-sm opacity-75 mt-1">
                            {link.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <ExternalLink className={`h-5 w-5 transition-transform ${
                        isHovered ? 'translate-x-1 -translate-y-1' : ''
                      }`} />
                    </div>
                  </div>
                </Button>

                {/* Link interaction buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeTolgle(link.id);
                    }}
                    className={`p-1 rounded-full backdrop-blur-sm transition-colors ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-1 rounded-full bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500 backdrop-blur-sm transition-colors">
                    <Share className="h-3 w-3" />
                  </button>
                </div>

                {/* Link stats */}
                <div className="absolute bottom-2 right-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                  {link.clickCount} clicks
                </div>
              </div>
            );
          })}

        {links.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ExternalLink className="h-8 w-8" />
            </div>
            <p className="font-semibold">No links added yet</p>
            <p className="text-sm mt-2">Add some links to get started!</p>
          </div>
        )}
      </div>

      {/* Enhanced footer */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 1000)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Powered by StacksBio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
