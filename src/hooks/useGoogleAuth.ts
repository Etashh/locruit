import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://iwxsaujmsjfzxwrddrhe.supabase.co/auth/v1/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Redirecting to Profile Setup...",
        description: "Please complete your profile to proceed to the dashboard.",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error.message);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
  };
};