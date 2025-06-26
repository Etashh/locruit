import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Please enter a valid email address";
    }
    if (password.length < 1) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error logging in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to LoCruit.",
      });
      // Check for redirect parameter in URL
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect');
      navigate(redirectTo || "/dashboard");
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-green-200/20 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-purple-200/20 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-scale-in group">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
              <span>Welcome Back</span>
            </CardTitle>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
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
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="group-hover:text-blue-600 transition-colors duration-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isLoading || googleLoading}
                  className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 ${errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="password" className="group-hover:text-blue-600 transition-colors duration-300">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading || googleLoading}
                    className={`hover:shadow-lg focus:shadow-xl transition-all duration-300 focus:scale-105 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''
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
              <Button
                type="submit"
                disabled={isLoading || googleLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline hover:scale-105 transition-all duration-300 inline-block">
                Forgot your password?
              </Link>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium hover:scale-105 transition-all duration-300 inline-block">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
