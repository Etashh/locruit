import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserStatusType } from "@/components/UserStatus";
import NetworkNavigation from "@/components/network/NetworkNavigation";
import NetworkHeader from "@/components/network/NetworkHeader";
import NetworkSearchBar from "@/components/network/NetworkSearchBar";
import NetworkContent from "@/components/network/NetworkContent";
import NetworkStats from "@/components/network/NetworkStats";
import QuickActions from "@/components/network/QuickActions";
import AuthCheck from "@/components/AuthCheck";

const Network = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatus, setUserStatus] = useState<UserStatusType>('online');

  // Empty arrays - will be populated when real connections are made
  const connections: any[] = [];
  const suggestedConnections: any[] = [];

  const handleConnect = (name: string) => {
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${name}!`,
    });
  };

  const handleMessage = (name: string) => {
    toast({
      title: "Message Feature",
      description: `Opening chat with ${name}...`,
    });
  };

  const handleStatusChange = (newStatus: UserStatusType) => {
    setUserStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Your status has been set to ${newStatus}`,
    });
  };

  const filteredConnections = connections.filter(connection =>
    connection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NetworkNavigation 
        userStatus={userStatus} 
        onStatusChange={handleStatusChange} 
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <NetworkHeader />
        <NetworkSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="grid lg:grid-cols-3 gap-8">
          <NetworkContent />

          {/* Sidebar */}
          <div className="space-y-6">
            <NetworkStats />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
