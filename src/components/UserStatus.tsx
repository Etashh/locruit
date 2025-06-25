
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Circle, Eye, EyeOff, Moon } from "lucide-react";

export type UserStatusType = 'online' | 'offline' | 'dnd'; // do not disturb

interface UserStatusProps {
  currentStatus?: UserStatusType;
  onStatusChange?: (status: UserStatusType) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserStatus = ({ 
  currentStatus = 'online', 
  onStatusChange, 
  showLabel = true,
  size = 'md' 
}: UserStatusProps) => {
  const [status, setStatus] = useState<UserStatusType>(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = (newStatus: UserStatusType) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
    
    // TODO: Update status in backend/database
    console.log("Status changed to:", newStatus);
  };

  const getStatusConfig = (statusType: UserStatusType) => {
    switch (statusType) {
      case 'online':
        return {
          color: 'bg-green-500',
          label: 'Online',
          icon: Circle,
          description: 'Available to connect'
        };
      case 'offline':
        return {
          color: 'bg-gray-400',
          label: 'Offline',
          icon: EyeOff,
          description: 'Not available'
        };
      case 'dnd':
        return {
          color: 'bg-red-500',
          label: 'Do Not Disturb',
          icon: Moon,
          description: 'Busy, please do not disturb'
        };
      default:
        return {
          color: 'bg-gray-400',
          label: 'Unknown',
          icon: Circle,
          description: ''
        };
    }
  };

  const currentConfig = getStatusConfig(status);
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const StatusIndicator = ({ statusType, isActive }: { statusType: UserStatusType; isActive: boolean }) => {
    const config = getStatusConfig(statusType);
    const IconComponent = config.icon;
    
    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={() => handleStatusChange(statusType)}
        className="w-full justify-start"
      >
        <div className="flex items-center space-x-2">
          <div className={`${sizeClasses.md} ${config.color} rounded-full`} />
          <span className="text-sm">{config.label}</span>
        </div>
      </Button>
    );
  };

  if (!onStatusChange) {
    // Read-only mode - just show the status
    return (
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} ${currentConfig.color} rounded-full`} />
        {showLabel && (
          <span className="text-sm text-gray-600">{currentConfig.label}</span>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
          <div className={`${sizeClasses[size]} ${currentConfig.color} rounded-full`} />
          {showLabel && (
            <span className="text-sm text-gray-700">{currentConfig.label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Set your status</h4>
          <StatusIndicator statusType="online" isActive={status === 'online'} />
          <StatusIndicator statusType="dnd" isActive={status === 'dnd'} />
          <StatusIndicator statusType="offline" isActive={status === 'offline'} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserStatus;
