
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Users, 
  Briefcase, 
  BarChart3, 
  Star, 
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Crown,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import PremiumFeatures from "@/components/PremiumFeatures";

const EmployerDashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [jobsPosted, setJobsPosted] = useState(2); // Current month
  const maxFreeJobs = 3;

  // Mock data
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      location: "Remote",
      type: "Internship",
      salary: "₹15,000-20,000",
      applicants: 24,
      views: 142,
      status: "Active",
      priority: true,
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Marketing Assistant",
      location: "Mumbai",
      type: "Part-time",
      salary: "₹12,000-16,000",
      applicants: 18,
      views: 89,
      status: "Active",
      priority: false,
      posted: "1 week ago"
    }
  ];

  const applicants = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Frontend Developer Intern",
      experience: "1 year",
      skills: ["React", "JavaScript", "CSS"],
      aiScore: 92,
      status: "New",
      appliedDate: "2 hours ago"
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "Frontend Developer Intern",
      experience: "6 months",
      skills: ["React", "Node.js", "Python"],
      aiScore: 88,
      status: "Shortlisted",
      appliedDate: "1 day ago"
    },
    {
      id: 3,
      name: "Ananya Singh",
      role: "Marketing Assistant",
      experience: "2 years",
      skills: ["Social Media", "Content Writing", "Analytics"],
      aiScore: 85,
      status: "Interviewed",
      appliedDate: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              StudyLink
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
            <Button variant="ghost">Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your job postings and find the best candidates</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Jobs this month: {jobsPosted}/{isPremium ? "∞" : maxFreeJobs}
              </div>
              {!isPremium && jobsPosted >= maxFreeJobs && (
                <Badge variant="destructive" className="mt-1">Limit Reached</Badge>
              )}
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={!isPremium && jobsPosted >= maxFreeJobs}
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
                </div>
                <Briefcase className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold text-green-600">42</p>
                </div>
                <Users className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Views This Month</p>
                  <p className="text-3xl font-bold text-purple-600">231</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful Hires</p>
                  <p className="text-3xl font-bold text-orange-600">8</p>
                </div>
                <Star className="w-10 h-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="applicants">Applicants</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                {jobs.map((job) => (
                  <Card key={job.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-xl text-gray-800">{job.title}</CardTitle>
                            {job.priority && isPremium && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                <Zap className="w-3 h-3 mr-1" />
                                Priority
                              </Badge>
                            )}
                            <Badge variant="secondary">{job.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Close</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{job.applicants}</div>
                            <div className="text-sm text-gray-600">Applicants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{job.views}</div>
                            <div className="text-sm text-gray-600">Views</div>
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                          View Applicants
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="applicants" className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Input placeholder="Search applicants..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                    </SelectContent>
                  </Select>
                  {isPremium && (
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>AI Sort</span>
                    </Button>
                  )}
                </div>

                {applicants.map((applicant) => (
                  <Card key={applicant.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{applicant.name}</h3>
                            <Badge variant="secondary">{applicant.status}</Badge>
                            {isPremium && (
                              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                                AI Score: {applicant.aiScore}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">Applied for: {applicant.role}</p>
                          <p className="text-sm text-gray-600 mb-3">Experience: {applicant.experience}</p>
                          <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill, index) => (
                              <Badge key={index} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            Shortlist
                          </Button>
                          <div className="text-xs text-gray-500 text-center">{applicant.appliedDate}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Premium Features Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span>Premium Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PremiumFeatures userType="employer" isPremium={isPremium} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
