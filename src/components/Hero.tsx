
/**
 * Hero section component for the landing page
 * Showcases the main value proposition of StacksBio
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-stacksBlue/10 to-stacksYellow/20 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-stacksYellow/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-stacksBlue/30 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-stacksYellow/20 border border-stacksYellow/30 text-stacksNavy text-sm font-medium mb-8 animate-fade-in">
            <span className="mr-2">🚀</span>
            Decentralized Link-in-Bio Platform
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stacksNavy mb-6 animate-slide-up">
            Your Web3
            <span className="bg-gradient-to-r from-stacksYellow to-stacksBlue bg-clip-text text-transparent"> Identity</span>
            <br />
            One Link
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Create your decentralized link-in-bio page on the Stacks blockchain. 
            Own your content, connect with your audience, and monetize your presence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg"
              className="bg-stacksYellow hover:bg-stacksYellow/90 text-stacksNavy font-semibold px-8 py-4 text-lg transition-all-smooth hover:scale-105 hover:shadow-xl"
            >
              Create Your StacksBio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-stacksNavy text-stacksNavy hover:bg-stacksNavy hover:text-white px-8 py-4 text-lg transition-all-smooth"
            >
              View Demo Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div>
              <div className="text-3xl font-bold text-stacksNavy mb-2">10,000+</div>
              <div className="text-gray-600">Active Profiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stacksNavy mb-2">50M+</div>
              <div className="text-gray-600">Link Clicks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stacksNavy mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
