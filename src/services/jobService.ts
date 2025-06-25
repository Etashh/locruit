// Mock job data generator based on location
export interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  distance?: number | null;
  type: "Internship" | "Part-time" | "Full-time" | "Other";
  category: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  featured: boolean;
  // redirect_url?: string;  // No longer used for external job applications
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_url?: string | null;
}

const jobTemplates = [
  {
    title: "Frontend Developer Intern",
    type: "Internship" as const,
    category: "Technology",
    salary: "$15-20/hour",
    description: "Learn React and modern web development while working on real projects.",
    skills: ["React", "JavaScript", "HTML/CSS"]
  },
  {
    title: "Marketing Assistant",
    type: "Part-time" as const,
    category: "Marketing",
    salary: "$12-16/hour",
    description: "Help create social media content and assist with marketing campaigns.",
    skills: ["Social Media", "Writing", "Design"]
  },
  {
    title: "Tutor - Mathematics",
    type: "Part-time" as const,
    category: "Education",
    salary: "$18-25/hour",
    description: "Help high school students with algebra and calculus.",
    skills: ["Tutoring", "Mathematics", "Communication"]
  },
  {
    title: "Graphic Design Intern",
    type: "Internship" as const,
    category: "Design",
    salary: "$14-18/hour",
    description: "Create visual content for clients and learn industry-standard design tools.",
    skills: ["Photoshop", "Illustrator", "Creative Thinking"]
  },
  {
    title: "Data Entry Clerk",
    type: "Part-time" as const,
    category: "Administration",
    salary: "$10-14/hour",
    description: "Organize and input data for various business operations.",
    skills: ["Excel", "Attention to Detail", "Organization"]
  },
  {
    title: "Customer Service Representative",
    type: "Part-time" as const,
    category: "Customer Service",
    salary: "$13-17/hour",
    description: "Assist customers with inquiries and provide excellent service.",
    skills: ["Communication", "Problem Solving", "Patience"]
  }
];

const localBusinessTypes = [
  "Local Restaurant", "Coffee Shop", "Retail Store", "Gym & Fitness", "Bookstore",
  "Pet Store", "Pharmacy", "Clinic", "Dental Office", "Law Firm", "Accounting Firm",
  "Real Estate Agency", "Insurance Agency", "Auto Repair", "Hair Salon", "Spa",
  "Photography Studio", "Music Store", "Art Gallery", "Community Center"
];

const neighborhoods = [
  "Downtown", "Midtown", "University District", "Arts Quarter", "Business District",
  "Historic Center", "Riverside", "Uptown", "Shopping District", "Financial District"
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // Simple distance calculation (in miles)
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function generateLocalJobs(userLat: number, userLng: number, count: number = 10): Job[] {
  const jobs: Job[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
    const company = localBusinessTypes[Math.floor(Math.random() * localBusinessTypes.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    
    // Generate random location within 5 miles
    const distance = Math.random() * 5;
    const angle = Math.random() * 2 * Math.PI;
    const jobLat = userLat + (distance / 69) * Math.cos(angle);
    const jobLng = userLng + (distance / 69) * Math.sin(angle);
    
    const actualDistance = calculateDistance(userLat, userLng, jobLat, jobLng);
    
    jobs.push({
      id: i + 1,
      title: template.title,
      company,
      location: `${neighborhood}, ${actualDistance.toFixed(1)} miles away`,
      distance: actualDistance,
      type: template.type,
      category: template.category,
      salary: template.salary,
      posted: `${Math.floor(Math.random() * 7) + 1} day${Math.floor(Math.random() * 7) + 1 === 1 ? '' : 's'} ago`,
      description: template.description,
      skills: template.skills,
      featured: Math.random() < 0.3
    });
  }
  
  return jobs.sort((a, b) => a.distance - b.distance);
}

export function getLocalStats(userLocation: string) {
  // Generate realistic local stats based on location
  const baseStudents = 800 + Math.floor(Math.random() * 400);
  const baseEmployers = 300 + Math.floor(Math.random() * 200);
  const baseMatches = baseStudents * 2 + Math.floor(Math.random() * 500);
  
  return {
    activeStudents: baseStudents,
    localEmployers: baseEmployers,
    jobMatches: baseMatches,
    successRate: 92 + Math.floor(Math.random() * 6)
  };
}

// Get locally posted jobs from localStorage
export const getLocalJobs = (): Job[] => {
  try {
    const localJobs = JSON.parse(localStorage.getItem("localJobs") || "[]");
    return localJobs;
  } catch (error) {
    console.error("Error fetching local jobs:", error);
    return [];
  }
};

// Combine API jobs with local jobs and sort by distance
export const getCombinedJobs = (apiJobs: Job[]): Job[] => {
  const localJobs = getLocalJobs();
  const combined = [...apiJobs, ...localJobs];
  
  // Sort by distance if available, otherwise by posted date (most recent first)
  return combined.sort((a, b) => {
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    
    // If distance is not available, sort by posted date (assuming it's a date string)
    const dateA = new Date(a.posted);
    const dateB = new Date(b.posted);
    return dateB.getTime() - dateA.getTime();
  });
};
