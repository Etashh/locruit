-- Location-based Job Matching Database Schema
-- Run this in your Supabase SQL editor

-- Enable PostGIS extension for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(255),
  location JSONB NOT NULL, -- {address, city, state, country, latitude, longitude}
  industry VARCHAR(100),
  size VARCHAR(50), -- 'startup', 'small', 'medium', 'large', 'enterprise'
  founded_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE
);

-- Jobs table with location data
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  skills TEXT[],
  job_type VARCHAR(20) CHECK (job_type IN ('internship', 'part-time', 'full-time', 'contract')),
  category VARCHAR(100) NOT NULL,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  salary_type VARCHAR(10) CHECK (salary_type IN ('hourly', 'monthly', 'yearly')),
  location JSONB NOT NULL, -- {address, city, state, country, latitude, longitude, postal_code}
  location_point GEOGRAPHY(POINT, 4326), -- PostGIS point for efficient spatial queries
  remote_allowed BOOLEAN DEFAULT FALSE,
  hybrid_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  application_deadline TIMESTAMP WITH TIME ZONE,
  contact_email VARCHAR(255),
  application_url VARCHAR(500),
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0
);

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS idx_jobs_location_point ON jobs USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs (featured);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at);

-- User location preferences table
CREATE TABLE IF NOT EXISTS user_location_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  max_travel_distance DECIMAL(5,2) DEFAULT 25.0, -- in miles
  preferred_locations TEXT[], -- Array of preferred cities/areas
  current_location JSONB NOT NULL, -- {latitude, longitude, address, city, state}
  current_location_point GEOGRAPHY(POINT, 4326), -- PostGIS point
  transportation_mode VARCHAR(20) CHECK (transportation_mode IN ('walking', 'cycling', 'driving', 'public_transport')) DEFAULT 'driving',
  remote_preference VARCHAR(20) CHECK (remote_preference IN ('remote_only', 'hybrid', 'on_site', 'no_preference')) DEFAULT 'no_preference',
  job_types TEXT[] DEFAULT ARRAY['internship', 'part-time'], -- Array of preferred job types
  preferred_categories TEXT[], -- Array of preferred job categories
  salary_expectations JSONB, -- {min, max, type}
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for user locations
CREATE INDEX IF NOT EXISTS idx_user_location_point ON user_location_preferences USING GIST (current_location_point);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url VARCHAR(500),
  additional_info TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')) DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Job views tracking table
CREATE TABLE IF NOT EXISTS job_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Search history table for analytics
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT,
  filters JSONB,
  location JSONB, -- {latitude, longitude, address}
  results_count INTEGER,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers to update location_point when location JSONB is updated
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location IS NOT NULL AND NEW.location ? 'latitude' AND NEW.location ? 'longitude' THEN
    NEW.location_point = ST_SetSRID(ST_MakePoint(
      (NEW.location->>'longitude')::FLOAT,
      (NEW.location->>'latitude')::FLOAT
    ), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to jobs table
DROP TRIGGER IF EXISTS trigger_update_jobs_location_point ON jobs;
CREATE TRIGGER trigger_update_jobs_location_point
  BEFORE INSERT OR UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_location_point();

-- Apply trigger to user_location_preferences table
CREATE OR REPLACE FUNCTION update_user_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_location IS NOT NULL AND NEW.current_location ? 'latitude' AND NEW.current_location ? 'longitude' THEN
    NEW.current_location_point = ST_SetSRID(ST_MakePoint(
      (NEW.current_location->>'longitude')::FLOAT,
      (NEW.current_location->>'latitude')::FLOAT
    ), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_location_point ON user_location_preferences;
CREATE TRIGGER trigger_update_user_location_point
  BEFORE INSERT OR UPDATE ON user_location_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_location_point();

-- Function to find jobs within a certain distance
CREATE OR REPLACE FUNCTION find_jobs_within_distance(
  user_lat FLOAT,
  user_lng FLOAT,
  max_distance_miles FLOAT DEFAULT 25,
  job_types TEXT[] DEFAULT NULL,
  categories TEXT[] DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  job_id UUID,
  title VARCHAR,
  company_name VARCHAR,
  job_type VARCHAR,
  category VARCHAR,
  location JSONB,
  distance_miles FLOAT,
  salary_min DECIMAL,
  salary_max DECIMAL,
  remote_allowed BOOLEAN,
  hybrid_allowed BOOLEAN,
  featured BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    c.name,
    j.job_type,
    j.category,
    j.location,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      j.location_point
    ) * 0.000621371 AS distance_miles, -- Convert meters to miles
    j.salary_min,
    j.salary_max,
    j.remote_allowed,
    j.hybrid_allowed,
    j.featured,
    j.created_at
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  WHERE 
    j.is_active = TRUE
    AND (
      j.remote_allowed = TRUE 
      OR j.hybrid_allowed = TRUE 
      OR ST_DWithin(
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        j.location_point,
        max_distance_miles * 1609.34 -- Convert miles to meters
      )
    )
    AND (job_types IS NULL OR j.job_type = ANY(job_types))
    AND (categories IS NULL OR j.category = ANY(categories))
  ORDER BY 
    j.featured DESC,
    distance_miles ASC,
    j.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE user_location_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_location_preferences
CREATE POLICY "Users can view own location preferences" ON user_location_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own location preferences" ON user_location_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for saved_jobs
CREATE POLICY "Users can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for job_applications
CREATE POLICY "Users can manage own applications" ON job_applications
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for job_views
CREATE POLICY "Users can view own job views" ON job_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert job views" ON job_views
  FOR INSERT WITH CHECK (true);

-- RLS policies for search_history
CREATE POLICY "Users can view own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- Sample data insertion (optional)
-- Insert sample companies
INSERT INTO companies (name, description, location, industry, size) VALUES
('TechStart Inc.', 'Innovative startup focused on AI solutions', 
 '{"address": "123 Tech St", "city": "San Francisco", "state": "CA", "country": "USA", "latitude": 37.7749, "longitude": -122.4194}',
 'Technology', 'startup'),
('Green Energy Corp', 'Renewable energy solutions provider',
 '{"address": "456 Solar Ave", "city": "Austin", "state": "TX", "country": "USA", "latitude": 30.2672, "longitude": -97.7431}',
 'Energy', 'medium'),
('Local Coffee Co.', 'Community-focused coffee shop chain',
 '{"address": "789 Main St", "city": "Portland", "state": "OR", "country": "USA", "latitude": 45.5152, "longitude": -122.6784}',
 'Food & Beverage', 'small');

-- Insert sample jobs (will be populated by the trigger with location_point)
INSERT INTO jobs (company_id, title, description, requirements, skills, job_type, category, salary_min, salary_max, salary_type, location, remote_allowed, hybrid_allowed, featured) 
SELECT 
  c.id,
  'Software Engineering Intern',
  'Join our team to work on cutting-edge AI projects and gain hands-on experience with modern technologies.',
  ARRAY['Currently enrolled in Computer Science or related field', 'Basic programming knowledge', 'Strong problem-solving skills'],
  ARRAY['Python', 'JavaScript', 'React', 'Git'],
  'internship',
  'Technology',
  18.00,
  25.00,
  'hourly',
  c.location,
  true,
  true,
  true
FROM companies c WHERE c.name = 'TechStart Inc.';