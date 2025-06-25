import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { MapPin, Settings, Save, Navigation } from 'lucide-react';
import { useLocationPreferences } from '@/hooks/useLocationPreferences';
import { useLocation } from '@/contexts/LocationContext';

const LocationPreferencesSetup = () => {
  const { userLocation, requestLocation } = useLocation();
  const { 
    preferences, 
    isLoading, 
    updateTravelDistance, 
    updateCurrentLocation, 
    updateJobPreferences, 
    updateRemotePreference, 
    updateSalaryExpectations,
    initializePreferences 
  } = useLocationPreferences();

  const [travelDistance, setTravelDistance] = useState([25]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(['internship', 'part-time']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [remotePreference, setRemotePreference] = useState('no_preference');
  const [salaryMin, setSalaryMin] = useState(15);
  const [salaryMax, setSalaryMax] = useState(25);
  const [salaryType, setSalaryType] = useState('hourly');

  const jobTypes = [
    { id: 'internship', label: 'Internships' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'full-time', label: 'Full-time' },
    { id: 'contract', label: 'Contract' }
  ];

  const categories = [
    'Technology', 'Marketing', 'Design', 'Sales', 'Customer Service',
    'Education', 'Healthcare', 'Finance', 'Administration', 'Retail',
    'Food & Beverage', 'Transportation', 'Construction', 'Manufacturing'
  ];

  const remoteOptions = [
    { value: 'remote_only', label: 'Remote Only' },
    { value: 'hybrid', label: 'Hybrid (Remote + On-site)' },
    { value: 'on_site', label: 'On-site Only' },
    { value: 'no_preference', label: 'No Preference' }
  ];

  // Load existing preferences
  useEffect(() => {
    if (preferences) {
      setTravelDistance([preferences.max_travel_distance]);
      setSelectedJobTypes(preferences.job_types);
      setSelectedCategories(preferences.preferred_categories);
      setRemotePreference(preferences.remote_preference);
      
      if (preferences.salary_expectations) {
        setSalaryMin(preferences.salary_expectations.min);
        setSalaryMax(preferences.salary_expectations.max);
        setSalaryType(preferences.salary_expectations.type);
      }
    }
  }, [preferences]);

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    if (checked) {
      setSelectedJobTypes([...selectedJobTypes, jobType]);
    } else {
      setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  const handleSavePreferences = async () => {
    if (!userLocation) {
      requestLocation();
      return;
    }

    // If no preferences exist, initialize them
    if (!preferences) {
      await initializePreferences({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        address: userLocation.address,
        city: userLocation.address.split(',')[0] || 'Unknown',
        state: userLocation.address.split(',')[1]?.trim() || 'Unknown'
      });
    }

    // Update all preferences
    await Promise.all([
      updateTravelDistance(travelDistance[0]),
      updateJobPreferences(selectedJobTypes, selectedCategories),
      updateRemotePreference(remotePreference as any),
      updateSalaryExpectations({
        min: salaryMin,
        max: salaryMax,
        type: salaryType as any
      }),
      updateCurrentLocation({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        address: userLocation.address,
        city: userLocation.address.split(',')[0] || 'Unknown',
        state: userLocation.address.split(',')[1]?.trim() || 'Unknown'
      })
    ]);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading preferences...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Job Search Preferences</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Customize your job search to find opportunities that match your preferences and location.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Current Location</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Input 
              value={userLocation?.address || 'Location not set'} 
              disabled 
              className="flex-1"
            />
            <Button 
              onClick={requestLocation} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-1"
            >
              <Navigation className="w-4 h-4" />
              <span>Update</span>
            </Button>
          </div>
        </div>

        {/* Travel Distance */}
        <div className="space-y-3">
          <Label>Maximum Travel Distance: {travelDistance[0]} miles</Label>
          <Slider
            value={travelDistance}
            onValueChange={setTravelDistance}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 mile</span>
            <span>50 miles</span>
          </div>
        </div>

        {/* Job Types */}
        <div className="space-y-3">
          <Label>Preferred Job Types</Label>
          <div className="grid grid-cols-2 gap-3">
            {jobTypes.map((jobType) => (
              <div key={jobType.id} className="flex items-center space-x-2">
                <Checkbox
                  id={jobType.id}
                  checked={selectedJobTypes.includes(jobType.id)}
                  onCheckedChange={(checked) => 
                    handleJobTypeChange(jobType.id, checked as boolean)
                  }
                />
                <Label htmlFor={jobType.id} className="text-sm">
                  {jobType.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Work Preference */}
        <div className="space-y-2">
          <Label>Remote Work Preference</Label>
          <Select value={remotePreference} onValueChange={setRemotePreference}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {remoteOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Categories */}
        <div className="space-y-3">
          <Label>Preferred Categories (Optional)</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={category} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="space-y-3">
          <Label>Salary Expectations</Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="salaryMin" className="text-xs">Minimum</Label>
              <Input
                id="salaryMin"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="salaryMax" className="text-xs">Maximum</Label>
              <Input
                id="salaryMax"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="salaryType" className="text-xs">Type</Label>
              <Select value={salaryType} onValueChange={setSalaryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Per Hour</SelectItem>
                  <SelectItem value="monthly">Per Month</SelectItem>
                  <SelectItem value="yearly">Per Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSavePreferences} 
          className="w-full"
          disabled={!userLocation}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>

        {!userLocation && (
          <p className="text-sm text-amber-600 text-center">
            Please enable location access to save your preferences.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPreferencesSetup;