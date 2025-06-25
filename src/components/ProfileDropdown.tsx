import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, LogOut, Award, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateInitials } from "@/utils/profileUtils";

interface ProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    school?: string;
    level?: string;
    location?: string;
    profilePhoto?: string | null;
    firstName?: string;
    lastName?: string;
  };
  // Alternative direct props for simpler usage
  name?: string;
  email?: string;
  photoUrl?: string | null;
}

const ProfileDropdown = ({ user, name, email, photoUrl }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'online' | 'offline' | 'dnd'>('online');
  const navigate = useNavigate();

  // Support both user object and direct props
  const displayName = user?.name || name || "User";
  const displayEmail = user?.email || email || "";
  const displayPhoto = user?.profilePhoto || photoUrl || null;

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('sb-auth-token');
    localStorage.removeItem('userProfile');
    navigate("/login");
  };

  const initials = generateInitials(
    user?.firstName || displayName.split(' ')[0] || '',
    user?.lastName || (displayName.split(' ').length > 1 ? displayName.split(' ')[1] : '')
  );

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="w-8 h-8 hover:scale-110 transition-transform duration-200 ring-2"
          style={{
            boxShadow: status === 'online' ? '0 0 0 2px #22c55e' : status === 'dnd' ? '0 0 0 2px #ef4444' : '0 0 0 2px #9ca3af'
          }}
        >
          {displayPhoto ? (
            <AvatarImage src={displayPhoto} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {isOpen && (
        <Card className="absolute right-0 top-10 w-80 z-50 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12 ring-2"
                style={{
                  boxShadow: status === 'online' ? '0 0 0 2px #22c55e' : status === 'dnd' ? '0 0 0 2px #ef4444' : '0 0 0 2px #9ca3af'
                }}
              >
                {displayPhoto ? (
                  <AvatarImage src={displayPhoto} alt={displayName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{displayName}</h3>
                <p className="text-sm text-gray-600">{displayEmail}</p>
              </div>
            </div>

            {/* Activity Status Toggle */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs text-gray-500">Status:</span>
              <Button size="sm" variant={status === 'online' ? 'default' : 'outline'} className="flex items-center space-x-1" onClick={() => setStatus('online')}>
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
              </Button>
              <Button size="sm" variant={status === 'offline' ? 'default' : 'outline'} className="flex items-center space-x-1" onClick={() => setStatus('offline')}>
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span> Offline
              </Button>
              <Button size="sm" variant={status === 'dnd' ? 'default' : 'outline'} className="flex items-center space-x-1" onClick={() => setStatus('dnd')}>
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> DND
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/profile-setup")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/profile-setup")}
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
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDropdown;
