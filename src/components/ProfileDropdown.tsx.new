import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, LogOut, Award, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateInitials } from "@/utils/profileUtils";
import { supabase } from "@/lib/supabaseClient";

interface ProfileDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
  school?: string;
  level?: string;
  location?: string;
}

const ProfileDropdown = ({
  name,
  email,
  avatarUrl,
  school,
  level,
  location
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full"
        onClick={toggleDropdown}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{generateInitials(name.split(" ")[0], name.split(" ")[1])}</AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 z-50">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>{generateInitials(name.split(" ")[0], name.split(" ")[1])}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                  {school && (
                    <div className="flex items-center mt-1">
                      <Award className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 truncate">{school}</p>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 truncate">{location}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate("/profile-setup")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDropdown;
