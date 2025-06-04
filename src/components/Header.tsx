
/**
 * Enhanced application header component
 * Modern navigation with smooth interactions and wallet connectivity
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Menu, X, Wallet, ExternalLink } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { walletState, isLoading, connectWallet, disconnectWallet } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' }
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    } ${className}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Enhanced Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-stacksYellow to-stacksBlue flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all-smooth group-hover:scale-110">
            <span className="text-white font-black text-lg">S</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-stacksYellow to-stacksBlue opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
          </div>
          <span className="text-2xl font-black text-stacksNavy group-hover:text-stacksBlue transition-colors">
            StacksBio
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="relative text-stacksNavy hover:text-stacksBlue transition-colors duration-200 font-semibold group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-stacksYellow to-stacksBlue group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Enhanced Wallet & Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Wallet Connection */}
          {walletState.isConnected ? (
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-stacksNavy">
                    {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                  </span>
                </div>
                {walletState.balance && (
                  <div className="text-xs text-gray-500">{walletState.balance} STX</div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all-smooth"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="hidden md:flex bg-gradient-to-r from-stacksYellow to-stacksYellow/90 hover:from-stacksYellow/90 hover:to-stacksYellow text-stacksNavy font-bold transition-all-smooth hover:scale-105 hover:shadow-lg border-0"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
          
          <Button
            variant="outline"
            className="hidden md:flex border-stacksBlue/20 text-stacksBlue hover:bg-stacksBlue hover:text-white transition-all-smooth hover:scale-105 group"
          >
            Dashboard
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4 mb-6">
              {navItems.map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="block text-stacksNavy hover:text-stacksBlue transition-colors font-semibold py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            
            <div className="space-y-3">
              {!walletState.isConnected ? (
                <Button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-stacksYellow to-stacksYellow/90 text-stacksNavy font-bold"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect Wallet
                </Button>
              )}
              
              <Button
                variant="outline"
                className="w-full border-stacksBlue/20 text-stacksBlue hover:bg-stacksBlue hover:text-white"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
