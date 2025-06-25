import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  MapPin,
  Briefcase,
  Bell,
  Search,
  BookOpen,
  Award,
  TrendingUp,
  MessageSquare,
  Settings,
  Plus,
  Building2,
  FileText,
  BellDot,
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    school: "State University",
    level: "Undergraduate",
    profileComplete: 85,
    location: "Downtown Campus Area",
    userType: "student" as "student" | "employer",
    profilePhoto: null as string | null,
    bio: "Computer Science student passionate about web development and machine learning.",
    skills: ["JavaScript", "React", "Python", "Data Analysis"],
    certifications: "AWS Cloud Practitioner, Google Analytics Certified",
    jobTypes: [] as string[],
    radius: "5",
    portfolio: "",
    linkedin: "",
    github: "",
    projects: [] as any[]
  });

  const [notifications] = useState([
    { id: 1, message: "New job match found!", time: "2 hours ago", read: false },
    { id: 2, message: "Profile completion bonus earned!", time: "1 day ago", read: false },
    { id: 3, message: "Welcome to LoCruit!", time: "3 days ago", read: true }
  ]);

  const [showProfileReminder, setShowProfileReminder] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [rememberedUsers, setRememberedUsers] = useState<string[]>([]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Remove all filler/default data. Only use real user data from localStorage or Supabase.
  useEffect(() => {
    // Load complete user profile data from localStorage
    const userProfile = localStorage.getItem('userProfile');
    const tempUserData = localStorage.getItem('tempUserData');

    if (userProfile) {
      const profileData = JSON.parse(userProfile);
      const capitalizedFirstName = profileData.firstName
        ? profileData.firstName.charAt(0).toUpperCase() + profileData.firstName.slice(1).toLowerCase()
        : '';
      setUser({
        ...user,
        firstName: capitalizedFirstName,
        lastName: profileData.lastName || '',
        name: `${capitalizedFirstName}${profileData.lastName ? ' ' + profileData.lastName : ''}`.trim(),
        email: profileData.email || '',
        school: profileData.school || '',
        level: profileData.educationLevel?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '',
        profileComplete: profileData.profileComplete || 0,
        location: profileData.location || '',
        userType: profileData.userType || 'student',
        profilePhoto: profileData.photo || null,
        bio: profileData.bio || '',
        skills: profileData.skills || [],
        certifications: profileData.certifications || '',
        jobTypes: profileData.jobTypes || [],
        radius: profileData.radius || '',
        portfolio: profileData.portfolio || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        projects: profileData.projects || []
      });
    } else if (tempUserData) {
      const userData = JSON.parse(tempUserData);
      const capitalizedFirstName = userData.firstName
        ? userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1).toLowerCase()
        : '';
      setUser({
        ...user,
        firstName: capitalizedFirstName,
        lastName: userData.lastName || '',
        name: `${capitalizedFirstName}${userData.lastName ? ' ' + userData.lastName : ''}`.trim(),
        email: userData.email || '',
        school: userData.school || '',
        level: userData.educationLevel?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '',
        userType: userData.userType || 'student',
      });
    }
  }, []);

  // Google Auth: Sync user info from Supabase session
  useEffect(() => {
    const syncGoogleUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      if (supaUser) {
        const name = supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.user_metadata?.given_name || "";
        const email = supaUser.email || supaUser.user_metadata?.email || "";
        let firstName = name.split(" ")[0] || "";
        let lastName = name.split(" ")[1] || "";
        if (!firstName && email) firstName = email.split("@")[0];
        const initials = (firstName[0] || "").toUpperCase() + (lastName[0] || "").toUpperCase();
        const zip = supaUser.user_metadata?.zip || supaUser.user_metadata?.postal_code || "";
        let location = "";
        if (zip) {
          location = `PIN: ${zip}`;
        }
        // If missing bio or pfp, redirect to profile setup
        const bio = supaUser.user_metadata?.bio || "";
        const profilePhoto = supaUser.user_metadata?.profilePhoto || null;
        setUser((prev) => ({
          ...prev,
          firstName,
          lastName,
          name: name || firstName,
          email,
          initials,
          location,
          bio,
          profilePhoto,
        }));
        let previousUsers = JSON.parse(localStorage.getItem('previousUsers') || '[]');
        if (!previousUsers.includes(email)) {
          previousUsers.push(email);
          localStorage.setItem('previousUsers', JSON.stringify(previousUsers));
        }
        // Only redirect to profile setup if this is the user's first login
        const hasCompletedProfile = localStorage.getItem('hasCompletedProfile');
        if ((!bio || !profilePhoto) && !hasCompletedProfile) {
          localStorage.setItem('hasCompletedProfile', 'true');
          window.location.replace("/profile-setup");
        }
      }
    };
    syncGoogleUser();
  }, []);

  useEffect(() => {
    // Load remembered users for switcher
    const users = JSON.parse(localStorage.getItem('previousUsers') || '[]');
    setRememberedUsers(users);
    // Show profile completion reminder if missing info
    if (!user.bio || !user.profilePhoto) setShowProfileReminder(true);
  }, [user.bio, user.profilePhoto]);

  // Empty arrays for now - will be populated with real data
  const recentJobs: any[] = [];
  const applications: any[] = [];
  const messages: any[] = [];

  const employerStats = {
    activePostings: 0,
    totalApplications: 0,
    scheduledInterviews: 0,
    hiredCandidates: 0
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    toast({
      title: `${unreadNotifications} new notifications`,
      description: notifications.filter(n => !n.read)[0]?.message || "No new notifications",
    });
  };

  const handleEditProfile = () => {
    navigate("/profile-setup");
  };

  const handlePostJob = () => {
    navigate("/create-job");
  };

  // For all Browse Jobs buttons, use navigate('/set-location') instead of Link if needed:
  const handleBrowseJobs = () => navigate('/set-location');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Profile Completion Reminder */}
      {showProfileReminder && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-300 rounded-lg px-6 py-3 shadow-lg flex items-center space-x-4 animate-fade-in">
          <span className="text-yellow-700 font-medium">Complete your profile for better job matches!</span>
          <Button size="sm" onClick={() => { setShowProfileReminder(false); navigate('/profile-setup'); }} className="bg-yellow-400 hover:bg-yellow-500 text-white">Complete Now</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowProfileReminder(false)}>Dismiss</Button>
        </div>
      )}
      {/* User Switcher */}
      {showUserSwitcher && (
        <div className="fixed top-20 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 animate-fade-in">
          <h4 className="font-semibold mb-2">Switch User</h4>
          <ul>
            {rememberedUsers.map(email => (
              <li key={email} className="mb-1">
                <Button size="sm" variant="outline" onClick={() => { localStorage.setItem('activeUser', email); window.location.reload(); }}>{email}</Button>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="ghost" onClick={() => setShowUserSwitcher(false)}>Close</Button>
        </div>
      )}
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
          <div className="flex items-center space-x-4">
            {/* User Switcher Button */}
            {rememberedUsers.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowUserSwitcher(true)}>
                    <Users className="w-5 h-5 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch User</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center space-x-2 hover:scale-105 transition-all duration-300"
              onClick={handlePostJob}
            >
              <Plus className="w-4 h-4" />
              <span>Post Job</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform duration-200" onClick={handleNotificationClick}>
              {unreadNotifications > 0 ? (
                <>
                  <BellDot className="w-5 h-5 text-blue-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                </>
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </Button>
            <ProfileDropdown user={user} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.firstName ? user.firstName : ''}
          </h1>
          <p className="text-gray-600 flex items-center space-x-2">
            <span>{user.school} • {user.level}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {user.userType === 'student' ? (
              <>
                {/* Profile Completion */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>Complete Your Profile</span>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleEditProfile} className="hover:scale-105 transition-transform duration-200">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Profile Completion</span>
                        <span className="text-sm font-medium text-blue-600">{user.profileComplete}%</span>
                      </div>
                      <Progress value={user.profileComplete} className="h-3" />
                      <div className="flex flex-wrap gap-2">
                        <Link to="/profile-setup">
                          <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
                            Add Skills
                          </Button>
                        </Link>
                        <Link to="/profile-setup">
                          <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
                            Upload Photo
                          </Button>
                        </Link>
                        <Link to="/profile-setup">
                          <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
                            Add Projects
                          </Button>
                        </Link>
                        <Link to="/resume-generator">
                          <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
                            <FileText className="w-4 h-4 mr-1" />
                            Generate Resume
                          </Button>
                        </Link>
                      </div>

                      {/* User's current skills */}
                      {user.skills.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Your Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="hover:scale-105 transition-transform duration-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* User Bio Section */}
                {user.bio && (
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        <span>About {user.firstName}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                      {user.certifications && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications:</h4>
                          <p className="text-sm text-gray-600">{user.certifications}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Job Opportunities - Empty State */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Job Opportunities</span>
                    </CardTitle>
                    <Link to="/set-location">
                      <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">Browse Jobs</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {recentJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No job recommendations yet</p>
                        <p className="text-sm">Complete your profile to get personalized job matches based on your skills: {user.skills.join(', ')}</p>
                        <Link to="/set-location">
                          <Button className="mt-4 hover:scale-105 transition-transform duration-200">
                            <Search className="w-4 h-4 mr-2" />
                            Browse Available Jobs
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Job listings will appear here when available */}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Application Status - Empty State */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      <span>Your Applications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No applications yet</p>
                        <p className="text-sm">Start applying to jobs that match your skills: {user.skills.slice(0, 3).join(', ')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Applications will appear here when available */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Employer Stats */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span>Employer Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{employerStats.activePostings}</div>
                        <div className="text-sm text-gray-600">Active Postings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{employerStats.totalApplications}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{employerStats.scheduledInterviews}</div>
                        <div className="text-sm text-gray-600">Interviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{employerStats.hiredCandidates}</div>
                        <div className="text-sm text-gray-600">Hired</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions for Employers */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/create-job">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Job Posting
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200" onClick={() => console.log("Browse candidates")}>
                      <Search className="w-4 h-4 mr-2" />
                      Browse Candidates
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.userType === 'student' ? (
                  <>
                    <Link to="/set-location">
                      <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link to="/resume-generator">
                      <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Resume
                      </Button>
                    </Link>
                    <Link to="/network">
                      <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <Users className="w-4 h-4 mr-2" />
                        Network
                      </Button>
                    </Link>
                    <Link to="/schedule">
                      <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:scale-105 transition-transform duration-200"
                      onClick={handlePostJob}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/create-job">
                      <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200" onClick={() => console.log("Find candidates")}>
                      <Search className="w-4 h-4 mr-2" />
                      Find Candidates
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* User Profile Summary */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Profile Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.skills.length}</div>
                  <div className="text-sm text-gray-600">Skills Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.profileComplete}%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
                <Button variant="outline" size="sm" className="w-full hover:scale-105 transition-transform duration-200" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Messages - Empty State */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span>Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-1">Connect with employers to start conversations</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    {/* Messages will appear here when available */}
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full mt-3 hover:scale-105 transition-transform duration-200" onClick={() => console.log("Messages clicked")}>
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
