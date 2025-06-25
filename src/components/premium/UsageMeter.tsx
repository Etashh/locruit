import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Zap } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { UsageStats } from '@/services/premiumService';

interface UsageMeterProps {
  userType: 'student' | 'employer';
  onUpgrade?: () => void;
}

export const UsageMeter = ({ userType, onUpgrade }: UsageMeterProps) => {
  const { usage, getCurrentPlan, getUsagePercentage, isPremium } = usePremium(userType);
  const plan = getCurrentPlan();

  if (!usage || !plan) {
    return null;
  }

  const usageItems = [
    {
      key: 'job_applications' as keyof UsageStats,
      label: 'Job Applications',
      icon: '📝',
      visible: userType === 'student'
    },
    {
      key: 'saved_jobs' as keyof UsageStats,
      label: 'Saved Jobs',
      icon: '💾',
      visible: userType === 'student'
    },
    {
      key: 'job_postings' as keyof UsageStats,
      label: 'Job Postings',
      icon: '📋',
      visible: userType === 'employer'
    },
    {
      key: 'applicant_views' as keyof UsageStats,
      label: 'Applicant Views',
      icon: '👀',
      visible: userType === 'employer'
    }
  ].filter(item => item.visible);

  const hasLimitWarning = usageItems.some(item => getUsagePercentage(item.key) >= 80);

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Usage This Month</CardTitle>
        <Badge variant={isPremium() ? 'default' : 'secondary'}>
          {plan.name}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageItems.map((item) => {
          const percentage = getUsagePercentage(item.key);
          const currentUsage = usage[item.key] || 0;
          const limit = plan.limits[
            item.key === 'job_applications' ? 'jobApplications' :
            item.key === 'saved_jobs' ? 'savedJobs' :
            item.key === 'job_postings' ? 'jobPostings' :
            'applicantViews'
          ];

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {currentUsage} / {limit === 'unlimited' ? '∞' : limit}
                  </span>
                  {percentage >= 80 && limit !== 'unlimited' && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>
              
              {limit !== 'unlimited' && (
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    percentage >= 90 ? 'bg-red-100' :
                    percentage >= 80 ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}
                />
              )}
            </div>
          );
        })}

        {/* Upgrade CTA */}
        {!isPremium() && hasLimitWarning && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  You're approaching your limits
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Upgrade to premium for unlimited access and advanced features.
                </p>
                <Button 
                  size="sm" 
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Benefits */}
        {isPremium() && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700">Premium Active</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Enjoying unlimited access and premium features!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};