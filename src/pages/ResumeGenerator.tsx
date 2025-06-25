import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Users, Download, Eye, Edit, ArrowLeft, FileText, Mail, Phone, MapPin, Globe, Github, Linkedin, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResumeGenerator = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    school: "",
    level: "",
    bio: "",
    skills: [] as string[],
    certifications: "",
    portfolio: "",
    linkedin: "",
    github: "",
    projects: [] as any[]
  });

  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    const tempUserData = localStorage.getItem('tempUserData');
    
    if (userProfile) {
      const profileData = JSON.parse(userProfile);
      setUser({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        school: profileData.school || "",
        level: profileData.educationLevel || profileData.level || "",
        bio: profileData.bio || "",
        skills: profileData.skills || [],
        certifications: profileData.certifications || "",
        portfolio: profileData.portfolio || "",
        linkedin: profileData.linkedin || "",
        github: profileData.github || "",
        projects: profileData.projects || []
      });
    } else if (tempUserData) {
      const userData = JSON.parse(tempUserData);
      setUser(prev => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        school: userData.school || "",
        level: userData.educationLevel || userData.level || ""
      }));
    }
  }, []);

  useEffect(() => {
    // Check for missing critical fields
    const missing = [];
    if (!user.firstName || !user.lastName) missing.push("Full Name");
    if (!user.email) missing.push("Email");
    if (!user.phone) missing.push("Phone Number");
    if (!user.location) missing.push("Location");
    if (!user.bio) missing.push("Professional Summary");
    if (user.skills.length === 0) missing.push("Skills");
    if (user.projects.length === 0) missing.push("Projects");
    
    setMissingFields(missing);
  }, [user]);

  const handleDownload = () => {
    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Resume",
        description: "Please complete your profile to generate a professional resume.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Resume Download",
      description: "Your resume is being prepared for download!",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Resume Preview",
      description: "Opening resume preview in new window...",
    });
  };

  const getCompletionPercentage = () => {
    const totalFields = 7; // firstName, lastName, email, phone, location, bio, skills, projects
    const completedFields = totalFields - missingFields.length;
    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
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
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            Resume Generator
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Generate a professional resume from your profile data
          </p>
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Resume Completion: {getCompletionPercentage()}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Missing Fields Alert */}
        {missingFields.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Your resume is missing some important information:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
              <Link to="/profile-setup" className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800">
                <Edit className="w-4 h-4 mr-1" />
                Complete your profile to improve your resume
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Resume Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" 
                  onClick={handlePreview}
                  disabled={!user.firstName || !user.lastName}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Resume
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDownload}
                  disabled={missingFields.length > 3}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF {missingFields.length > 3 && "(Complete profile first)"}
                </Button>
                <Link to="/profile-setup">
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Resume Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>• Keep your resume to 1-2 pages maximum</p>
                <p>• Use action verbs to describe your achievements</p>
                <p>• Quantify your accomplishments with numbers</p>
                <p>• Tailor your resume for each job application</p>
                <p>• Proofread carefully for spelling and grammar</p>
              </CardContent>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:sticky lg:top-8">
            <Card className="border-0 bg-white shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user.firstName || "[First Name]"} {user.lastName || "[Last Name]"}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email || "[Email Address]"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone || "[Phone Number]"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location || "[Location]"}</span>
                    </div>
                  </div>
                  {(user.portfolio || user.linkedin || user.github) && (
                    <div className="flex justify-center gap-4 text-sm">
                      {user.portfolio && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Globe className="w-4 h-4" />
                          <span>Portfolio</span>
                        </div>
                      )}
                      {user.linkedin && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn</span>
                        </div>
                      )}
                      {user.github && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Github className="w-4 h-4" />
                          <span>GitHub</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Professional Summary</h2>
                  {user.bio ? (
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Add a professional summary to describe yourself</p>
                      <Link to="/profile-setup" className="text-blue-600 hover:text-blue-800 text-sm">
                        Add summary →
                      </Link>
                    </div>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Education */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
                  <div>
                    <h3 className="font-medium text-gray-800">{user.school || "[School Name]"}</h3>
                    <p className="text-gray-600">{user.level || "[Education Level]"}</p>
                    <p className="text-gray-500 text-sm">Expected Graduation: 2025</p>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Skills */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
                  {user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Add skills to showcase your abilities</p>
                      <Link to="/profile-setup" className="text-blue-600 hover:text-blue-800 text-sm">
                        Add skills →
                      </Link>
                    </div>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Projects */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Projects</h2>
                  {user.projects.length > 0 ? (
                    <div className="space-y-4">
                      {user.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-gray-800">{project.title}</h3>
                          <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                          {project.url && (
                            <p className="text-blue-600 text-sm">{project.url}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Add projects to demonstrate your experience</p>
                      <Link to="/profile-setup" className="text-blue-600 hover:text-blue-800 text-sm">
                        Add projects →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {user.certifications && (
                  <>
                    <Separator className="mb-6" />
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-3">Certifications</h2>
                      <p className="text-gray-700">{user.certifications}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
