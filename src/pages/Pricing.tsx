
import React from 'react';
import Navbar from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const pricingPlans = [
  {
    name: 'Free',
    description: 'Basic time tracking for individuals',
    price: '$0',
    period: 'forever',
    features: [
      { name: 'Basic time tracking', included: true },
      { name: '3 active projects', included: true },
      { name: '7-day activity history', included: true },
      { name: 'Basic badges & achievements', included: true },
      { name: 'Community features', included: false },
      { name: 'Analytics & reports', included: false },
      { name: 'Priority support', included: false },
      { name: 'Team collaboration', included: false },
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline',
    highlight: false
  },
  {
    name: 'Pro',
    description: 'Advanced features for serious focus',
    price: '$8',
    period: 'per month',
    features: [
      { name: 'Advanced time tracking', included: true },
      { name: 'Unlimited projects', included: true },
      { name: '30-day activity history', included: true },
      { name: 'All badges & achievements', included: true },
      { name: 'Community features', included: true },
      { name: 'Analytics & reports', included: true },
      { name: 'Priority support', included: false },
      { name: 'Team collaboration', included: false },
    ],
    buttonText: 'Try Free for 14 Days',
    buttonVariant: 'default',
    highlight: true
  },
  {
    name: 'Team',
    description: 'Collaborate and compete with your team',
    price: '$12',
    period: 'per user/month',
    features: [
      { name: 'Advanced time tracking', included: true },
      { name: 'Unlimited projects', included: true },
      { name: 'Unlimited activity history', included: true },
      { name: 'All badges & achievements', included: true },
      { name: 'Community features', included: true },
      { name: 'Analytics & reports', included: true },
      { name: 'Priority support', included: true },
      { name: 'Team collaboration', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
    highlight: false
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-focus-dark text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Focus Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Supercharge your productivity with the right tools for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`neon-card relative ${plan.highlight ? 'border-focus-aqua' : 'border-focus-purple/30'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-focus-aqua text-focus-dark font-medium px-3">Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-focus-green mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-focus-red/70 mr-2 flex-shrink-0" />
                      )}
                      <span className={!feature.included ? 'text-muted-foreground' : ''}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${plan.highlight 
                    ? 'bg-focus-aqua hover:bg-focus-aqua/90 text-focus-dark' 
                    : 'border-focus-purple/50 hover:border-focus-purple/80'}`}
                  variant={plan.buttonVariant as any}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Still not sure?</h2>
          <p className="text-muted-foreground mb-6">
            Try FocusHub Pro free for 14 days. No credit card required. Cancel anytime.
          </p>
          <Button className="bg-focus-purple hover:bg-focus-purple/90 glow">
            Start Your Free Trial
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
