
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Users, UserPlus, Loader2, GraduationCap, Users as UserGroup, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { findAlumni, findGroups, Group } from "@/services/networkService";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateInitials } from "@/utils/profileUtils";
import { Badge } from "@/components/ui/badge";

const QuickActions = () => {
  const { toast } = useToast();
  const { userLocation } = useLocation();
  const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Mock user data - in a real app this would come from auth context or user profile
  const mockUserProfile = {
    organization: "University of California",
    school: "University of California",
    name: "Current User",
    email: "user@example.com"
  };
  
  const handleFindAlumni = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to find alumni near you.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingAlumni(true);
    try {
      const nearbyAlumni = await findAlumni({
        currentUserLocation: {
          lat: userLocation.lat,
          lng: userLocation.lng
        },
        school: mockUserProfile.school,
        maxDistance: 5 // 5 miles radius
      });
      
      setAlumni(nearbyAlumni);
      setShowAlumniModal(true);
      
      toast({
        title: "Alumni Found",
        description: `Found ${nearbyAlumni.length} alumni within 5 miles.`
      });
    } catch (error) {
      console.error("Error finding alumni:", error);
      toast({
        title: "Error",
        description: "Failed to find nearby alumni.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAlumni(false);
    }
  };
  
  const handleJoinGroups = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to find groups near you.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingGroups(true);
    try {
      const nearbyGroups = await findGroups({
        currentUserLocation: {
          lat: userLocation.lat,
          lng: userLocation.lng
        },
        maxDistance: 5 // 5 miles radius
      });
      
      setGroups(nearbyGroups);
      setShowGroupsModal(true);
      
      toast({
        title: "Groups Found",
        description: `Found ${nearbyGroups.length} groups within 5 miles.`
      });
    } catch (error) {
      console.error("Error finding groups:", error);
      toast({
        title: "Error",
        description: "Failed to find nearby groups.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };
  
  const handleJoinGroup = (group: Group) => {
    toast({
      title: "Joined Group",
      description: `You have successfully joined "${group.name}".`
    });
  };
  
  return (
    <>
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start hover:scale-105 transition-transform duration-200"
            onClick={handleFindAlumni}
            disabled={isLoadingAlumni}
          >
            {isLoadingAlumni ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <GraduationCap className="w-4 h-4 mr-2" />
            )}
            Find Alumni
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start hover:scale-105 transition-transform duration-200"
            onClick={handleJoinGroups}
            disabled={isLoadingGroups}
          >
            {isLoadingGroups ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserGroup className="w-4 h-4 mr-2" />
            )}
            Join Groups
          </Button>
          
          <Link to="/profile-setup">
            <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
              <UserPlus className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      {/* Alumni Modal */}
      <Dialog open={showAlumniModal} onOpenChange={setShowAlumniModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <GraduationCap className="mr-2" /> Alumni Near You
            </DialogTitle>
          </DialogHeader>
          
          {alumni.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No alumni found within 5 miles of your location.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alumni.map(alum => (
                <div key={alum.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      {alum.profilePhoto ? (
                        <AvatarImage src={alum.profilePhoto} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                          {generateInitials(alum.firstName || '', alum.lastName || '')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{alum.name}</h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {alum.distance?.toFixed(1)} miles away
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlumniModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Groups Modal */}
      <Dialog open={showGroupsModal} onOpenChange={setShowGroupsModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserGroup className="mr-2" /> Groups Near You
            </DialogTitle>
          </DialogHeader>
          
          {groups.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No groups found within 5 miles of your location.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map(group => (
                <div key={group.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {group.distance?.toFixed(1)} miles away • {group.members} members
                      </div>
                    </div>
                    <Badge>{group.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{group.description}</p>
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => handleJoinGroup(group)}
                    >
                      Join Group
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGroupsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
