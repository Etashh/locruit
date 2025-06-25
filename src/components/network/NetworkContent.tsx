
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Search, UserPlus, Settings, MapPin, Building, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkUser, findUsersToConnect } from "@/services/networkService";
import { useLocation } from "@/contexts/LocationContext";
import { generateInitials } from "@/utils/profileUtils";
import { useToast } from "@/hooks/use-toast";

const NetworkContent = () => {
  const { userLocation } = useLocation();
  const { toast } = useToast();
  const [connections, setConnections] = useState<NetworkUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<NetworkUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  const mockUserProfile = {
    organization: "University of California",
    school: "University of California",
    name: "Current User",
    email: "user@example.com"
  };

  // Function to find people to connect
  const handleFindPeopleToConnect = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to find people near you.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const nearbyUsers = await findUsersToConnect({
        currentUserLocation: {
          lat: userLocation.lat,
          lng: userLocation.lng
        },
        organization: mockUserProfile.organization,
        maxDistance: 5, // 5 miles radius
      });
      
      setSuggestedUsers(nearbyUsers);
      setShowConnectModal(true);
      
      toast({
        title: "Users Found",
        description: `Found ${nearbyUsers.length} people nearby or from your organization.`
      });
    } catch (error) {
      console.error("Error finding people:", error);
      toast({
        title: "Error",
        description: "Failed to find nearby connections.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnectRequest = (user: NetworkUser) => {
    // In a real app, this would send a connection request
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${user.name}!`
    });
    
    // Update our UI to show this user as a connection
    setConnections(prev => [...prev, user]);
    // Remove from suggested users
    setSuggestedUsers(prev => prev.filter(u => u.id !== user.id));
  };
  
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Your Connections */}
      <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Connections ({connections.length})
        </h2>
        
        {connections.length === 0 ? (
          // Empty State
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No connections yet</h3>
              <p className="text-gray-500 mb-4">Start building your professional network by connecting with other students and professionals.</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-all duration-300"
                onClick={handleFindPeopleToConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></div>
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Find People to Connect
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Connection List
          <div className="grid gap-4">
            {connections.map(connection => (
              <Card key={connection.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      {connection.profilePhoto ? (
                        <AvatarImage src={connection.profilePhoto} alt={connection.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                          {generateInitials(connection.firstName || '', connection.lastName || '')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{connection.name}</h3>
                      <p className="text-sm text-gray-500">{connection.role}</p>
                    </div>
                    <Button variant="outline" size="sm">Message</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Connections */}
      <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">People You May Know</h2>
        
        {suggestedUsers.length === 0 ? (
          // Empty State
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No suggestions available</h3>
              <p className="text-gray-500 mb-4">Complete your profile to get personalized connection suggestions based on your school, skills, and interests.</p>
              <div className="flex justify-center space-x-3">
                <Link to="/profile-setup">
                  <Button variant="outline" className="hover:scale-105 transition-all duration-300">
                    <Settings className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleFindPeopleToConnect}
                  disabled={isLoading}
                  className="hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></div>
                  ) : (
                    <MapPin className="w-4 h-4 mr-2" />
                  )}
                  Find Nearby People
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Suggested Users List
          <div className="grid gap-4">
            {suggestedUsers.map(user => (
              <Card key={user.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      {user.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                          {generateInitials(user.firstName || '', user.lastName || '')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        {user.organization && (
                          <span className="flex items-center mr-3">
                            <Building className="w-3 h-3 mr-1" />
                            {user.organization}
                          </span>
                        )}
                        {user.distance !== undefined && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {user.distance.toFixed(1)} miles away
                          </span>
                        )}
                      </div>
                      {user.skills && user.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleConnectRequest(user)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkContent;
