import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";
import UserStatus, { UserStatusType } from "@/components/UserStatus";

interface NetworkNavigationProps {
  userStatus: UserStatusType;
  onStatusChange: (status: UserStatusType) => void;
}

const NetworkNavigation = ({ userStatus, onStatusChange }: NetworkNavigationProps) => {
  return (
    <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            LoCruit
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <UserStatus 
            currentStatus={userStatus} 
            onStatusChange={onStatusChange} 
            showLabel={true}
            size="md"
          />
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NetworkNavigation;
