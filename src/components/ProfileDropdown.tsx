import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, LogOut, Award, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateInitials, generateInitialsAvatar } from "@/utils/profileUtils";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun } from "lucide-react";

interface ProfileDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
  school?: string;
  level?: string;
  location?: string;
  firstName?: string;
  lastName?: string;
}

const ProfileDropdown = ({
  name,
  email,
  avatarUrl,
  school,
  level,
  location,
  firstName = '',
  lastName = ''
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarImage src={typeof window !== 'undefined' ? generateInitialsAvatar(firstName, lastName) : undefined} alt={name} />
          )}
          <AvatarFallback>{generateInitials(firstName, lastName)}</AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 z-50">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={name} />
                  ) : (
                    <AvatarImage src={typeof window !== 'undefined' ? generateInitialsAvatar(firstName, lastName) : undefined} alt={name} />
                  )}
                  <AvatarFallback>{generateInitials(firstName, lastName)}</AvatarFallback>
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
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm mt-2"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  {darkMode ? <Sun className="w-4 h-4 mr-2 text-yellow-400" /> : <Moon className="w-4 h-4 mr-2 text-gray-700" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
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
