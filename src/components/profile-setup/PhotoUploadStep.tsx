import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateInitials, generateInitialsAvatar } from "@/utils/profileUtils";

interface PhotoUploadStepProps {
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  firstName?: string;
  lastName?: string;
}

const PhotoUploadStep = ({ profilePhoto, setProfilePhoto, firstName = "", lastName = "" }: PhotoUploadStepProps) => {
  const { toast } = useToast();
  const [initialsAvatar, setInitialsAvatar] = useState<string>("");

  useEffect(() => {
    if (firstName && lastName && !profilePhoto) {
      const avatar = generateInitialsAvatar(firstName, lastName);
      setInitialsAvatar(avatar);
    }
  }, [firstName, lastName, profilePhoto]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
        toast({
          title: "Photo uploaded successfully!",
          description: "Your profile photo has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseInitials = () => {
    if (firstName && lastName) {
      const avatar = generateInitialsAvatar(firstName, lastName);
      setProfilePhoto(avatar);
      toast({
        title: "Profile picture generated!",
        description: "Using your initials as profile picture.",
      });
    }
  };

  const initials = generateInitials(firstName, lastName);
  const displayPhoto = profilePhoto || initialsAvatar;

  return (
    <div className="space-y-6 text-center animate-fade-in">
      <div className="mx-auto w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
        {displayPhoto ? (
          <Avatar className="w-full h-full">
            <AvatarImage src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
            <AvatarFallback className="w-full h-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <User className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <Label htmlFor="photo-upload">
            <Button variant="outline" className="cursor-pointer hover:shadow-lg transition-all duration-300" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {profilePhoto ? "Change Photo" : "Upload Photo"}
              </span>
            </Button>
          </Label>
        </div>

        {firstName && lastName && (
          <Button 
            variant="ghost" 
            onClick={handleUseInitials}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
          >
            Use initials ({initials}) instead
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 max-w-md mx-auto">
        Would you like to upload your own profile picture? If not, we'll automatically generate one from your initials. <br/>
        Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
      </p>
    </div>
  );
};

export default PhotoUploadStep;
