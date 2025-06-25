import { supabase } from '@/lib/supabaseClient';

// Enhanced Job interface with location data
export interface JobWithLocation {
  id: string;
  title: string;
  company: string;
  company_id: string;
  description: string;
  requirements: string[];
  skills: string[];
  job_type: 'internship' | 'part-time' | 'full-time' | 'contract';
  category: string;
  salary_min?: number;
  salary_max?: number;
  salary_type: 'hourly' | 'monthly' | 'yearly';
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    postal_code?: string;
  };
  remote_allowed: boolean;
  hybrid_allowed: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  featured: boolean;
  application_deadline?: string;
  contact_email?: string;
  application_url?: string;
  distance?: number; // Calculated field
}

// User location preferences interface
export interface UserLocationPreferences {
  user_id: string;
  max_travel_distance: number; // in miles/km
  preferred_locations: string[]; // Array of preferred cities/areas
  current_location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  transportation_mode: 'walking' | 'cycling' | 'driving' | 'public_transport';
  remote_preference: 'remote_only' | 'hybrid' | 'on_site' | 'no_preference';
  job_types: ('internship' | 'part-time' | 'full-time' | 'contract')[];
  preferred_categories: string[];
  salary_expectations: {
    min: number;
    max: number;
    type: 'hourly' | 'monthly' | 'yearly';
  };
  updated_at: string;
}

// Search filters interface
export interface JobSearchFilters {
  location?: {
    latitude: number;
    longitude: number;
  };
  max_distance?: number;
  job_types?: string[];
  categories?: string[];
  salary_min?: number;
  salary_max?: number;
  remote_allowed?: boolean;
  hybrid_allowed?: boolean;
  keywords?: string;
  company_ids?: string[];
  featured_only?: boolean;
  posted_within_days?: number;
}

// Distance calculation using Haversine formula
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number, 
  unit: 'miles' | 'km' = 'miles'
): number {
  const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Location-based job matching API class
export class LocationJobAPI {
  
  // Get user's location preferences
  static async getUserLocationPreferences(userId: string): Promise<UserLocationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_location_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user location preferences:', error);
      return null;
    }
  }

  // Update user's location preferences
  static async updateUserLocationPreferences(
    userId: string, 
    preferences: Partial<UserLocationPreferences>
  ): Promise<UserLocationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_location_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user location preferences:', error);
      return null;
    }
  }

  // Search jobs based on location and user preferences
  static async searchJobsByLocation(
    userLocation: { latitude: number; longitude: number },
    filters: JobSearchFilters = {},
    userId?: string
  ): Promise<JobWithLocation[]> {
    try {
      // Get user preferences if userId is provided
      let userPreferences: UserLocationPreferences | null = null;
      if (userId) {
        userPreferences = await this.getUserLocationPreferences(userId);
      }

      // Build the query
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies!inner(
            id,
            name,
            location
          )
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.job_types && filters.job_types.length > 0) {
        query = query.in('job_type', filters.job_types);
      }

      if (filters.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      if (filters.salary_min) {
        query = query.gte('salary_min', filters.salary_min);
      }

      if (filters.salary_max) {
        query = query.lte('salary_max', filters.salary_max);
      }

      if (filters.remote_allowed !== undefined) {
        query = query.eq('remote_allowed', filters.remote_allowed);
      }

      if (filters.hybrid_allowed !== undefined) {
        query = query.eq('hybrid_allowed', filters.hybrid_allowed);
      }

      if (filters.featured_only) {
        query = query.eq('featured', true);
      }

      if (filters.posted_within_days) {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - filters.posted_within_days);
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      if (filters.keywords) {
        query = query.or(`
          title.ilike.%${filters.keywords}%,
          description.ilike.%${filters.keywords}%,
          skills.cs.{${filters.keywords}}
        `);
      }

      const { data: jobs, error } = await query;

      if (error) throw error;

      // Calculate distances and filter by location
      const maxDistance = filters.max_distance || 
                         userPreferences?.max_travel_distance || 
                         25; // Default 25 miles

      const jobsWithDistance = jobs
        .map((job: any) => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            job.location.latitude,
            job.location.longitude
          );

          return {
            ...job,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
            company: job.companies.name
          };
        })
        .filter((job: any) => {
          // Filter by distance unless it's remote/hybrid
          if (job.remote_allowed || job.hybrid_allowed) {
            return true;
          }
          return job.distance <= maxDistance;
        })
        .sort((a: any, b: any) => {
          // Sort by distance, then by featured status, then by creation date
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.distance !== b.distance) return a.distance - b.distance;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

      return jobsWithDistance;
    } catch (error) {
      console.error('Error searching jobs by location:', error);
      return [];
    }
  }

  // Get recommended jobs based on user preferences and location
  static async getRecommendedJobs(
    userId: string,
    limit: number = 20
  ): Promise<JobWithLocation[]> {
    try {
      const userPreferences = await this.getUserLocationPreferences(userId);
      
      if (!userPreferences) {
        throw new Error('User location preferences not found');
      }

      const filters: JobSearchFilters = {
        location: {
          latitude: userPreferences.current_location.latitude,
          longitude: userPreferences.current_location.longitude
        },
        max_distance: userPreferences.max_travel_distance,
        job_types: userPreferences.job_types,
        categories: userPreferences.preferred_categories,
        salary_min: userPreferences.salary_expectations.min,
        remote_allowed: userPreferences.remote_preference === 'remote_only' || 
                       userPreferences.remote_preference === 'no_preference',
        hybrid_allowed: userPreferences.remote_preference === 'hybrid' || 
                       userPreferences.remote_preference === 'no_preference'
      };

      const jobs = await this.searchJobsByLocation(
        userPreferences.current_location,
        filters,
        userId
      );

      return jobs.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommended jobs:', error);
      return [];
    }
  }

  // Get jobs near a specific location
  static async getJobsNearLocation(
    latitude: number,
    longitude: number,
    radiusInMiles: number = 10,
    limit: number = 50
  ): Promise<JobWithLocation[]> {
    try {
      const filters: JobSearchFilters = {
        location: { latitude, longitude },
        max_distance: radiusInMiles
      };

      return await this.searchJobsByLocation(
        { latitude, longitude },
        filters
      );
    } catch (error) {
      console.error('Error getting jobs near location:', error);
      return [];
    }
  }

  // Save a job for later
  static async saveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .upsert({
          user_id: userId,
          job_id: jobId,
          saved_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      return false;
    }
  }

  // Remove a saved job
  static async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsaving job:', error);
      return false;
    }
  }

  // Get user's saved jobs
  static async getSavedJobs(userId: string): Promise<JobWithLocation[]> {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          jobs!inner(
            *,
            companies!inner(
              id,
              name,
              location
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data.map((item: any) => ({
        ...item.jobs,
        company: item.jobs.companies.name
      }));
    } catch (error) {
      console.error('Error getting saved jobs:', error);
      return [];
    }
  }

  // Apply to a job
  static async applyToJob(
    userId: string, 
    jobId: string, 
    applicationData: {
      cover_letter?: string;
      resume_url?: string;
      additional_info?: string;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: userId,
          job_id: jobId,
          ...applicationData,
          applied_at: new Date().toISOString(),
          status: 'pending'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  }
}