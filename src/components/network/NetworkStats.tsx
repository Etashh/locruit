
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NetworkStats = () => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
      <CardHeader>
        <CardTitle className="text-lg">Network Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600">Profile Views</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">0</div>
          <div className="text-sm text-gray-600">New This Week</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkStats;
