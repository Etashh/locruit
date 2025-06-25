import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/custom-select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface JobsSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  distanceFilter: string;
  setDistanceFilter: (distance: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (type: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  showLocalOnly: boolean;
  setShowLocalOnly: (show: boolean) => void;
}

const JobsSearchFilters = ({
  searchQuery,
  setSearchQuery,
  distanceFilter,
  setDistanceFilter,
  jobTypeFilter,
  setJobTypeFilter,
  categoryFilter,
  setCategoryFilter,
  showLocalOnly,
  setShowLocalOnly,
}: JobsSearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
              />
            </div>
            <Select onValueChange={setDistanceFilter} value={distanceFilter || "any_distance"}>
              <SelectTrigger className="border-gray-300 hover:border-blue-500 transition-colors duration-200">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_distance">Any Distance</SelectItem>
                <SelectItem value="1">Within 1 mile</SelectItem>
                <SelectItem value="3">Within 3 miles</SelectItem>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setJobTypeFilter} value={jobTypeFilter || "all_types"}>
              <SelectTrigger className="border-gray-300 hover:border-blue-500 transition-colors duration-200">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">All Types</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setCategoryFilter} value={categoryFilter || "all_categories"}>
              <SelectTrigger className="border-gray-300 hover:border-blue-500 transition-colors duration-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="customer service">Customer Service</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end mt-4 space-x-3">
            <Button 
              onClick={() => setShowLocalOnly(!showLocalOnly)} 
              variant={showLocalOnly ? "default" : "outline"}
              className={`${showLocalOnly ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" : ""} hover:scale-105 transition-all duration-300`}
            >
              {showLocalOnly ? "✓ Local Jobs Only" : "Show Local Jobs Only"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(true)}>
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent>
          <DialogTitle>More Filters</DialogTitle>
          {/* Example: Add more filter options here */}
          <div className="space-y-4 mt-4">
            <label className="block">
              <span className="text-sm">Company Name</span>
              <Input placeholder="e.g. Google" />
            </label>
            <label className="block">
              <span className="text-sm">Salary Range</span>
              <Input placeholder="e.g. 50000-100000" />
            </label>
            {/* Add more filter fields as needed */}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobsSearchFilters;
