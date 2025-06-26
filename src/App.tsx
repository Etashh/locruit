import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/contexts/LocationContext";
import AuthCheck from "./components/AuthCheck";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import ResumeGenerator from "./pages/ResumeGenerator";
import Network from "./pages/Network";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExternalJobs from "./pages/ExternalJobs";
import LocationHandler from "./pages/LocationHandler";
import Schedule from "./pages/Schedule";
import Watermark from "./components/Watermark";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-job" element={<AuthCheck><CreateJob /></AuthCheck>} />
            <Route path="/resume-generator" element={<ResumeGenerator />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/external-jobs" element={<ExternalJobs />} />
            <Route path="/set-location" element={<AuthCheck><LocationHandler /></AuthCheck>} />
            <Route path="/job/:id" element={<AuthCheck><JobDetails /></AuthCheck>} />
            <Route path="/jobs" element={<AuthCheck><Jobs /></AuthCheck>} />
            <Route path="/network" element={<AuthCheck><Network /></AuthCheck>} />
            <Route path="/schedule" element={<AuthCheck><Schedule /></AuthCheck>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Watermark />
        </BrowserRouter>
      </TooltipProvider>
    </LocationProvider>
  </QueryClientProvider>
);

export default App;
