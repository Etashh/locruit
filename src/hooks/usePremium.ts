import { useState, useEffect, useCallback } from 'react';
import { PremiumService, UserSubscription, UsageStats, PREMIUM_PLANS } from '@/services/premiumService';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const usePremium = (userType: 'student' | 'employer' = 'student') => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Load subscription and usage data
  const loadPremiumData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const [subscriptionData, usageData] = await Promise.all([
        PremiumService.getUserSubscription(user.id),
        PremiumService.getUserUsage(user.id)
      ]);

      setSubscription(subscriptionData);
      setUsage(usageData);
    } catch (err: any) {
      setError(err.message || 'Failed to load premium data');
      console.error('Error loading premium data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user can perform an action
  const canPerformAction = useCallback(async (action: keyof UsageStats) => {
    const user = await getCurrentUser();
    if (!user) return { allowed: false, reason: 'User not authenticated' };

    return await PremiumService.canPerformAction(user.id, action, userType);
  }, [userType]);

  // Increment usage for an action
  const incrementUsage = useCallback(async (action: keyof UsageStats) => {
    const user = await getCurrentUser();
    if (!user) return false;

    const success = await PremiumService.incrementUsage(user.id, action);
    if (success) {
      // Reload usage data
      const newUsage = await PremiumService.getUserUsage(user.id);
      setUsage(newUsage);
    }
    return success;
  }, []);

  // Check feature access
  const hasFeatureAccess = useCallback(async (feature: string) => {
    const user = await getCurrentUser();
    if (!user) return false;

    return await PremiumService.hasFeatureAccess(user.id, feature, userType);
  }, [userType]);

  // Upgrade to premium
  const upgradeToPremium = useCallback(async (planId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await PremiumService.createSubscription(user.id, planId);
      
      if (result.success) {
        setSubscription(result.subscription || null);
        toast({
          title: "Upgrade Successful!",
          description: `You've successfully upgraded to ${PREMIUM_PLANS[planId]?.name}`,
        });
        return true;
      } else {
        throw new Error(result.error || 'Failed to upgrade');
      }
    } catch (err: any) {
      toast({
        title: "Upgrade Failed",
        description: err.message || "Failed to upgrade to premium",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const success = await PremiumService.cancelSubscription(user.id);
      
      if (success) {
        setSubscription(prev => prev ? { ...prev, status: 'canceled' } : null);
        toast({
          title: "Subscription Canceled",
          description: "Your subscription has been canceled successfully",
        });
        return true;
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (err: any) {
      toast({
        title: "Cancellation Failed",
        description: err.message || "Failed to cancel subscription",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Get current plan
  const getCurrentPlan = useCallback(() => {
    if (subscription && subscription.status === 'active') {
      return PREMIUM_PLANS[subscription.plan_id];
    }
    return PREMIUM_PLANS[`${userType}_free`];
  }, [subscription, userType]);

  // Check if user is premium
  const isPremium = useCallback(() => {
    return subscription && subscription.status === 'active';
  }, [subscription]);

  // Get usage percentage for a specific action
  const getUsagePercentage = useCallback((action: keyof UsageStats) => {
    if (!usage) return 0;
    
    const plan = getCurrentPlan();
    if (!plan) return 0;

    const actionLimitMap: Record<string, keyof typeof plan.limits> = {
      job_applications: 'jobApplications',
      saved_jobs: 'savedJobs',
      job_postings: 'jobPostings',
      applicant_views: 'applicantViews'
    };

    const limitKey = actionLimitMap[action];
    if (!limitKey) return 0;

    const limit = plan.limits[limitKey];
    if (limit === 'unlimited') return 0;

    const currentUsage = usage[action] || 0;
    return Math.min((currentUsage / limit) * 100, 100);
  }, [usage, getCurrentPlan]);

  // Load data on mount
  useEffect(() => {
    loadPremiumData();
  }, [loadPremiumData]);

  return {
    // State
    subscription,
    usage,
    isLoading,
    error,

    // Actions
    canPerformAction,
    incrementUsage,
    hasFeatureAccess,
    upgradeToPremium,
    cancelSubscription,
    reloadData: loadPremiumData,

    // Utilities
    getCurrentPlan,
    isPremium,
    getUsagePercentage,

    // Constants
    availablePlans: Object.values(PREMIUM_PLANS).filter(plan => 
      plan.id.startsWith(userType)
    )
  };
};