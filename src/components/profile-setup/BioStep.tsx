
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Award, AlertCircle } from "lucide-react";
import { validateCertification } from "@/utils/profileUtils";

interface BioStepProps {
  bio: string;
  certifications: string;
  onBioChange: (bio: string) => void;
  onCertificationsChange: (certifications: string) => void;
}

const BioStep = ({ bio, certifications, onBioChange, onCertificationsChange }: BioStepProps) => {
  const bioIsValid = bio.length >= 10 && bio.length <= 500;
  const certificationsIsValid = certifications.length === 0 || validateCertification(certifications);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3 group">
        <Label htmlFor="bio" className="flex items-center space-x-2 text-base font-medium group-hover:text-blue-600 transition-colors duration-300">
          <User className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
          <span>Bio</span>
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Textarea
            id="bio"
            placeholder="Tell us about yourself, your interests, and career goals... ✨"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            rows={4}
            className={`resize-none transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] focus:shadow-xl focus:scale-105 border-2 ${
              bioIsValid ? 'hover:border-blue-300 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
            }`}
          />
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-1 transition-colors duration-300 ${
            bioIsValid ? 'text-gray-500 hover:text-gray-700' : 'text-red-500'
          }`}>
            {!bioIsValid && <AlertCircle className="w-3 h-3" />}
            <span>{bio.length}/500 characters {bio.length < 10 ? '(minimum 10)' : ''}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 group">
        <Label htmlFor="certifications" className="flex items-center space-x-2 text-base font-medium group-hover:text-green-600 transition-colors duration-300">
          <Award className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
          <span>Certifications & Achievements</span>
          <span className="text-gray-400 text-sm">(Optional)</span>
        </Label>
        <div className="relative">
          <Textarea
            id="certifications"
            placeholder="List any certifications, awards, or achievements... 🏆"
            value={certifications}
            onChange={(e) => onCertificationsChange(e.target.value)}
            rows={3}
            className={`resize-none transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] focus:shadow-xl focus:scale-105 border-2 ${
              certificationsIsValid ? 'hover:border-green-300 focus:border-green-500' : 'border-red-300 focus:border-red-500'
            }`}
          />
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-1 transition-colors duration-300 ${
            certificationsIsValid ? 'text-gray-500 hover:text-gray-700' : 'text-red-500'
          }`}>
            {!certificationsIsValid && <AlertCircle className="w-3 h-3" />}
            <span>{certifications.length}/300 characters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
