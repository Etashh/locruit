const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Your Adzuna credentials
const APP_ID = '78e4d905';
const APP_KEY = '4f87b30d0df83027582195e7fd260043';
const COUNTRY = 'in'; // India country code for Adzuna API

// Enable CORS and JSON parsing with specific origin for your frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dedicated CORS middleware with more permissive settings
app.use((req, res, next) => {
  // Allow specific origins or use wildcard
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// In-memory storage for local jobs
let localJobs = [];

// Endpoint to post a new local job
app.post('/api/local-jobs', (req, res) => {
  const job = req.body;
  if (!job || !job.title || !job.company || !job.location || !job.lat || !job.lon) {
    return res.status(400).json({ error: 'Missing required job fields.' });
  }
  job.id = `local-${Date.now()}-${Math.floor(Math.random()*10000)}`;
  job.created = new Date().toISOString();
  localJobs.push(job);
  res.json({ success: true, job });
});

// Endpoint to fetch all local jobs (optionally filter by lat/lon/radius)
app.get('/api/local-jobs', (req, res) => {
  const { lat, lon, radius = 5 } = req.query;
  if (lat && lon) {
    // Only return jobs within radius (miles)
    const R = 3959; // Earth radius in miles
    const toRad = deg => deg * Math.PI / 180;
    const jobs = localJobs.filter(job => {
      if (!job.lat || !job.lon) return false;
      const dLat = toRad(job.lat - lat);
      const dLon = toRad(job.lon - lon);
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat)) * Math.cos(toRad(job.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = R * c;
      return dist <= radius;
    });
    return res.json(jobs);
  }
  res.json(localJobs);
});

// Helper function to fetch jobs with different strategies
async function fetchJobsWithStrategy(params, retryCount = 0) {
  try {
    const response = await axios.get(params.url, { timeout: 10000 });
    
    if (response.data?.results && response.data.results.length > 0) {
      console.log(`Strategy succeeded: ${params.strategy} - Found ${response.data.results.length} jobs`);
      return {
        success: true,
        data: response.data,
        strategy: params.strategy
      };
    } else {
      console.log(`Strategy failed: ${params.strategy} - No jobs found`);
      return { success: false, strategy: params.strategy };
    }
  } catch (error) {
    console.error(`Strategy error: ${params.strategy}`, error.message);
    return { 
      success: false, 
      error: error,
      strategy: params.strategy 
    };
  }
}

app.get('/scrape', async (req, res) => {
  // Extract query parameters
  const { lat, lon, location, skills = '' } = req.query;
  const distance = 5; // Force max 5 miles for hyperlocal
  console.log('Request received with params:', req.query);
  
  // Prepare search strategies in order of preference (most local to most general)
  const searchStrategies = [];
  
  // Strategy 1: Precise coordinates with forced hyperlocal distance
  if (lat && lon) {
    searchStrategies.push({
      strategy: 'precise_coordinates',
      url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&latitude=${lat}&longitude=${lon}&distance=${distance}&max_days_old=30&sort_by=date`
    });
    // Strategy 2: Same coordinates with slightly wider radius (still hyperlocal)
    searchStrategies.push({
      strategy: 'wider_coordinates',
      url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&latitude=${lat}&longitude=${lon}&distance=10&max_days_old=30&sort_by=date`
    });
  }
  
  // Strategy 3: Specific location name if provided
  if (location && location.trim()) {
    searchStrategies.push({
      strategy: 'specific_location',
      url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&where=${encodeURIComponent(location.trim())}&max_days_old=30&sort_by=date`
    });
  }
  
  // Strategy 4: Skills-only search with no location constraint
  if (skills && skills.trim()) {
    searchStrategies.push({
      strategy: 'skills_only',
      url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=${encodeURIComponent(skills.trim())}&max_days_old=30&sort_by=date`
    });
  }
  
  // Strategy 5: Fallback to major cities
  const majorCities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  
  if (skills && skills.trim()) {
    // Add major cities with skills
    majorCities.forEach(city => {
      searchStrategies.push({
        strategy: `major_city_${city.toLowerCase()}`,
        url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=${encodeURIComponent(skills.trim())}&where=${encodeURIComponent(city)}&max_days_old=30&sort_by=date`
      });
    });
  }
  
  // Strategy 6: Last resort - recent jobs in India
  searchStrategies.push({
    strategy: 'country_fallback',
    url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&sort_by=date&max_days_old=7`
  });

  // Try each strategy in sequence until one works
  let successResult = null;
  
  for (const strategy of searchStrategies) {
    console.log(`Trying strategy: ${strategy.strategy}`);
    const result = await fetchJobsWithStrategy(strategy);
    
    if (result.success) {
      successResult = result;
      break;
    }
  }

  // Handle results or return error
  if (successResult) {
    // Log the first job to check its raw structure
    console.log('Raw job from Adzuna API:', 
                successResult.data.results.length > 0 ? 
                JSON.stringify(successResult.data.results[0], null, 2) : 
                'No jobs found');
    
    // Convert Adzuna results to the exact format expected by your frontend components
    let jobs = successResult.data.results.map((job, index) => {
      // Extract skills from the description if available (simple extraction)
      let extractedSkills = [];
      if (job.description) {
        const skillKeywords = ['javascript', 'react', 'angular', 'vue', 'node', 'python', 'java', 
                              'c++', 'c#', 'typescript', 'php', 'ruby', 'swift', 'kotlin', 'flutter', 
                              'react native', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 
                              'mongodb', 'nosql', 'html', 'css', 'git', 'figma', 'sketch', 'adobe', 
                              'photoshop', 'illustrator', 'xd', 'ui', 'ux'];
        
        extractedSkills = skillKeywords.filter(skill => 
          job.description.toLowerCase().includes(skill.toLowerCase())
        );
      }
      
      // Generate job type based on title or category (simple heuristic)
      let jobType = "Full-time";
      const lowerTitle = job.title?.toLowerCase() || '';
      if (lowerTitle.includes('intern') || lowerTitle.includes('internship')) {
        jobType = "Internship";
      } else if (lowerTitle.includes('part-time') || lowerTitle.includes('part time')) {
        jobType = "Part-time";
      }
      
      // Construct a complete job object that matches the Job interface
      return {
        id: job.id,
        title: job.title || 'Job Title Not Available',
        company: job.company?.display_name || 'Unknown Company',
        location: job.location?.display_name || 'Location not specified',
        latitude: job.latitude,
        longitude: job.longitude,
        description: job.description || 'No description available',
        // redirect_url: job.redirect_url, // REMOVE THIS
        salary_min: job.salary_min || null,
        salary_max: job.salary_max || null,
        created: job.created || new Date().toISOString(),
        distance: job.distance || null,
        // Contact info if available
        contact_email: job.contact_email || job.email || null,
        contact_phone: job.contact_phone || null,
        contact_url: job.contact_url || null,
        // These fields are critical for the frontend Job interface
        type: jobType,
        category: job.category?.label || "General",
        salary: job.salary_min && job.salary_max ? 
                `$${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()}` : 
                job.salary_min ? `$${job.salary_min.toLocaleString()}+` : 'Salary not specified',
        posted: job.created ? new Date(job.created).toLocaleDateString() : 'Recently',
        skills: extractedSkills.length > 0 ? extractedSkills : ['General'],
        featured: index < 2,
        search_strategy: successResult.strategy
      };
    });
    // Filter out jobs farther than 5 miles
    jobs = jobs.filter(job => !job.distance || job.distance <= 5);
    
    // Fetch local jobs for the same area
    let userLat = lat ? parseFloat(lat) : null;
    let userLon = lon ? parseFloat(lon) : null;
    let localNearbyJobs = [];
    if (userLat && userLon) {
      localNearbyJobs = localJobs.filter(job => {
        const R = 3959;
        const toRad = deg => deg * Math.PI / 180;
        const dLat = toRad(job.lat - userLat);
        const dLon = toRad(job.lon - userLon);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(userLat)) * Math.cos(toRad(job.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        return dist <= 5;
      });
    }
    // Merge local jobs and Adzuna jobs
    jobs = [...localNearbyJobs, ...jobs];
    
    return res.json(jobs);
  } else {
    return res.status(404).json({
      error: 'No jobs found with any search strategy',
      message: 'We tried multiple locations and search methods but couldn\'t find matching jobs',
      searchParams: { location, lat, lon, skills }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Adzuna API scraper server listening at http://localhost:${port}`);
});
