import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProfileSetupHeader from "@/components/profile-setup/ProfileSetupHeader";
import PhotoUploadStep from "@/components/profile-setup/PhotoUploadStep";
import BioStep from "@/components/profile-setup/BioStep";
import SkillsStep from "@/components/profile-setup/SkillsStep";
import LocationPreferencesStep from "@/components/profile-setup/LocationPreferencesStep";
import ProjectsLinksStep from "@/components/profile-setup/ProjectsLinksStep";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{id: string, title: string, description: string, url: string}>>([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    educationLevel: ""
  });
  const [profileData, setProfileData] = useState({
    bio: "",
    skills: [] as string[],
    certifications: "",
    jobTypes: [] as string[],
    location: "",
    radius: "5",
    portfolio: "",
    linkedin: "",
    github: ""
  });

  useEffect(() => {
    // Load temporary user data from localStorage
    const tempUserData = localStorage.getItem('tempUserData');
    if (tempUserData) {
      const data = JSON.parse(tempUserData);
      setUserData(data);
    }
  }, []);

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "",
      description: "",
      url: ""
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleSkillToggle = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleJobTypeToggle = (jobType: string) => {
    setProfileData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter(jt => jt !== jobType)
        : [...prev.jobTypes, jobType]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Photo is optional
      case 2:
        return profileData.bio.length >= 10 && profileData.bio.length <= 500;
      case 3:
        return profileData.skills.length > 0;
      case 4:
        return profileData.location.length > 0 && profileData.jobTypes.length > 0;
      case 5:
        return true; // All fields in step 5 are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const completeProfile = {
        ...userData,
        ...profileData,
        photo: profilePhoto,
        projects: projects,
        profileComplete: 100
      };
      console.log("Profile setup complete:", completeProfile);
      
      // Store complete profile data
      localStorage.setItem('userProfile', JSON.stringify(completeProfile));
      
      toast({
        title: "Profile completed! 🎉",
        description: "Your profile has been saved successfully. Welcome to LoCruit!",
      });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: "Upload your photo",
      2: "Tell us about yourself",
      3: "Your skills & expertise", 
      4: "Location & preferences",
      5: "Projects & links"
    };
    return titles[step as keyof typeof titles];
  };

  const getStepDescription = (step: number) => {
    const descriptions = {
      1: "Add a professional photo or we'll create one from your initials",
      2: "Share your story, interests, and career goals with us",
      3: "Select your skills to help us match you with the right opportunities",
      4: "Tell us where you'd like to work and what type of jobs interest you",
      5: "Showcase your work and connect your professional profiles"
    };
    return descriptions[step as keyof typeof descriptions];
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhotoUploadStep
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
            firstName={userData.firstName}
            lastName={userData.lastName}
          />
        );
      case 2:
        return (
          <BioStep
            bio={profileData.bio}
            certifications={profileData.certifications}
            onBioChange={(bio) => handleInputChange('bio', bio)}
            onCertificationsChange={(certifications) => handleInputChange('certifications', certifications)}
          />
        );
      case 3:
        return (
          <SkillsStep
            selectedSkills={profileData.skills}
            onSkillToggle={handleSkillToggle}
          />
        );
      case 4:
        return (
          <LocationPreferencesStep
            location={profileData.location}
            radius={profileData.radius}
            jobTypes={profileData.jobTypes}
            onLocationChange={(location) => handleInputChange('location', location)}
            onRadiusChange={(radius) => handleInputChange('radius', radius)}
            onJobTypeToggle={handleJobTypeToggle}
          />
        );
      case 5:
        return (
          <ProjectsLinksStep
            projects={projects}
            portfolio={profileData.portfolio}
            linkedin={profileData.linkedin}
            github={profileData.github}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onRemoveProject={removeProject}
            onPortfolioChange={(portfolio) => handleInputChange('portfolio', portfolio)}
            onLinkedinChange={(linkedin) => handleInputChange('linkedin', linkedin)}
            onGithubChange={(github) => handleInputChange('github', github)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <ProfileSetupHeader currentStep={currentStep} totalSteps={5} />

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {getStepTitle(currentStep)}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {getStepDescription(currentStep)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 hover:scale-105 transition-all duration-300"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {currentStep === 5 ? "Complete Profile" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
