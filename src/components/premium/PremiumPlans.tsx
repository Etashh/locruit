import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { PremiumPlan } from '@/services/premiumService';

interface PremiumPlansProps {
  userType: 'student' | 'employer';
  onSelectPlan?: (planId: string) => void;
}

export const PremiumPlans = ({ userType, onSelectPlan }: PremiumPlansProps) => {
  const { availablePlans, getCurrentPlan, isPremium } = usePremium(userType);
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');
  const currentPlan = getCurrentPlan();

  const getDiscountedPrice = (price: number) => {
    return selectedInterval === 'yearly' ? price * 10 : price;
  };

  const getSavingsPercentage = () => {
    return selectedInterval === 'yearly' ? 17 : 0; // 2 months free on yearly
  };

  return (
    <div className="space-y-8">
      {/* Billing Interval Toggle */}
      <div className="flex justify-center space-x-4 items-center">
        <Button
          variant={selectedInterval === 'monthly' ? 'default' : 'outline'}
          onClick={() => setSelectedInterval('monthly')}
          className="relative"
        >
          Monthly
        </Button>
        <Button
          variant={selectedInterval === 'yearly' ? 'default' : 'outline'}
          onClick={() => setSelectedInterval('yearly')}
          className="relative"
        >
          Yearly
          <Badge className="absolute -top-2 -right-2 bg-green-500">
            Save {getSavingsPercentage()}%
          </Badge>
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {availablePlans.map((plan: PremiumPlan) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          const price = getDiscountedPrice(plan.price);

          return (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.id.includes('premium') ? 'border-blue-500 shadow-blue-100' : ''
              }`}
            >
              {plan.id.includes('premium') && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl bg-blue-500">
                    <Star className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {isCurrentPlan && (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      CURRENT PLAN
                    </Badge>
                  )}
                </CardTitle>
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    ${price}
                    <span className="text-sm font-normal text-gray-500">
                      /{selectedInterval}
                    </span>
                  </div>
                  {selectedInterval === 'yearly' && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ${(plan.price * 2).toFixed(2)} per year
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Usage Limits */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-gray-900">Usage Limits</h4>
                  <ul className="space-y-2">
                    {Object.entries(plan.limits).map(([key, value]) => {
                      if (
                        (userType === 'student' && ['jobPostings', 'applicantViews'].includes(key)) ||
                        (userType === 'employer' && ['jobApplications', 'savedJobs'].includes(key))
                      ) {
                        return null;
                      }

                      return (
                        <li key={key} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <Badge variant="secondary">
                            {value === 'unlimited' ? '∞' : value}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    plan.id.includes('premium')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800'
                      : ''
                  }`}
                  disabled={isCurrentPlan}
                  onClick={() => onSelectPlan?.(plan.id)}
                >
                  {isCurrentPlan ? (
                    'Current Plan'
                  ) : isPremium() ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Switch Plan
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center text-gray-600">
        <p>30-day money-back guarantee • Cancel anytime • Secure payment</p>
      </div>
    </div>
  );
};