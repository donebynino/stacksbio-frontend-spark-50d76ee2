/**
 * Dashboard component for profile and link management
 * Demonstrates the integration between frontend and smart contracts
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { useLinks } from '@/hooks/useLinks';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Link as LinkIcon, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  BarChart3,
  Palette,
  Settings
} from 'lucide-react';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const { walletState } = useWallet();
  const { 
    profile, 
    isLoading: profileLoading, 
    createProfile, 
    updateProfile,
    checkUsernameAvailability 
  } = useProfile();
  const { 
    links, 
    isLoading: linksLoading, 
    addLink, 
    updateLink, 
    deleteLink 
  } = useLinks(profile?.id);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'analytics'>('profile');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatarUrl: ''
  });

  // Check if user needs to create a profile
  useEffect(() => {
    if (walletState.isConnected && !profile && !profileLoading) {
      setIsCreatingProfile(true);
    }
  }, [walletState.isConnected, profile, profileLoading]);

  const handleCreateProfile = async () => {
    if (!profileForm.username || !profileForm.displayName) {
      toast({
        title: "Error",
        description: "Username and display name are required",
        variant: "destructive"
      });
      return;
    }

    // Check username availability
    const isAvailable = await checkUsernameAvailability(profileForm.username);
    if (!isAvailable) {
      toast({
        title: "Error",
        description: "Username is not available",
        variant: "destructive"
      });
      return;
    }

    const result = await createProfile({
      username: profileForm.username,
      displayName: profileForm.displayName,
      bio: profileForm.bio || undefined,
      avatarUrl: profileForm.avatarUrl || undefined
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Profile created successfully!",
      });
      setIsCreatingProfile(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create profile",
        variant: "destructive"
      });
    }
  };

  const handleAddLink = async () => {
    const newLink = {
      title: 'New Link',
      url: 'https://example.com',
      description: 'Add your description here',
      icon: '🔗',
      isActive: true,
      order: links.length + 1,
      style: {
        backgroundColor: '#F4D03F',
        textColor: '#1B365D',
        borderRadius: 'lg' as const,
        shadow: 'md' as const
      }
    };

    const result = await addLink(newLink);
    if (result.success) {
      toast({
        title: "Success",
        description: "Link added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add link",
        variant: "destructive"
      });
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Stacks wallet to access your StacksBio dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isCreatingProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Create Your Profile
            </CardTitle>
            <CardDescription>
              Set up your StacksBio profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="John Doe"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell people about yourself..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleCreateProfile} 
              className="w-full"
              disabled={profileLoading}
            >
              {profileLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your StacksBio profile and links
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Connected: {walletState.address?.slice(0, 8)}...
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant={activeTab === 'links' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('links')}
          className="flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          Links
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {profile.avatar && (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{profile.displayName}</h3>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  {profile.isVerified && (
                    <Badge variant="secondary" className="mt-1">Verified</Badge>
                  )}
                </div>
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              )}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Created: {profile.createdAt.toLocaleDateString()}</span>
                <span>Updated: {profile.updatedAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize your profile appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div 
                    className="w-full h-8 rounded border"
                    style={{ backgroundColor: profile.theme.primaryColor }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div 
                    className="w-full h-8 rounded border"
                    style={{ backgroundColor: profile.theme.secondaryColor }}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>Layout: {profile.theme.layout}</Label>
                <Label>Button Style: {profile.theme.buttonStyle}</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Links</h2>
            <Button onClick={handleAddLink} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>

          {linksLoading ? (
            <div className="text-center py-8">Loading links...</div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first link to get started
                </p>
                <Button onClick={handleAddLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {links.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{link.icon}</span>
                        <div>
                          <h3 className="font-semibold">{link.title}</h3>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                          {link.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {link.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {link.clickCount} clicks
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {links.reduce((sum, link) => sum + link.clickCount, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  Analytics coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
