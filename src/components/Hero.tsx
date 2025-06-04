
/**
 * Enhanced Hero section component for the landing page
 * Showcases the main value proposition of StacksBio with modern animations and interactions
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, TrendingUp, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { label: 'Active Profiles', value: '12,547', icon: Users },
    { label: 'Link Clicks', value: '2.3M', icon: TrendingUp },
    { label: 'Uptime', value: '99.9%', icon: Shield }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-stacksBlue/5 to-stacksYellow/10 py-20 lg:py-32">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-stacksYellow/20 to-stacksBlue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-stacksNavy/10 to-stacksBlue/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-stacksYellow/10 rounded-full blur-xl animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Enhanced badge with animation */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-stacksYellow/20 to-stacksBlue/20 border border-stacksYellow/30 text-stacksNavy text-sm font-semibold mb-8 animate-fade-in hover:scale-105 transition-all-smooth backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            Decentralized • Secure • Yours Forever
          </div>

          {/* Enhanced main headline with better typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stacksNavy mb-8 animate-slide-up leading-[0.9] tracking-tight">
            Your Web3
            <span className="relative inline-block mx-4">
              <span className="bg-gradient-to-r from-stacksYellow via-stacksBlue to-stacksNavy bg-clip-text text-transparent animate-gradient bg-300% bg-pos-0">
                Identity
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-stacksYellow/20 to-stacksBlue/20 rounded-lg blur opacity-30 animate-pulse"></div>
            </span>
            <br />
            <span className="relative">
              One Link
              <svg className="absolute -bottom-4 left-0 w-full h-6 text-stacksYellow/60" viewBox="0 0 200 12" fill="none">
                <path d="M2 8c50-4 100-4 150 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw"/>
              </svg>
            </span>
          </h1>

          {/* Enhanced subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
            Create your <span className="text-stacksNavy font-semibold">decentralized</span> link-in-bio page on the Stacks blockchain. 
            <br className="hidden md:block" />
            Own your content, connect with your audience, and 
            <span className="bg-gradient-to-r from-stacksYellow to-stacksBlue bg-clip-text text-transparent font-semibold"> monetize your presence</span>.
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-stacksYellow to-stacksYellow/90 hover:from-stacksYellow/90 hover:to-stacksYellow text-stacksNavy font-bold px-10 py-6 text-lg rounded-2xl transition-all-smooth hover:scale-105 hover:shadow-2xl hover:shadow-stacksYellow/25 border-0"
            >
              <span className="flex items-center">
                Create Your StacksBio
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="group border-2 border-stacksNavy/20 text-stacksNavy hover:bg-stacksNavy hover:text-white px-10 py-6 text-lg rounded-2xl transition-all-smooth hover:scale-105 hover:shadow-xl backdrop-blur-sm"
            >
              <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Enhanced animated stats */}
          <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const isActive = currentStat === index;
                  return (
                    <div 
                      key={index}
                      className={`text-center transition-all duration-500 ${
                        isActive ? 'scale-110 transform' : 'scale-100'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-br from-stacksYellow to-stacksBlue shadow-lg' 
                          : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-8 w-8 transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-stacksNavy'
                        }`} />
                      </div>
                      <div className={`text-4xl font-black mb-2 transition-all duration-500 ${
                        isActive ? 'text-stacksNavy' : 'text-gray-600'
                      }`}>
                        {stat.value}
                      </div>
                      <div className={`text-sm font-medium transition-all duration-500 ${
                        isActive ? 'text-stacksNavy' : 'text-gray-500'
                      }`}>
                        {stat.label}
                      </div>
                      {isActive && (
                        <div className="w-12 h-1 bg-gradient-to-r from-stacksYellow to-stacksBlue mx-auto mt-3 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
