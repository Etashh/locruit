import { useState, useEffect } from 'react';
import { LocationJobAPI, UserLocationPreferences } from '@/services/locationJobAPI';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useLocationPreferences = () => {
  const [preferences, setPreferences] = useState<UserLocationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Load user preferences
  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const userPreferences = await LocationJobAPI.getUserLocationPreferences(user.id);
      setPreferences(userPreferences);
    } catch (err: any) {
      setError(err.message || 'Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<UserLocationPreferences>) => {
    try {
      setError(null);
      
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updatedPreferences = await LocationJobAPI.updateUserLocationPreferences(
        user.id, 
        newPreferences
      );

      if (updatedPreferences) {
        setPreferences(updatedPreferences);
        toast({
          title: "Preferences Updated",
          description: "Your location preferences have been saved successfully.",
        });
        return true;
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      toast({
        title: "Error",
        description: err.message || "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update travel distance
  const updateTravelDistance = async (distance: number) => {
    return await updatePreferences({ max_travel_distance: distance });
  };

  // Update current location
  const updateCurrentLocation = async (location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  }) => {
    return await updatePreferences({ current_location: location });
  };

  // Update job preferences
  const updateJobPreferences = async (jobTypes: string[], categories: string[]) => {
    return await updatePreferences({
      job_types: jobTypes as any,
      preferred_categories: categories
    });
  };

  // Update remote work preference
  const updateRemotePreference = async (preference: 'remote_only' | 'hybrid' | 'on_site' | 'no_preference') => {
    return await updatePreferences({ remote_preference: preference });
  };

  // Update salary expectations
  const updateSalaryExpectations = async (expectations: {
    min: number;
    max: number;
    type: 'hourly' | 'monthly' | 'yearly';
  }) => {
    return await updatePreferences({ salary_expectations: expectations });
  };

  // Initialize preferences with default values
  const initializePreferences = async (currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  }) => {
    const defaultPreferences: Partial<UserLocationPreferences> = {
      max_travel_distance: 25,
      preferred_locations: [currentLocation.city],
      current_location: currentLocation,
      transportation_mode: 'driving',
      remote_preference: 'no_preference',
      job_types: ['internship', 'part-time'],
      preferred_categories: [],
      salary_expectations: {
        min: 15,
        max: 25,
        type: 'hourly'
      }
    };

    return await updatePreferences(defaultPreferences);
  };

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updateTravelDistance,
    updateCurrentLocation,
    updateJobPreferences,
    updateRemotePreference,
    updateSalaryExpectations,
    initializePreferences,
    reloadPreferences: loadPreferences
  };
};