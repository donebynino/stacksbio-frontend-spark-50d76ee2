
/**
 * Features section component
 * Highlights the key benefits and capabilities of StacksBio
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🔗',
      title: 'Decentralized Links',
      description: 'Your links are stored on the blockchain, ensuring permanent availability and true ownership.',
      color: 'from-stacksYellow to-stacksYellow/70'
    },
    {
      icon: '🎨',
      title: 'Custom Themes',
      description: 'Personalize your profile with custom colors, layouts, and styling options.',
      color: 'from-stacksBlue to-stacksBlue/70'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track link performance, visitor engagement, and optimize your content strategy.',
      color: 'from-stacksNavy to-stacksNavy/70'
    },
    {
      icon: '💰',
      title: 'Monetization Tools',
      description: 'Accept payments in STX and other cryptocurrencies directly through your links.',
      color: 'from-stacksYellow to-stacksBlue'
    },
    {
      icon: '🔒',
      title: 'True Ownership',
      description: 'You own your data completely. No platform can restrict or delete your content.',
      color: 'from-stacksBlue to-stacksNavy'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built on Stacks for fast transactions and seamless user experience.',
      color: 'from-stacksNavy to-stacksYellow'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stacksNavy mb-6">
            Why Choose StacksBio?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of link-in-bio with blockchain-powered features that put you in control.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all-smooth hover:-translate-y-2 bg-white"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-stacksNavy">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
                <div className={`w-full h-1 mt-6 rounded-full bg-gradient-to-r ${feature.color}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-stacksYellow/20 to-stacksBlue/20 border border-stacksYellow/30">
            <span className="text-stacksNavy font-medium">
              Ready to get started? Create your StacksBio in minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
