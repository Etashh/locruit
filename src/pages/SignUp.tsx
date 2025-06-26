import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png"; // Adjust the path as necessary

const SignUp = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    school: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.educationLevel) {
      newErrors.educationLevel = "Please select your education level";
    }
    if (formData.school.trim().length < 2) {
      newErrors.school = "School name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          education_level: formData.educationLevel,
          school: formData.school,
        },
      },
    });

    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    toast({
      title: "Account created successfully!",
      description: "Please complete your profile to get started.",
    });
    try {
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        educationLevel: "",
        school: ""
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      // Redirect to profile setup
      navigate("/profile-setup");
    } catch (err) {
      console.error("Navigation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signInWithGoogle();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              LoCruit
            </span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Create Your Account</CardTitle>
            <p className="text-gray-600">Join thousands of students finding opportunities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-Up Button */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              disabled={googleLoading || isLoading}
              className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 hover:scale-105 hover:shadow-lg transition-all duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or create with email</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    disabled={isLoading || googleLoading}
                    className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <div className="flex items-center space-x-1 text-xs text-red-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.firstName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    disabled={isLoading || googleLoading}
                    className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <div className="flex items-center space-x-1 text-xs text-red-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.lastName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isLoading || googleLoading}
                  className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level *</Label>
                <Select 
                  onValueChange={(value) => handleInputChange('educationLevel', value)} 
                  disabled={isLoading || googleLoading}
                >
                  <SelectTrigger className={`hover:shadow-lg transition-all duration-300 ${
                    errors.educationLevel ? 'border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">College/University (Undergraduate)</SelectItem>
                    <SelectItem value="graduate">Graduate School</SelectItem>
                    <SelectItem value="trade-school">Trade/Vocational School</SelectItem>
                  </SelectContent>
                </Select>
                {errors.educationLevel && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.educationLevel}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School/Institution *</Label>
                <Input
                  id="school"
                  placeholder="Your school name"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  required
                  disabled={isLoading || googleLoading}
                  className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 ${
                    errors.school ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.school && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.school}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading || googleLoading}
                    className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 pr-10 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={isLoading || googleLoading}
                    className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 pr-10 ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || googleLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium hover:scale-105 transition-all duration-300 inline-block">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
