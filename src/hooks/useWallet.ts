
/**
 * Stacks wallet connection hook
 * Integrates with Hiro Wallet and other Stacks-compatible wallets
 */

import { useState, useEffect, useCallback } from 'react';
import {
  showConnect,
  disconnect,
  UserSession,
  AppConfig
} from '@stacks/connect';
// Note: Network imports simplified for build compatibility
import { WalletState } from '@/types';

// App configuration for Stacks authentication
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Network configuration - simplified for build compatibility
const getNetwork = () => {
  return {
    coreApiUrl: process.env.NEXT_PUBLIC_STACKS_API_URL || 'http://localhost:3999',
    version: process.env.NODE_ENV === 'production' ? 1 : 0
  };
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const network = getNetwork();

  /**
   * Fetch STX balance for the connected wallet
   */
  const fetchBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const response = await fetch(
        `${network.coreApiUrl}/extended/v1/address/${address}/balances`
      );
      const data = await response.json();
      return parseInt(data.stx.balance) / 1000000; // Convert microSTX to STX
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }, [network]);

  /**
   * Connect to user's Stacks wallet
   */
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      showConnect({
        appDetails: {
          name: 'StacksBio',
          icon: '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: async () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const address = userData.profile.stxAddress.mainnet;
            const balance = await fetchBalance(address);

            setWalletState({
              isConnected: true,
              address,
              balance,
              network: network.version === 1 ? 'mainnet' : 'testnet'
            });
          }
          setIsLoading(false);
        },
        onCancel: () => {
          setIsLoading(false);
          setError('Wallet connection cancelled');
        },
        userSession,
      });
    } catch (err) {
      setIsLoading(false);
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
    }
  }, [fetchBalance, network, userSession]);

  /**
   * Disconnect wallet and clear session
   */
  const disconnectWallet = useCallback(() => {
    try {
      disconnect();
      userSession.signUserOut();
      setWalletState({
        isConnected: false,
      });
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  }, [userSession]);

  /**
   * Check for existing wallet connection on component mount
   */
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (userSession.isUserSignedIn()) {
        setIsLoading(true);
        try {
          const userData = userSession.loadUserData();
          const address = userData.profile.stxAddress.mainnet;
          const balance = await fetchBalance(address);

          setWalletState({
            isConnected: true,
            address,
            balance,
            network: network.version === 1 ? 'mainnet' : 'testnet'
          });
        } catch (err) {
          console.error('Error loading existing session:', err);
          setError('Failed to load existing session');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkExistingConnection();
  }, [fetchBalance, network, userSession]);

  /**
   * Refresh balance periodically
   */
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      const interval = setInterval(async () => {
        try {
          const balance = await fetchBalance(walletState.address!);
          setWalletState(prev => ({ ...prev, balance }));
        } catch (err) {
          console.error('Error refreshing balance:', err);
        }
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [walletState.isConnected, walletState.address, fetchBalance]);

  return {
    walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    userSession,
    network,
  };
};
