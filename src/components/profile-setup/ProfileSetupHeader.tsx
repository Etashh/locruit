import { Link } from "react-router-dom";
import { Users } from "lucide-react";

interface ProfileSetupHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const ProfileSetupHeader = ({ currentStep, totalSteps }: ProfileSetupHeaderProps) => {
  return (
    <>
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            LoCruit
          </span>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileSetupHeader;
