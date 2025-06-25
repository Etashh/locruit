
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Zap, Eye, Download, Crown } from "lucide-react";

interface PremiumFeaturesProps {
  userType: "student" | "employer";
  isPremium?: boolean;
}

const PremiumFeatures = ({ userType, isPremium = false }: PremiumFeaturesProps) => {
  if (userType === "student") {
    return (
      <div className="space-y-4">
        {/* Priority Application Boost */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span>Priority Application Boost</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                ₹49-₹99
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Appear higher on employer lists and stand out from other applicants
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Profile highlighting with verified badge</span>
            </div>
            {!isPremium && (
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                Boost This Application
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Resume Export */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Download className="w-5 h-5 text-blue-600" />
              <span>Instant Resume PDF Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Export your profile as a professional PDF resume with multiple styling options
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">Modern Template</Badge>
              <Badge variant="outline">Classic Template</Badge>
              <Badge variant="outline">Creative Template</Badge>
            </div>
            {!isPremium && (
              <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                Upgrade for Export
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Insights */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Eye className="w-5 h-5 text-green-600" />
              <span>Profile Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              See who viewed your profile and track application statistics
            </p>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
            </div>
            {!isPremium && (
              <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                View Insights
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employer features
  return (
    <div className="space-y-4">
      {/* Job Posting Limits */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Job Posting Limits</CardTitle>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              {isPremium ? "Unlimited" : "3/month"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-3">
            {isPremium 
              ? "Post unlimited jobs with priority placement" 
              : "Upgrade to Pro for unlimited job postings"}
          </p>
          {!isPremium && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Upgrade to Pro - ₹299/month
            </Button>
          )}
        </CardContent>
      </Card>

      {/* AI Resume Filtering */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Star className="w-5 h-5 text-indigo-600" />
            <span>AI-Based Resume Filtering</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-3">
            Automatically shortlist candidates based on job requirements
          </p>
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline">Skill Matching</Badge>
            <Badge variant="outline">Experience Filter</Badge>
            <Badge variant="outline">Smart Ranking</Badge>
          </div>
          {!isPremium && (
            <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-600">
              Upgrade for AI Features
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-3">
            Track job performance, applicant insights, and hiring metrics
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-teal-600">142</div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">28</div>
              <div className="text-xs text-gray-600">Applicants</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">5</div>
              <div className="text-xs text-gray-600">Hired</div>
            </div>
          </div>
          {!isPremium && (
            <Button size="sm" variant="outline" className="border-teal-600 text-teal-600">
              View Analytics
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFeatures;
