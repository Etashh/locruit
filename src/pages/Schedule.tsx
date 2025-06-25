import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "react-router-dom";
import { Users, Calendar as CalendarIcon, Clock, MapPin, Video, ArrowLeft, Plus, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthCheck from "@/components/AuthCheck";

const Schedule = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcomingEvents = [
    {
      id: 1,
      title: "Interview: Frontend Developer",
      company: "Tech Startup Inc.",
      date: "Today",
      time: "2:00 PM",
      type: "video",
      location: "Zoom Meeting",
      duration: "45 min"
    },
    {
      id: 2,
      title: "Coffee Chat: Marketing Intern",
      company: "Creative Agency",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "in-person",
      location: "Downtown Café",
      duration: "30 min"
    },
    {
      id: 3,
      title: "Phone Screening: Data Analyst",
      company: "Analytics Corp",
      date: "Friday",
      time: "3:15 PM",
      type: "phone",
      location: "Phone Call",
      duration: "20 min"
    }
  ];

  const todayEvents = upcomingEvents.filter(event => event.date === "Today");
  const futureEvents = upcomingEvents.filter(event => event.date !== "Today");

  const handleJoinMeeting = (eventTitle: string) => {
    toast({
      title: "Joining Meeting",
      description: `Opening ${eventTitle} meeting...`,
    });
  };

  const handleReschedule = (eventTitle: string) => {
    toast({
      title: "Reschedule Request",
      description: `Rescheduling ${eventTitle}...`,
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 text-blue-800";
      case "phone":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            Your Schedule
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Manage your interviews and meetings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Events */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Today's Events</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
              {todayEvents.length > 0 ? (
                <div className="space-y-4">
                  {todayEvents.map((event) => (
                    <Card key={event.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getEventIcon(event.type)}
                              <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                              <Badge className={getEventBadgeColor(event.type)}>
                                {event.type === "video" ? "Video Call" : event.type === "phone" ? "Phone Call" : "In Person"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-1">{event.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.time} ({event.duration})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {event.type === "video" && (
                              <Button 
                                size="sm" 
                                onClick={() => handleJoinMeeting(event.title)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Join Now
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReschedule(event.title)}
                            >
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No events scheduled for today</p>
                    <p className="text-gray-400 text-sm">Your schedule is clear!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                {futureEvents.map((event) => (
                  <Card key={event.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getEventIcon(event.type)}
                            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                            <Badge className={getEventBadgeColor(event.type)}>
                              {event.type === "video" ? "Video Call" : event.type === "phone" ? "Phone Call" : "In Person"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{event.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{event.date} at {event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReschedule(event.title)}
                          >
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">Networking</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Block Time
                </Button>
                <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
