import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Search, BookOpen, Award, Briefcase, Plus, Star, TrendingUp, Zap, Heart, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'employer'>('student');
  const [clickCount, setClickCount] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { userLocation, requestLocation } = useLocation();
  const navigate = useNavigate();

  // Request location permission on first interaction
  const handleFirstInteraction = () => {
    if (!hasInteracted && !userLocation) {
      setHasInteracted(true);
      setShowLocationPrompt(true);
      setTimeout(() => {
        requestLocation();
        setShowLocationPrompt(false);
      }, 1000);
    }
    setClickCount(prev => prev + 1);
  };

  const handleBrowseJobs = () => {
    console.log("Browse Jobs button clicked - navigating to location handler");
    navigate('/set-location');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden" onClick={handleFirstInteraction}>
      {/* Location Permission Popup */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl animate-scale-in">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-6 h-6 text-blue-600 animate-pulse" />
              <h3 className="text-lg font-semibold">Enable Location Access</h3>
            </div>
            <p className="text-gray-600 mb-4">We'd like to show you opportunities near you!</p>
            <div className="animate-bounce">📍</div>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-green-200/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-purple-200/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 animate-slide-in-right">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              LoCruit
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-blue-50 hover:scale-105 transition-all duration-300 hover:shadow-md">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {userType === 'employer' && (
                  <Link to="/create-job">
                    <Button variant="outline" className="flex items-center space-x-2 border-green-600 text-green-600 hover:bg-green-50 hover:scale-105 transition-all duration-300">
                      <Plus className="w-4 h-4" />
                      <span>Post Job</span>
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500">
              Your Gateway to Local Student Success
            </h1>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto hover:text-gray-700 transition-colors duration-300">
              Connect with opportunities right in your neighborhood. Find internships and jobs 
              tailored for high school and college students in your local area.
            </p>
          </div>
          {userLocation && (
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-lg text-blue-600 mb-8 flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300">
                <MapPin className="w-5 h-5 animate-pulse" />
                <span>Showing opportunities near {userLocation.address}</span>
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg hover:scale-110 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg hover:scale-110 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              onClick={handleBrowseJobs}
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Local Jobs
            </Button>
          </div>
          {userLocation && (
            <div className="mt-4 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '1s' }}>
              <p>Showing {userLocation ? '150+' : '500+'} student opportunities in your area</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white/50 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in hover:scale-105 transition-transform duration-300">
            Everything You Need to Launch Your Career Locally
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 border-0 bg-white/80 backdrop-blur-sm group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Hyper-Local Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Find opportunities in your exact neighborhood, district, or sector. No more long commutes for part-time jobs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 border-0 bg-white/80 backdrop-blur-sm group animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-green-600 transition-colors duration-300">Student-Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Built specifically for high school and college students with flexible scheduling and entry-level positions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 border-0 bg-white/80 backdrop-blur-sm group animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Auto Resume Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Transform your profile into a professional resume automatically. No formatting skills required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Categories Section - Made Unclickable */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">
            Popular Job Categories
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Technology", icon: "💻", color: "bg-blue-500", jobs: "150+ jobs" },
              { name: "Marketing", icon: "📈", color: "bg-green-500", jobs: "80+ jobs" },
              { name: "Design", icon: "🎨", color: "bg-purple-500", jobs: "65+ jobs" },
              { name: "Sales", icon: "💼", color: "bg-orange-500", jobs: "90+ jobs" },
              { name: "Customer Service", icon: "🎧", color: "bg-pink-500", jobs: "45+ jobs" },
              { name: "Research", icon: "🔬", color: "bg-indigo-500", jobs: "35+ jobs" }
            ].map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer hover-lift hover-glow transition-all duration-300"
                tabIndex={0}
                aria-label={category.name}
              >
                <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 border-0 bg-white/80 backdrop-blur-sm animate-fade-in group-hover:scale-105 group-hover:shadow-blue-200 group-hover:z-10" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{category.name}</h4>
                    <p className="text-sm text-gray-500">{category.jobs}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-green-600/10 to-blue-600/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
              Are You an Employer?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Post your job opportunities and connect with talented students in your area.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create-job">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 text-lg hover:scale-110 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Plus className="w-5 h-5 mr-2" />
                Post a Job
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg hover:scale-110 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Building2 className="w-5 h-5 mr-2" />
                Create Employer Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in hover:scale-105 transition-transform duration-300">
            Ready to Start Your Professional Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.2s' }}>
            Join thousands of students who've found their perfect local opportunities through LoCruit.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold hover:scale-110 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Heart className="w-5 h-5 mr-2" />
              Create Your Profile Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 group">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold group-hover:scale-105 transition-transform duration-300">LoCruit</span>
          </div>
          <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">Connecting students with local opportunities since 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
