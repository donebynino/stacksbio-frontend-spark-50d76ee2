
/**
 * Links management hook with Stacks blockchain integration
 * Handles CRUD operations for user links via smart contracts
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, ApiResponse, LinkStyle } from '@/types';
import { useWallet } from './useWallet';
import {
  createLink as createLinkContract,
  updateLink as updateLinkContract,
  deleteLink as deleteLinkContract,
  getLink,
  CreateLinkParams,
  UpdateLinkParams,
} from '@/lib/stacks';

export const useLinks = (profileId?: string) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { walletState, userSession, network } = useWallet();

  /**
   * Convert smart contract link data to Link interface
   */
  const convertContractLink = useCallback((contractData: any, linkId: string): Link => {
    return {
      id: linkId,
      title: contractData.title,
      url: contractData.url,
      description: contractData.description || undefined,
      icon: contractData.icon || undefined,
      isActive: contractData['is-active'],
      clickCount: contractData['click-count'],
      order: contractData.order,
      style: {
        backgroundColor: contractData['style-background'],
        textColor: contractData['style-text'],
        borderColor: contractData['style-border'] || undefined,
        borderWidth: contractData['style-border-width'] || undefined,
        borderRadius: contractData['style-border-radius'] as 'none' | 'sm' | 'md' | 'lg' | 'full',
        shadow: contractData['style-shadow'] as 'none' | 'sm' | 'md' | 'lg',
      },
      createdAt: new Date(contractData['created-at'] * 1000), // Convert block height to timestamp
    };
  }, []);

  /**
   * Fetch user's links from smart contract
   * Note: This is a simplified implementation. In production, you'd want to implement
   * proper pagination and batch fetching for better performance.
   */
  const fetchLinks = useCallback(async () => {
    if (!profileId) return;

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll use a simple approach to fetch links
      // In production, you'd implement a more efficient batch fetching mechanism
      const fetchedLinks: Link[] = [];

      // Try to fetch links by ID (this is a simplified approach)
      // In a real implementation, you'd have a better way to get all links for a profile
      for (let i = 1; i <= 50; i++) { // Max 50 links as per contract
        try {
          const result = await getLink(i, network);
          if (result.success && result.value && result.value['profile-id'] === parseInt(profileId)) {
            const linkData = convertContractLink(result.value, i.toString());
            fetchedLinks.push(linkData);
          }
        } catch (err) {
          // Link doesn't exist or error fetching, continue
          continue;
        }
      }

      // Sort by order
      fetchedLinks.sort((a, b) => a.order - b.order);
      setLinks(fetchedLinks);
    } catch (err) {
      console.error('Error fetching links:', err);
      setError('Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }, [profileId, network, convertContractLink]);

  /**
   * Add a new link
   */
  const addLink = useCallback(async (linkData: Omit<Link, 'id' | 'clickCount' | 'createdAt'>): Promise<ApiResponse<Link>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const createParams: CreateLinkParams = {
        title: linkData.title,
        url: linkData.url,
        description: linkData.description,
        icon: linkData.icon,
        styleBackground: linkData.style.backgroundColor,
        styleText: linkData.style.textColor,
        styleBorder: linkData.style.borderColor,
        styleBorderWidth: linkData.style.borderWidth || 0,
        styleBorderRadius: linkData.style.borderRadius,
        styleShadow: linkData.style.shadow,
      };

      const result = await createLinkContract(createParams, userSession, network);

      if (result.success) {
        // Refresh links
        await fetchLinks();
        return { success: true, message: 'Link added successfully' };
      } else {
        return { success: false, error: 'Failed to add link' };
      }
    } catch (err) {
      console.error('Error adding link:', err);
      return { success: false, error: 'Failed to add link' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, fetchLinks]);

  /**
   * Update an existing link
   */
  const updateLink = useCallback(async (linkId: string, updates: Partial<Link>): Promise<ApiResponse<Link>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const updateParams: UpdateLinkParams = {
        title: updates.title,
        url: updates.url,
        description: updates.description,
        icon: updates.icon,
        isActive: updates.isActive,
      };

      const result = await updateLinkContract(parseInt(linkId), updateParams, userSession, network);

      if (result.success) {
        // Refresh links
        await fetchLinks();
        return { success: true, message: 'Link updated successfully' };
      } else {
        return { success: false, error: 'Failed to update link' };
      }
    } catch (err) {
      console.error('Error updating link:', err);
      return { success: false, error: 'Failed to update link' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, fetchLinks]);

  /**
   * Delete a link
   */
  const deleteLink = useCallback(async (linkId: string): Promise<ApiResponse<void>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const result = await deleteLinkContract(parseInt(linkId), userSession, network);

      if (result.success) {
        // Refresh links
        await fetchLinks();
        return { success: true, message: 'Link deleted successfully' };
      } else {
        return { success: false, error: 'Failed to delete link' };
      }
    } catch (err) {
      console.error('Error deleting link:', err);
      return { success: false, error: 'Failed to delete link' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession, network, fetchLinks]);

  /**
   * Reorder links
   * Note: This would require updating the order field for multiple links
   * For now, we'll implement a simplified version
   */
  const reorderLinks = useCallback(async (reorderedLinks: Link[]): Promise<ApiResponse<void>> => {
    if (!walletState.isConnected || !userSession) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      // For now, just update the local state
      // In a full implementation, you'd update the order field in the smart contract
      setLinks(reorderedLinks);

      return { success: true, message: 'Links reordered successfully' };
    } catch (err) {
      console.error('Error reordering links:', err);
      return { success: false, error: 'Failed to reorder links' };
    } finally {
      setIsLoading(false);
    }
  }, [walletState, userSession]);

  // Auto-fetch links when profileId changes
  useEffect(() => {
    if (profileId) {
      fetchLinks();
    }
  }, [profileId, fetchLinks]);

  return {
    links,
    isLoading,
    error,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
};
