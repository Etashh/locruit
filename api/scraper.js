import axios from 'axios';

// Your Adzuna credentials
const APP_ID = '78e4d905';
const APP_KEY = '4f87b30d0df83027582195e7fd260043';
const COUNTRY = 'in'; // India country code for Adzuna API

// In-memory storage for local jobs (in production, you'd use a database)
let localJobs = [];

// CORS helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
}

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

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // Health check endpoint
  if (pathname === '/api/health') {
    return res.json({ status: 'OK' });
  }

  // Local jobs endpoints
  if (pathname === '/api/local-jobs') {
    if (req.method === 'POST') {
      const job = req.body;
      if (!job || !job.title || !job.company || !job.location || !job.lat || !job.lon) {
        return res.status(400).json({ error: 'Missing required job fields.' });
      }
      job.id = `local-${Date.now()}-${Math.floor(Math.random()*10000)}`;
      job.created = new Date().toISOString();
      localJobs.push(job);
      return res.json({ success: true, job });
    } else if (req.method === 'GET') {
      const { lat, lon, radius = 5 } = req.query;
      if (lat && lon) {
        const R = 3959;
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
      return res.json(localJobs);
    }
  }

  // Scrape endpoint
  if (pathname === '/api/scrape') {
    const { lat, lon, location, skills = '' } = req.query;
    const distance = 5;
    console.log('Request received with params:', req.query);
    
    const searchStrategies = [];
    
    // Strategy 1: Precise coordinates
    if (lat && lon) {
      searchStrategies.push({
        strategy: 'precise_coordinates',
        url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&latitude=${lat}&longitude=${lon}&distance=${distance}&max_days_old=30&sort_by=date`
      });
    }
    
    // Strategy 2: Specific location
    if (location && location.trim()) {
      searchStrategies.push({
        strategy: 'specific_location',
        url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&where=${encodeURIComponent(location.trim())}&max_days_old=30&sort_by=date`
      });
    }
    
    // Strategy 3: Skills only
    if (skills && skills.trim()) {
      searchStrategies.push({
        strategy: 'skills_only',
        url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=${encodeURIComponent(skills.trim())}&max_days_old=30&sort_by=date`
      });
    }
    
    // Fallback strategy
    searchStrategies.push({
      strategy: 'country_fallback',
      url: `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20${skills ? '&what=' + encodeURIComponent(skills) : ''}&sort_by=date&max_days_old=7`
    });

    // Try each strategy
    let successResult = null;
    for (const strategy of searchStrategies) {
      console.log(`Trying strategy: ${strategy.strategy}`);
      const result = await fetchJobsWithStrategy(strategy);
      if (result.success) {
        successResult = result;
        break;
      }
    }

    if (successResult) {
      let jobs = successResult.data.results.map((job, index) => {
        let extractedSkills = [];
        if (job.description) {
          const skillKeywords = ['javascript', 'react', 'angular', 'vue', 'node', 'python', 'java'];
          extractedSkills = skillKeywords.filter(skill => 
            job.description.toLowerCase().includes(skill.toLowerCase())
          );
        }
        
        let jobType = "Full-time";
        const lowerTitle = job.title?.toLowerCase() || '';
        if (lowerTitle.includes('intern') || lowerTitle.includes('internship')) {
          jobType = "Internship";
        }
        
        return {
          id: job.id,
          title: job.title || 'Job Title Not Available',
          company: job.company?.display_name || 'Unknown Company',
          location: job.location?.display_name || 'Location not specified',
          latitude: job.latitude,
          longitude: job.longitude,
          description: job.description || 'No description available',
          salary_min: job.salary_min || null,
          salary_max: job.salary_max || null,
          created: job.created || new Date().toISOString(),
          distance: job.distance || null,
          contact_email: job.contact_email || job.email || null,
          contact_phone: job.contact_phone || null,
          contact_url: job.contact_url || null,
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
      
      jobs = jobs.filter(job => !job.distance || job.distance <= 5);
      
      // Add local jobs
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
      
      jobs = [...localNearbyJobs, ...jobs];
      return res.json(jobs);
    } else {
      return res.status(404).json({
        error: 'No jobs found with any search strategy',
        message: 'We tried multiple locations and search methods but couldn\'t find matching jobs',
        searchParams: { location, lat, lon, skills }
      });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
