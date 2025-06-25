
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationPreferencesStepProps {
  location: string;
  radius: string;
  jobTypes: string[];
  onLocationChange: (location: string) => void;
  onRadiusChange: (radius: string) => void;
  onJobTypeToggle: (jobType: string) => void;
}

const jobTypeOptions = [
  "Part-time", "Internship", "Full-time", "Freelance", "Remote", "Contract"
];

const LocationPreferencesStep = ({
  location,
  radius,
  jobTypes,
  onLocationChange,
  onRadiusChange,
  onJobTypeToggle
}: LocationPreferencesStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Your Location</Label>
        <Input
          id="location"
          placeholder="City, State or ZIP code"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="radius">Search Radius</Label>
        <Select onValueChange={onRadiusChange}>
          <SelectTrigger>
            <SelectValue placeholder="How far are you willing to travel?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Within 1 mile</SelectItem>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="10">Within 10 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
            <SelectItem value="50">Within 50 miles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-base font-medium">Preferred job types</Label>
        <p className="text-sm text-gray-600 mb-4">Select all that interest you</p>
        <div className="grid grid-cols-2 gap-3">
          {jobTypeOptions.map((jobType) => (
            <div key={jobType} className="flex items-center space-x-2">
              <Checkbox
                id={jobType}
                checked={jobTypes.includes(jobType)}
                onCheckedChange={() => onJobTypeToggle(jobType)}
              />
              <Label htmlFor={jobType} className="text-sm cursor-pointer">
                {jobType}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPreferencesStep;
