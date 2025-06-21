
/**
 * User profile management hook with Stacks blockchain integration
 * Handles profile data fetching, updating, and caching from smart contracts
 */

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ApiResponse, ProfileTheme } from '@/types';
import { useWallet } from './useWallet';
import {
  getProfileByUsername,
  getProfileByOwner,
  createProfile as createProfileContract,
  updateProfile as updateProfileContract,
  updateTheme as updateThemeContract,
  isUsernameAvailable,
  CreateProfileParams,
  UpdateProfileParams,
  UpdateThemeParams,
} from '@/lib/stacks';

export const useProfile = (username?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { walletState, userSession, network } = useWallet();

  /**
   * Convert smart contract profile data to UserProfile interface
   */
  const convertContractProfile = useCallback((contractData: any, profileId: string): UserProfile => {
    return {
      id: profileId,
      username: contractData.username,
      displayName: contractData['display-name'],
      bio: contractData.bio || undefined,
      avatar: contractData['avatar-url'] || undefined,
      isVerified: contractData['is-verified'],
      walletAddress: contractData.owner,
      theme: {
        primaryColor: contractData['theme-primary'],
        secondaryColor: contractData['theme-secondary'],
        backgroundColor: contractData['theme-background'],
        textColor: contractData['theme-text'],
        buttonStyle: contractData['theme-button-style'] as 'rounded' | 'square' | 'pill',
        layout: contractData['theme-layout'] as 'centered' | 'left' | 'right',
      },
      createdAt: new Date(contractData['created-at'] * 1000), // Convert block height to timestamp
      updatedAt: new Date(contractData['updated-at'] * 1000),
    };
  }, []);

  /**
   * Fetch user profile data from smart contract
   */
  const fetchProfile = useCallback(async (profileUsername: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfileByUsername(profileUsername, network);

      if (result.success && result.value) {
        const profileData = convertContractProfile(result.value, result.value['profile-id']);
        setProfile(profileData);
      } else {
        setProfile(null);
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [network, convertContractProfile]);

  /**
   * Fetch profile by wallet address
   */
  const fetchProfileByAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfileByOwner(address, network);

      if (result.success && result.value) {
        const profileData = convertContractProfile(result.value, result.value['profile-id']);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile by address:', err);
      setError('Failed to fetch profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [network, convertContractProfile]);

  /**
   * Create a new profile
   */
  const createProfile = useCallback(async (params: CreateProfileParams): Promise<ApiResponse<UserProfile>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      // Check if username is available
      const available = await isUsernameAvailable(params.username, network);
      if (!available.success || !available.value) {
        return { success: false, error: 'Username is not available' };
      }

      const result = await createProfileContract(params, userSession, network);

      if (result.success) {
        // Fetch the newly created profile
        await fetchProfileByAddress(walletState.address!);
        return { success: true, message: 'Profile created successfully' };
      } else {
        return { success: false, error: 'Failed to create profile' };
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      return { success: false, error: 'Failed to create profile' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, fetchProfileByAddress]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates: UpdateProfileParams): Promise<ApiResponse<UserProfile>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const result = await updateProfileContract(updates, userSession, network);

      if (result.success) {
        // Refresh profile data
        if (profile) {
          await fetchProfileByAddress(walletState.address!);
        }
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, error: 'Failed to update profile' };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, profile, fetchProfileByAddress]);

  /**
   * Update profile theme
   */
  const updateTheme = useCallback(async (theme: UpdateThemeParams): Promise<ApiResponse<UserProfile>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const result = await updateThemeContract(theme, userSession, network);

      if (result.success) {
        // Refresh profile data
        if (profile) {
          await fetchProfileByAddress(walletState.address!);
        }
        return { success: true, message: 'Theme updated successfully' };
      } else {
        return { success: false, error: 'Failed to update theme' };
      }
    } catch (err) {
      console.error('Error updating theme:', err);
      return { success: false, error: 'Failed to update theme' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, profile, fetchProfileByAddress]);

  /**
   * Check if username is available
   */
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      const result = await isUsernameAvailable(username, network);
      return result.success && result.value;
    } catch (err) {
      console.error('Error checking username availability:', err);
      return false;
    }
  }, [network]);

  // Auto-fetch profile when username changes
  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username, fetchProfile]);

  // Auto-fetch user's own profile when wallet connects
  useEffect(() => {
    if (walletState.isConnected && walletState.address && !username) {
      fetchProfileByAddress(walletState.address);
    }
  }, [walletState.isConnected, walletState.address, username, fetchProfileByAddress]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    fetchProfileByAddress,
    createProfile,
    updateProfile,
    updateTheme,
    checkUsernameAvailability,
  };
};
