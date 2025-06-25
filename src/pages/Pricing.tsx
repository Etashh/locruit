
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Zap, Users, Eye, Download, FileText, BarChart3, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const studentPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic profile creation",
        "Apply to unlimited jobs",
        "Basic networking",
        "Standard support"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      name: "Priority Boost",
      price: "₹49",
      period: "per application",
      description: "Stand out from the crowd",
      features: [
        "Everything in Free",
        "Priority placement in employer lists",
        "Profile highlighting with badge",
        "Application status tracking",
        "Profile view insights"
      ],
      popular: true,
      buttonText: "Boost Application",
      buttonVariant: "default" as const
    },
    {
      name: "Premium",
      price: "₹99",
      period: "per month",
      description: "Complete career toolkit",
      features: [
        "Everything in Priority Boost",
        "Unlimited priority applications",
        "Instant Resume PDF exports",
        "Advanced styling options",
        "Detailed analytics",
        "Who viewed your profile"
      ],
      popular: false,
      buttonText: "Upgrade to Premium",
      buttonVariant: "default" as const
    }
  ];

  const employerPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Great for small businesses",
      features: [
        "Post up to 3 jobs per month",
        "Basic candidate search",
        "Standard job listings",
        "Email support"
      ],
      popular: false,
      buttonText: "Start Hiring",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "₹299" : "₹2,988",
      period: billingCycle === "monthly" ? "per month" : "per year",
      originalPrice: billingCycle === "yearly" ? "₹3,588" : undefined,
      description: "For growing teams",
      features: [
        "Unlimited job postings",
        "Priority placement in job lists",
        "AI-based resume filtering",
        "Advanced candidate shortlisting",
        "Analytics dashboard",
        "Premium support"
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const
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
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-blue-50">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock your potential with premium features designed for your success
          </p>
        </div>

        {/* Pricing Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Employers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studentPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm ${
                    plan.popular ? "ring-2 ring-blue-200 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-800">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employers">
            {/* Billing Toggle for Employers */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
                <Button
                  variant={billingCycle === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingCycle("monthly")}
                  className={billingCycle === "monthly" ? "bg-blue-600 text-white" : ""}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === "yearly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingCycle("yearly")}
                  className={billingCycle === "yearly" ? "bg-blue-600 text-white" : ""}
                >
                  Yearly
                  <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {employerPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm ${
                    plan.popular ? "ring-2 ring-blue-200 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-800">{plan.name}</CardTitle>
                    <div className="mt-4">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-500 line-through mr-2">{plan.originalPrice}</span>
                      )}
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Showcase */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Priority Boost</h3>
              <p className="text-gray-600">Get noticed first by employers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Profile Insights</h3>
              <p className="text-gray-600">See who viewed your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Resume Export</h3>
              <p className="text-gray-600">Instant PDF with styling options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Detailed hiring insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
