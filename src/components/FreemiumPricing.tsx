
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Star } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Array<{ name: string; included: boolean }>;
  popular?: boolean;
  buttonText: string;
  stripePriceId?: string;
}

const FreemiumPricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        { name: "Basic job search", included: true },
        { name: "Up to 3 job applications per week", included: true },
        { name: "Basic profile creation", included: true },
        { name: "Standard resume template", included: true },
        { name: "Priority support", included: false },
        { name: "Advanced resume templates", included: false },
        { name: "Direct employer messaging", included: false },
        { name: "Job application tracking", included: false },
        { name: "LinkedIn integration", included: false },
      ],
      buttonText: "Get Started Free",
    },
    {
      name: "Pro",
      price: billingPeriod === 'monthly' ? "$9.99" : "$99.99",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "Ideal for serious job seekers",
      features: [
        { name: "Unlimited job applications", included: true },
        { name: "Advanced job search filters", included: true },
        { name: "5 premium resume templates", included: true },
        { name: "Direct employer messaging", included: true },
        { name: "Job application tracking", included: true },
        { name: "Priority support", included: true },
        { name: "LinkedIn integration", included: false },
        { name: "Personal career coach", included: false },
        { name: "Interview preparation", included: false },
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
      stripePriceId: billingPeriod === 'monthly' ? 'price_pro_monthly' : 'price_pro_yearly',
    },
    {
      name: "Premium",
      price: billingPeriod === 'monthly' ? "$19.99" : "$199.99",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "For maximum career acceleration",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Unlimited premium resume templates", included: true },
        { name: "LinkedIn integration", included: true },
        { name: "Personal career coach", included: true },
        { name: "Interview preparation sessions", included: true },
        { name: "Salary negotiation guidance", included: true },
        { name: "Career path planning", included: true },
        { name: "Exclusive job opportunities", included: true },
        { name: "White-glove service", included: true },
      ],
      buttonText: "Go Premium",
      stripePriceId: billingPeriod === 'monthly' ? 'price_premium_monthly' : 'price_premium_yearly',
    },
  ];

  const handleSubscribe = (priceId?: string) => {
    if (!priceId) {
      // Handle free tier signup
      console.log("Redirect to free signup");
      return;
    }
    
    // TODO: Integrate with Stripe Checkout
    console.log("Redirecting to Stripe Checkout with price ID:", priceId);
    
    // Example Stripe integration:
    /*
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/pricing`,
    });
    */
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Career Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when you're ready to accelerate
          </p>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                tier.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1 flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {tier.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500 ml-2">{tier.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{tier.description}</p>
              </CardHeader>
              
              <CardContent>
                <Button
                  onClick={() => handleSubscribe(tier.stripePriceId)}
                  className={`w-full mb-6 ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : tier.name === 'Free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {tier.name === 'Premium' && <Crown className="w-4 h-4 mr-2" />}
                  {tier.name === 'Pro' && <Zap className="w-4 h-4 mr-2" />}
                  {tier.buttonText}
                </Button>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Our Free tier is available forever with no credit card required. You can upgrade to Pro or Premium at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreemiumPricing;
