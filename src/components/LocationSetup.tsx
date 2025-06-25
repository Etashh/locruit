
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";

const LocationSetup = () => {
  const { userLocation, isLoading, error, requestLocation, setManualLocation } = useLocation();
  const [manualAddress, setManualAddress] = useState("");

  const handleManualLocation = () => {
    if (manualAddress.trim()) {
      setManualLocation(manualAddress.trim());
    }
  };

  if (userLocation) {
    return (
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 animate-fade-in group">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 text-green-700">
            <CheckCircle className="w-5 h-5 animate-pulse" />
            <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Location: {userLocation.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-500 animate-scale-in group">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-700 group-hover:scale-105 transition-transform duration-300">
          <Navigation className="w-5 h-5 animate-bounce" />
          <span>Set Your Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          Enable location access to find opportunities near you 📍
        </p>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={requestLocation} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Getting Location...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                <span>Use My Current Location</span>
              </div>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-xs text-gray-500 px-2 bg-white rounded-full border">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your city or address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
              className="hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105"
            />
            <Button 
              onClick={handleManualLocation}
              variant="outline"
              disabled={!manualAddress.trim()}
              className="hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-blue-50"
            >
              Set
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSetup;
