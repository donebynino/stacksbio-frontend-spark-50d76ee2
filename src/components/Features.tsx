
/**
 * Enhanced Features section component
 * Interactive showcase of StacksBio's key benefits and capabilities
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Palette, BarChart3, DollarSign, Lock, Rocket } from 'lucide-react';

const Features: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: 'Decentralized Links',
      description: 'Your links are stored on the blockchain, ensuring permanent availability and true ownership.',
      benefit: 'Never lose your content again',
      color: 'from-stacksYellow to-stacksYellow/70',
      accentColor: 'text-yellow-600'
    },
    {
      icon: Palette,
      title: 'Custom Themes',
      description: 'Personalize your profile with custom colors, layouts, and styling options.',
      benefit: 'Express your unique brand',
      color: 'from-stacksBlue to-stacksBlue/70',
      accentColor: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track link performance, visitor engagement, and optimize your content strategy.',
      benefit: 'Data-driven decisions',
      color: 'from-stacksNavy to-stacksNavy/70',
      accentColor: 'text-indigo-600'
    },
    {
      icon: DollarSign,
      title: 'Monetization Tools',
      description: 'Accept payments in STX and other cryptocurrencies directly through your links.',
      benefit: 'Turn followers into revenue',
      color: 'from-green-500 to-emerald-400',
      accentColor: 'text-green-600'
    },
    {
      icon: Lock,
      title: 'True Ownership',
      description: 'You own your data completely. No platform can restrict or delete your content.',
      benefit: 'Complete control & freedom',
      color: 'from-purple-500 to-violet-400',
      accentColor: 'text-purple-600'
    },
    {
      icon: Rocket,
      title: 'Lightning Fast',
      description: 'Built on Stacks for fast transactions and seamless user experience.',
      benefit: 'Instant, smooth performance',
      color: 'from-orange-500 to-red-400',
      accentColor: 'text-orange-600'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Enhanced section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-stacksBlue/10 text-stacksNavy text-sm font-semibold mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stacksNavy mb-6 leading-tight">
            Why Choose
            <span className="bg-gradient-to-r from-stacksYellow to-stacksBlue bg-clip-text text-transparent"> StacksBio</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of link-in-bio with blockchain-powered features that put you in complete control.
          </p>
        </div>

        {/* Enhanced features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredFeature === index;
            
            return (
              <Card 
                key={index}
                className={`group relative border-0 shadow-lg hover:shadow-2xl transition-all-smooth hover:-translate-y-3 bg-white overflow-hidden cursor-pointer ${
                  isHovered ? 'ring-2 ring-stacksBlue/20' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-stacksNavy group-hover:text-stacksNavy transition-colors">
                    {feature.title}
                  </CardTitle>
                  <div className={`text-sm font-semibold ${feature.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    {feature.benefit}
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Animated progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500 ${
                        isHovered ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                  
                  {/* Learn more button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.accentColor} hover:bg-gray-50`}
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-stacksYellow/10 to-stacksBlue/10 rounded-3xl p-8 border border-stacksYellow/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-stacksNavy mb-4">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of creators building their Web3 presence with StacksBio. Start your journey today.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-stacksYellow to-stacksBlue hover:shadow-xl text-white font-bold px-8 py-4 rounded-2xl transition-all-smooth hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
