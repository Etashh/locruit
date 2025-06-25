import { supabase } from '@/lib/supabaseClient';

export interface NetworkUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  organization?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  school?: string;
  profilePhoto?: string;
  skills?: string[];
  role?: string;
  distance?: number; // Distance from current user in miles
}

interface SearchParams {
  currentUserLocation?: {
    lat: number;
    lng: number;
  };
  organization?: string;
  school?: string;
  maxDistance?: number; // In miles
  searchQuery?: string;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Sample users data - in a real app, this would come from a database
const sampleUsers: NetworkUser[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@university.edu",
    organization: "University of California",
    school: "University of California",
    location: {
      lat: 37.8719,
      lng: -122.2585,
      address: "Berkeley, CA"
    },
    profilePhoto: null,
    skills: ["JavaScript", "React", "UI Design"],
    role: "Student"
  },
  {
    id: "user2",
    name: "Morgan Smith",
    firstName: "Morgan",
    lastName: "Smith",
    email: "morgan@university.edu",
    organization: "University of California",
    school: "University of California",
    location: {
      lat: 37.8719,
      lng: -122.2585,
      address: "Berkeley, CA"
    },
    profilePhoto: null,
    skills: ["Python", "Data Science", "Machine Learning"],
    role: "Graduate Student"
  },
  {
    id: "user3",
    name: "Taylor Williams",
    firstName: "Taylor",
    lastName: "Williams",
    email: "taylor@tech.com",
    organization: "Tech Solutions Inc",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    profilePhoto: null,
    skills: ["Project Management", "Marketing", "Business Development"],
    role: "Marketing Manager"
  },
  {
    id: "user4",
    name: "Jordan Lee",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan@university.edu",
    organization: "Stanford University",
    school: "Stanford University",
    location: {
      lat: 37.4275,
      lng: -122.1697,
      address: "Stanford, CA"
    },
    profilePhoto: null,
    skills: ["Research", "Biology", "Chemistry"],
    role: "Research Assistant"
  },
  {
    id: "user5",
    name: "Casey Martinez",
    firstName: "Casey",
    lastName: "Martinez",
    email: "casey@localshop.com",
    organization: "Local Coffee Shop",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    profilePhoto: null,
    skills: ["Customer Service", "Barista", "Food Service"],
    role: "Barista"
  }
];

// Function to get users based on different criteria
export const findUsersToConnect = async (params: SearchParams): Promise<NetworkUser[]> => {
  try {
    // In a real app, this would be a database query
    // For demo purposes, we'll filter our sample data based on the params
    
    if (!params.currentUserLocation) {
      // Without location, we can't do distance filtering
      return [];
    }
    
    const maxDist = params.maxDistance || 5; // Default to 5 miles if not specified
    
    const filteredUsers = sampleUsers.map(user => {
      // Skip users without location
      if (!user.location) {
        return { ...user, distance: Infinity };
      }
      
      // Calculate distance from current user
      const distance = calculateDistance(
        params.currentUserLocation!.lat,
        params.currentUserLocation!.lng,
        user.location.lat,
        user.location.lng
      );
      
      return { ...user, distance };
    })
    // Filter by maximum distance
    .filter(user => user.distance <= maxDist)
    // If organization is specified, filter by it
    .filter(user => !params.organization || user.organization === params.organization)
    // If school is specified, filter by it
    .filter(user => !params.school || user.school === params.school)
    // If search query is specified, filter by name or skills
    .filter(user => {
      if (!params.searchQuery) return true;
      
      const query = params.searchQuery.toLowerCase();
      const nameMatch = user.name.toLowerCase().includes(query);
      const skillsMatch = user.skills?.some(skill => 
        skill.toLowerCase().includes(query)
      ) || false;
      
      return nameMatch || skillsMatch;
    })
    // Sort by distance
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    
    return filteredUsers;
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
};

// Function to find alumni (users from the same school)
export const findAlumni = async (params: SearchParams): Promise<NetworkUser[]> => {
  if (!params.school) {
    return [];
  }
  
  return findUsersToConnect({
    ...params,
    school: params.school,
    maxDistance: params.maxDistance || 5
  });
};

// Function to find groups nearby
export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  category: string;
  distance?: number;
}

const sampleGroups: Group[] = [
  {
    id: "group1",
    name: "Berkeley Tech Entrepreneurs",
    description: "A group for tech entrepreneurs in the Berkeley area",
    members: 156,
    location: {
      lat: 37.8719,
      lng: -122.2585,
      address: "Berkeley, CA"
    },
    category: "Technology"
  },
  {
    id: "group2",
    name: "SF Design Thinkers",
    description: "UI/UX designers and creative professionals in San Francisco",
    members: 98,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    category: "Design"
  },
  {
    id: "group3",
    name: "Bay Area Job Seekers",
    description: "Support and networking for job seekers in the Bay Area",
    members: 213,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    category: "Career"
  },
  {
    id: "group4",
    name: "Stanford Alumni Network",
    description: "Networking group for Stanford graduates",
    members: 310,
    location: {
      lat: 37.4275,
      lng: -122.1697,
      address: "Stanford, CA"
    },
    category: "Education"
  },
  {
    id: "group5",
    name: "Local Freelancers Collective",
    description: "A community for freelancers to share opportunities and advice",
    members: 87,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    category: "Freelancing"
  }
];

export const findGroups = async (params: SearchParams): Promise<Group[]> => {
  try {
    if (!params.currentUserLocation) {
      return [];
    }
    
    const maxDist = params.maxDistance || 5; // Default to 5 miles if not specified
    
    const filteredGroups = sampleGroups.map(group => {
      // Skip groups without location
      if (!group.location) {
        return { ...group, distance: Infinity };
      }
      
      // Calculate distance from current user
      const distance = calculateDistance(
        params.currentUserLocation!.lat,
        params.currentUserLocation!.lng,
        group.location.lat,
        group.location.lng
      );
      
      return { ...group, distance };
    })
    // Filter by maximum distance
    .filter(group => group.distance <= maxDist)
    // If search query is specified, filter by name or description
    .filter(group => {
      if (!params.searchQuery) return true;
      
      const query = params.searchQuery.toLowerCase();
      return group.name.toLowerCase().includes(query) || 
             group.description.toLowerCase().includes(query);
    })
    // Sort by distance
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    
    return filteredGroups;
  } catch (error) {
    console.error("Error finding groups:", error);
    return [];
  }
};
