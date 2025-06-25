import { supabase } from '@/lib/supabaseClient';

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    jobApplications: number | 'unlimited';
    savedJobs: number | 'unlimited';
    jobPostings: number | 'unlimited';
    applicantViews: number | 'unlimited';
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageStats {
  user_id: string;
  period_start: string;
  period_end: string;
  job_applications: number;
  saved_jobs: number;
  job_postings: number;
  applicant_views: number;
  messages_sent: number;
  profile_views: number;
}

export const PREMIUM_PLANS: Record<string, PremiumPlan> = {
  // Student Plans
  student_free: {
    id: 'student_free',
    name: 'Student Free',
    price: 0,
    interval: 'monthly',
    features: [
      'Basic job search',
      'Basic profile',
      'Location-based matching',
      'Email notifications'
    ],
    limits: {
      jobApplications: 5,
      savedJobs: 10,
      jobPostings: 0,
      applicantViews: 0
    }
  },
  student_premium: {
    id: 'student_premium',
    name: 'Student Premium',
    price: 9.99,
    interval: 'monthly',
    features: [
      'Unlimited job applications',
      'Priority application status',
      'Advanced search filters',
      'AI resume review',
      'Cover letter generator',
      'Interview preparation',
      'Skill assessments',
      'Career path planning',
      'Premium support'
    ],
    limits: {
      jobApplications: 'unlimited',
      savedJobs: 'unlimited',
      jobPostings: 0,
      applicantViews: 0
    }
  },
  student_pro: {
    id: 'student_pro',
    name: 'Student Pro',
    price: 19.99,
    interval: 'monthly',
    features: [
      'All Premium features',
      'Personal career coach',
      'Video interview practice',
      'Industry insights',
      'Networking events access',
      'Mentorship matching',
      'Portfolio builder',
      'Salary negotiation tools'
    ],
    limits: {
      jobApplications: 'unlimited',
      savedJobs: 'unlimited',
      jobPostings: 1,
      applicantViews: 50
    }
  },

  // Employer Plans
  employer_free: {
    id: 'employer_free',
    name: 'Employer Free',
    price: 0,
    interval: 'monthly',
    features: [
      'Basic candidate search',
      'Basic job posting',
      'Application management'
    ],
    limits: {
      jobApplications: 0,
      savedJobs: 0,
      jobPostings: 1,
      applicantViews: 10
    }
  },
  employer_premium: {
    id: 'employer_premium',
    name: 'Employer Premium',
    price: 49.99,
    interval: 'monthly',
    features: [
      'Unlimited job postings',
      'Featured listings',
      'Advanced candidate search',
      'Bulk messaging',
      'Application analytics',
      'Interview scheduling',
      'Team collaboration'
    ],
    limits: {
      jobApplications: 0,
      savedJobs: 0,
      jobPostings: 'unlimited',
      applicantViews: 'unlimited'
    }
  },
  employer_enterprise: {
    id: 'employer_enterprise',
    name: 'Employer Enterprise',
    price: 99.99,
    interval: 'monthly',
    features: [
      'All Premium features',
      'AI candidate matching',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Advanced analytics',
      'Multi-location management',
      'Integration support'
    ],
    limits: {
      jobApplications: 0,
      savedJobs: 0,
      jobPostings: 'unlimited',
      applicantViews: 'unlimited'
    }
  }
};

export class PremiumService {
  // Check if user has premium access
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Get user's current usage stats
  static async getUserUsage(userId: string): Promise<UsageStats | null> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('usage_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('period_start', periodStart.toISOString())
        .lte('period_end', periodEnd.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        user_id: userId,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        job_applications: 0,
        saved_jobs: 0,
        job_postings: 0,
        applicant_views: 0,
        messages_sent: 0,
        profile_views: 0
      };
    } catch (error) {
      console.error('Error fetching user usage:', error);
      return null;
    }
  }

  // Check if user can perform an action
  static async canPerformAction(
    userId: string, 
    action: keyof UsageStats, 
    userType: 'student' | 'employer'
  ): Promise<{ allowed: boolean; reason?: string; upgradeRequired?: boolean }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const usage = await this.getUserUsage(userId);

      if (!usage) {
        return { allowed: false, reason: 'Unable to fetch usage data' };
      }

      // Determine user's plan
      let planId = `${userType}_free`;
      if (subscription && subscription.status === 'active') {
        planId = subscription.plan_id;
      }

      const plan = PREMIUM_PLANS[planId];
      if (!plan) {
        return { allowed: false, reason: 'Invalid plan' };
      }

      // Map actions to limits
      const actionLimitMap: Record<string, keyof typeof plan.limits> = {
        job_applications: 'jobApplications',
        saved_jobs: 'savedJobs',
        job_postings: 'jobPostings',
        applicant_views: 'applicantViews'
      };

      const limitKey = actionLimitMap[action];
      if (!limitKey) {
        return { allowed: true }; // No limit for this action
      }

      const limit = plan.limits[limitKey];
      if (limit === 'unlimited') {
        return { allowed: true };
      }

      const currentUsage = usage[action] || 0;
      if (currentUsage >= limit) {
        return { 
          allowed: false, 
          reason: `You've reached your ${action.replace('_', ' ')} limit of ${limit} for this month`,
          upgradeRequired: true
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking action permission:', error);
      return { allowed: false, reason: 'Error checking permissions' };
    }
  }

  // Increment usage counter
  static async incrementUsage(userId: string, action: keyof UsageStats): Promise<boolean> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { error } = await supabase.rpc('increment_usage', {
        p_user_id: userId,
        p_action: action,
        p_period_start: periodStart.toISOString(),
        p_period_end: periodEnd.toISOString()
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  }

  // Create or update subscription
  static async createSubscription(
    userId: string, 
    planId: string, 
    paymentMethodId?: string
  ): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
    try {
      const plan = PREMIUM_PLANS[planId];
      if (!plan) {
        return { success: false, error: 'Invalid plan selected' };
      }

      const now = new Date();
      const periodEnd = new Date();
      if (plan.interval === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const subscriptionData = {
        user_id: userId,
        plan_id: planId,
        status: 'active' as const,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert(subscriptionData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, subscription: data };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  // Cancel subscription
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  // Get feature access
  static async hasFeatureAccess(
    userId: string, 
    feature: string,
    userType: 'student' | 'employer'
  ): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      let planId = `${userType}_free`;
      if (subscription && subscription.status === 'active') {
        planId = subscription.plan_id;
      }

      const plan = PREMIUM_PLANS[planId];
      return plan ? plan.features.includes(feature) : false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }
}