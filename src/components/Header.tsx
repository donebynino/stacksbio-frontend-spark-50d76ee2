
/**
 * Main application header component
 * Provides navigation and wallet connection functionality
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { walletState, isLoading, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${className}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stacksYellow to-stacksBlue flex items-center justify-center">
            <span className="text-stacksNavy font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-stacksNavy">StacksBio</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#features" 
            className="text-stacksNavy hover:text-stacksBlue transition-colors duration-200 font-medium"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="text-stacksNavy hover:text-stacksBlue transition-colors duration-200 font-medium"
          >
            Pricing
          </a>
          <a 
            href="#about" 
            className="text-stacksNavy hover:text-stacksBlue transition-colors duration-200 font-medium"
          >
            About
          </a>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          {walletState.isConnected ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-stacksNavy">
                <span className="font-medium">
                  {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </span>
                {walletState.balance && (
                  <div className="text-xs text-gray-500">{walletState.balance} STX</div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="border-stacksNavy text-stacksNavy hover:bg-stacksNavy hover:text-white transition-all-smooth"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-stacksYellow hover:bg-stacksYellow/90 text-stacksNavy font-semibold transition-all-smooth"
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
          
          <Button
            variant="outline"
            className="border-stacksBlue text-stacksBlue hover:bg-stacksBlue hover:text-white transition-all-smooth"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
