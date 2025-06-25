import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Briefcase, Search, Bell, Building2, BookOpen, Calendar, Home, FileText } from "lucide-react";
import { Link, useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import LocationSetup from "@/components/LocationSetup";
import JobsHeader from "@/components/JobsHeader";
import JobsSearchFilters from "@/components/JobsSearchFilters";
import JobsList from "@/components/JobsList";
import { useToast } from "@/hooks/use-toast";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabase } from "@/lib/supabaseClient";
import AuthCheck from "@/components/AuthCheck";
import { getCombinedJobs } from "@/services/jobService";
import "../animations.css";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState("10"); // Default distance in miles (as string to match component)
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userLocation } = useLocation();
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // User state similar to dashboard for consistent UI
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    profilePhoto: null as string | null,
    isLoggedIn: false
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profileData = JSON.parse(userProfile);
          setUser({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
            email: profileData.email || '',
            profilePhoto: profileData.photo || null,
            isLoggedIn: true
          });
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch jobs based on location
  useEffect(() => {
    setIsLoading(true);
    let locationQuery = "";
    let locationLabel = "";
    // Prefer navigation state from LocationHandler
    if (routerLocation.state && routerLocation.state.location) {
      const loc = routerLocation.state.location;
      if (loc.place) {
        locationQuery = `location=${encodeURIComponent(loc.place)}`;
        locationLabel = loc.place;
      } else if (loc.zip) {
        locationQuery = `zip=${encodeURIComponent(loc.zip)}`;
        locationLabel = loc.zip;
      } else if (loc.lat && loc.lon) {
        locationQuery = `lat=${loc.lat}&lon=${loc.lon}`;
        locationLabel = `${loc.lat},${loc.lon}`;
      }
    } else if (userLocation) {
      locationQuery = `lat=${userLocation.lat}&lon=${userLocation.lng}`;
      locationLabel = `${userLocation.lat},${userLocation.lng}`;
    }

    console.log("%c Location Data: ", "background: #4CAF50; color: white", { 
      userLocation, 
      routerLocation: routerLocation.state?.location,
      locationQuery
    });

    if (!locationQuery) {
      setError("No location provided. Please go back and set your location.");
      setIsLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setError(null);
        // Include the search query if available
        // Convert distance string to number for the API
        const distanceValue = parseInt(distance, 10) || 10;
        
        // Use direct API URL to avoid proxy issues
        let url = `http://localhost:3001/scrape?${locationQuery}&distance=${distanceValue}`;
        
        if (searchQuery) {
          url += `&skills=${encodeURIComponent(searchQuery)}`;
        }
        console.log(`%c Fetching jobs from: ${url}`, "background: #2196F3; color: white");
        
        console.log("Sending request to API...");
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors', 
          credentials: 'omit' // Changed from 'same-origin' to 'omit' to avoid cookie issues
        });
        
        console.log("%c API response status:", "font-weight: bold", response.status, response.statusText);
        
        if (!response.ok) {
          let errorMessage = `Failed to fetch jobs: ${response.statusText}`;
          try {
            const errorData = await response.json();
            console.error("API error response:", errorData);
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error("Could not parse error response:", parseError);
          }
          throw new Error(errorMessage);
        }
        
        // Parse the JSON response
        let data;
        try {
          data = await response.json();
          console.log(`Received ${Array.isArray(data) ? data.length : 0} jobs from API`);
          console.log("Sample job data:", data.length > 0 ? data[0] : "No jobs found");
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          throw new Error("Invalid response format from job search API");
        }
        
        // If data is not an array or is empty, provide user-friendly message
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No jobs found matching your search criteria. Try adjusting your filters or location.");
        }
        
        console.log("%c Raw job data received:", "background: #9C27B0; color: white", data);
        
        // Transform Adzuna job data to match our application's structure
        const transformedJobs = data.map((job, index) => {
          // Debug each job conversion with more visibility
          console.log(`%c Processing job ${index}:`, "background: #673AB7; color: white", job);
          
          try {
            // Make sure all required properties exist with sensible defaults
            const transformedJob = {
              id: job.id || `job-${index}-${Math.random().toString(36).substring(2, 8)}`,
              title: job.title || 'Job Title Not Available',
              company: job.company || 'Company Not Specified',
              location: job.location || 'Remote/Unspecified',
              distance: typeof job.distance === 'number' ? job.distance : null,
              type: job.category === 'internship' ? 'Internship' : 
                   job.category === 'part-time' ? 'Part-time' : 
                   job.category === 'full-time' ? 'Full-time' : 'Other',
              category: job.category || 'General',
              salary: job.salary_min && job.salary_max ? 
                   `$${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()}` : 
                   job.salary_min ? 
                   `$${job.salary_min.toLocaleString()}+` : 'Salary not specified',
              posted: job.created ? new Date(job.created).toLocaleDateString() : 'Recently',
              description: job.description || 'No description available',
              skills: Array.isArray(job.skills) ? job.skills : [],
              featured: Boolean(job.featured) || false,
              redirect_url: job.redirect_url || null
            };
            
            console.log(`%c Job ${index} transformed:`, "background: #009688; color: white", transformedJob);
            return transformedJob;
            
          } catch (jobError) {
            console.error("%c Error transforming job data:", "background: red; color: white", jobError, job);
            // Return a minimal valid job object if transformation fails
            return {
              id: `error-job-${index}-${Math.random().toString(36).substring(2, 8)}`,
              title: "Job data error",
              company: "Unknown",
              location: "Unknown",
              distance: null,
              type: "Other",
              category: "General",
              salary: "Not specified",
              posted: "Recently",
              description: "There was an error processing this job listing.",
              skills: [],
              featured: false
            };
          }
        });
        
        // Combine with local jobs
        const combinedJobs = getCombinedJobs(transformedJobs);
        
        setJobs(combinedJobs);
        setFilteredJobs(combinedJobs);
        
        // Cache the jobs list in localStorage for demo purposes
        localStorage.setItem("jobsList", JSON.stringify(combinedJobs));
        
        console.log(`Total jobs displayed: ${combinedJobs.length} (${transformedJobs.length} from API + ${combinedJobs.length - transformedJobs.length} local)`);
      } catch (e) {
        console.error("Error fetching jobs:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [userLocation, distance, routerLocation.state]);

  // Filter jobs based on search and filters
  useEffect(() => {
    if (jobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    try {
      let filtered = jobs.filter(job => {
        // Check if the job title, company, or skills match the search query
        const matchesSearch = searchQuery === "" || 
          (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.company && job.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.skills && Array.isArray(job.skills) && job.skills.some(skill => 
            typeof skill === 'string' && skill.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
          (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Check if the job matches the distance filter
        const distanceValue = parseInt(String(distance), 10);
        const jobDistance = typeof job.distance === 'number' ? job.distance : 999;
        
        const matchesDistance = isNaN(distanceValue) || 
                               distanceValue === 0 || 
                               jobDistance <= distanceValue;
                               
        // Check if the job should be filtered by local only status
        const isLocalJob = job.isLocal === true;
        const matchesLocalFilter = !showLocalOnly || isLocalJob;

        return matchesSearch && matchesDistance && matchesLocalFilter;
      });

      setFilteredJobs(filtered);
    } catch (error) {
      console.error("Error filtering jobs:", error);
      setFilteredJobs([]);
    }
  }, [jobs, searchQuery, distance, showLocalOnly]);

  const handleDistanceChange = (e) => {
    // Handle both direct event objects and string values
    const newValue = e.target ? e.target.value : e;
    setDistance(newValue); // Store distance as string to match component
    console.log("Distance changed to:", newValue);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Navigation with Dashboard Style */}
        <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                LoCruit
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/jobs" className="flex items-center space-x-1 text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>
              <Link to="/network" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Users className="w-4 h-4" />
                <span>Network</span>
              </Link>
              <Link to="/schedule" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user.isLoggedIn ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => toast({ title: "Notifications", description: "No new notifications" })} className="relative hover:scale-105 transition-transform duration-200">
                    <Bell className="h-5 w-5 text-gray-700" />
                  </Button>
                  <ProfileDropdown 
                    name={user.name} 
                    email={user.email}
                    photoUrl={user.profilePhoto}
                  />
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Home</span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" className="hover:bg-blue-50 hover:scale-105 transition-transform duration-200">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-transform duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        
        {/* Mobile Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="grid grid-cols-4 max-w-md mx-auto">
            <Link to="/dashboard" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Dashboard</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center py-3 bg-blue-50">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-xs mt-1 text-blue-600 font-medium">Jobs</span>
            </Link>
            <Link to="/network" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Network</span>
            </Link>
            <Link to="/schedule" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Schedule</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 mb-16 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Searching Jobs</h2>
            <p className="text-gray-600">We're finding the best job matches based on your location and preferences...</p>
            <div className="mt-8 max-w-xs mx-auto">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-green-600 animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Navigation with Dashboard Style */}
        <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                LoCruit
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/jobs" className="flex items-center space-x-1 text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>
              <Link to="/network" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Users className="w-4 h-4" />
                <span>Network</span>
              </Link>
              <Link to="/schedule" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user.isLoggedIn ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => toast({ title: "Notifications", description: "No new notifications" })} className="relative hover:scale-105 transition-transform duration-200">
                    <Bell className="h-5 w-5 text-gray-700" />
                  </Button>
                  <ProfileDropdown 
                    name={user.name} 
                    email={user.email}
                    photoUrl={user.profilePhoto}
                  />
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Home</span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" className="hover:bg-blue-50 hover:scale-105 transition-transform duration-200">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-transform duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        
        {/* Mobile Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="grid grid-cols-4 max-w-md mx-auto">
            <Link to="/dashboard" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Dashboard</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center py-3 bg-blue-50">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-xs mt-1 text-blue-600 font-medium">Jobs</span>
            </Link>
            <Link to="/network" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Network</span>
            </Link>
            <Link to="/schedule" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Schedule</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 mb-16 flex justify-center animate-fade-in">
          <div className="text-center max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Search Error</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
              <p className="text-red-700">{error}</p>
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble finding jobs for your location. This could be due to:
            </p>
            <ul className="text-left text-gray-600 mb-6 list-disc pl-5">
              <li>No jobs matching your criteria</li>
              <li>Connection issues with our job database</li>
              <li>Location services not properly enabled</li>
            </ul>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Try Again
              </Button>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="hover:scale-105 transition-transform duration-200 w-full"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation with Dashboard Style */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 animate-fade-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              LoCruit
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/jobs" className="flex items-center space-x-1 text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
            </Link>
            <Link to="/network" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <Users className="w-4 h-4" />
              <span>Network</span>
            </Link>
            <Link to="/schedule" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => toast({ title: "Notifications", description: "No new notifications" })} className="relative hover:scale-105 transition-transform duration-200">
                  <Bell className="h-5 w-5 text-gray-700" />
                </Button>
                <ProfileDropdown 
                  name={user.name} 
                  email={user.email}
                  photoUrl={user.profilePhoto}
                />
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-blue-50 hover:scale-105 transition-transform duration-200">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-transform duration-200">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Footer (displays on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="grid grid-cols-4 max-w-md mx-auto">
          <Link to="/dashboard" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
            <Home className="w-5 h-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Dashboard</span>
          </Link>
          <Link to="/jobs" className="flex flex-col items-center py-3 bg-blue-50">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-xs mt-1 text-blue-600 font-medium">Jobs</span>
          </Link>
          <Link to="/network" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Network</span>
          </Link>
          <Link to="/schedule" className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors duration-200">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Schedule</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 mb-16">
        <div className="animate-scale-in">
          <JobsHeader />
        </div>

        {/* Location Setup */}
        <div className="mb-8 animate-fade-in">
          <LocationSetup />
        </div>

        {userLocation ? (
          <>
            {/* Debug info */}
            {console.log('Rendering with filteredJobs:', filteredJobs)}
            {console.log('userLocation:', userLocation)}
            
            <div className="mb-4 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance (miles):
              </label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={handleDistanceChange}
                min="1"
                max="100"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <JobsSearchFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                distanceFilter={distance}
                setDistanceFilter={setDistance}
                jobTypeFilter="all_types"
                setJobTypeFilter={() => {}}
                categoryFilter="all_categories"
                setCategoryFilter={() => {}}
                showLocalOnly={showLocalOnly}
                setShowLocalOnly={setShowLocalOnly}
              />
            </div>

            <div className="animate-slide-in-right" style={{ animationDelay: '300ms' }}>
              <JobsList
                filteredJobs={filteredJobs}
                userLocationAddress={userLocation?.address || "your location"}
              />
            </div>
            
            {/* Dashboard-like Quick Actions */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md p-6 h-auto flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/resume-generator')}
                >
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="text-center">Optimize Your Resume</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md p-6 h-auto flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/profile-setup')}
                >
                  <BookOpen className="w-8 h-8 text-green-600" />
                  <span className="text-center">Update Your Profile</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md p-6 h-auto flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/network')}
                >
                  <Users className="w-8 h-8 text-purple-600" />
                  <span className="text-center">Grow Your Network</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-600 mb-4">Please enable location access to see job opportunities near you.</p>
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-green-600 hover:scale-105 transition-all duration-300">
              Enable Location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
