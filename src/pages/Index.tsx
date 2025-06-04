
/**
 * Main landing page component
 * Showcases StacksBio's features and value proposition
 */

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProfilePreview from '@/components/ProfilePreview';
import { useProfile } from '@/hooks/useProfile';
import { useLinks } from '@/hooks/useLinks';

const Index: React.FC = () => {
  // Mock data for demonstration
  const { profile } = useProfile('demo');
  const { links } = useLinks('1');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <Hero />
        <Features />
        
        {/* Demo section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-stacksNavy mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Here's how your StacksBio profile will look to your visitors
              </p>
            </div>
            
            <div className="flex justify-center">
              {profile && (
                <ProfilePreview 
                  profile={profile} 
                  links={links}
                  className="animate-fade-in"
                />
              )}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-gradient-to-r from-stacksYellow/10 via-stacksBlue/10 to-stacksNavy/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stacksNavy mb-6">
              Ready to Own Your Digital Identity?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of creators building their Web3 presence with StacksBio
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-stacksYellow hover:bg-stacksYellow/90 text-stacksNavy font-semibold px-8 py-4 rounded-lg text-lg transition-all-smooth hover:scale-105 hover:shadow-xl">
                Start Building Your Profile
              </button>
              <button className="border-2 border-stacksNavy text-stacksNavy hover:bg-stacksNavy hover:text-white px-8 py-4 rounded-lg text-lg transition-all-smooth">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stacksNavy text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stacksYellow to-stacksBlue flex items-center justify-center">
                  <span className="text-stacksNavy font-bold">S</span>
                </div>
                <span className="text-xl font-bold">StacksBio</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The decentralized link-in-bio platform built on Stacks blockchain.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Features</li>
                <li>Pricing</li>
                <li>Analytics</li>
                <li>API</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Discord</li>
                <li>Twitter</li>
                <li>GitHub</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 StacksBio. Built on Stacks blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
