import { useState, useEffect, useCallback } from 'react';
import { LocationJobAPI, JobWithLocation, JobSearchFilters } from '@/services/locationJobAPI';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useLocationJobs = () => {
  const [jobs, setJobs] = useState<JobWithLocation[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobWithLocation[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Search jobs by location
  const searchJobs = useCallback(async (
    userLocation: { latitude: number; longitude: number },
    filters: JobSearchFilters = {}
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await getCurrentUser();
      const results = await LocationJobAPI.searchJobsByLocation(
        userLocation,
        filters,
        user?.id
      );

      setJobs(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search jobs');
      console.error('Error searching jobs:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get recommended jobs for user
  const getRecommendedJobs = useCallback(async (limit: number = 20) => {
    try {
      setIsLoadingRecommended(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const results = await LocationJobAPI.getRecommendedJobs(user.id, limit);
      setRecommendedJobs(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to get recommended jobs');
      console.error('Error getting recommended jobs:', err);
      return [];
    } finally {
      setIsLoadingRecommended(false);
    }
  }, []);

  // Get jobs near a specific location
  const getJobsNearLocation = useCallback(async (
    latitude: number,
    longitude: number,
    radiusInMiles: number = 10,
    limit: number = 50
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await LocationJobAPI.getJobsNearLocation(
        latitude,
        longitude,
        radiusInMiles,
        limit
      );

      setJobs(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to get jobs near location');
      console.error('Error getting jobs near location:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a job
  const saveJob = useCallback(async (jobId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const success = await LocationJobAPI.saveJob(user.id, jobId);
      if (success) {
        toast({
          title: "Job Saved",
          description: "Job has been added to your saved list.",
        });
        // Refresh saved jobs
        loadSavedJobs();
        return true;
      } else {
        throw new Error('Failed to save job');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save job",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Unsave a job
  const unsaveJob = useCallback(async (jobId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const success = await LocationJobAPI.unsaveJob(user.id, jobId);
      if (success) {
        toast({
          title: "Job Removed",
          description: "Job has been removed from your saved list.",
        });
        // Refresh saved jobs
        loadSavedJobs();
        return true;
      } else {
        throw new Error('Failed to unsave job');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove job",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Load saved jobs
  const loadSavedJobs = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const results = await LocationJobAPI.getSavedJobs(user.id);
      setSavedJobs(results);
      return results;
    } catch (err: any) {
      console.error('Error loading saved jobs:', err);
      return [];
    }
  }, []);

  // Apply to a job
  const applyToJob = useCallback(async (
    jobId: string,
    applicationData: {
      cover_letter?: string;
      resume_url?: string;
      additional_info?: string;
    }
  ) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const success = await LocationJobAPI.applyToJob(user.id, jobId, applicationData);
      if (success) {
        toast({
          title: "Application Submitted",
          description: "Your job application has been submitted successfully.",
        });
        return true;
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit application",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Check if a job is saved
  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some(job => job.id === jobId);
  }, [savedJobs]);

  // Filter jobs by distance
  const filterJobsByDistance = useCallback((maxDistance: number) => {
    return jobs.filter(job => 
      job.remote_allowed || 
      job.hybrid_allowed || 
      (job.distance !== undefined && job.distance <= maxDistance)
    );
  }, [jobs]);

  // Filter jobs by type
  const filterJobsByType = useCallback((jobTypes: string[]) => {
    if (jobTypes.length === 0) return jobs;
    return jobs.filter(job => jobTypes.includes(job.job_type));
  }, [jobs]);

  // Filter jobs by category
  const filterJobsByCategory = useCallback((categories: string[]) => {
    if (categories.length === 0) return jobs;
    return jobs.filter(job => categories.includes(job.category));
  }, [jobs]);

  // Search jobs with text query
  const searchJobsWithQuery = useCallback((query: string) => {
    if (!query.trim()) return jobs;
    
    const lowerQuery = query.toLowerCase();
    return jobs.filter(job =>
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery) ||
      job.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    );
  }, [jobs]);

  // Load saved jobs on mount
  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  return {
    // State
    jobs,
    recommendedJobs,
    savedJobs,
    isLoading,
    isLoadingRecommended,
    error,

    // Actions
    searchJobs,
    getRecommendedJobs,
    getJobsNearLocation,
    saveJob,
    unsaveJob,
    loadSavedJobs,
    applyToJob,

    // Utilities
    isJobSaved,
    filterJobsByDistance,
    filterJobsByType,
    filterJobsByCategory,
    searchJobsWithQuery,

    // Reset functions
    clearJobs: () => setJobs([]),
    clearError: () => setError(null)
  };
};