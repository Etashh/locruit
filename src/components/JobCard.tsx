import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { Job } from "@/services/jobService";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();

  // Enhanced guard against invalid job data with more detailed logging
  if (!job) {
    console.error("JobCard received invalid job data (null or undefined)");
    return null;
  }

  // Log job data for debugging
  console.log("%c JobCard rendering job:", "background: #FF5722; color: white", job);

  try {
    // Verify required fields exist before rendering
    const title = job.title || "Untitled Position";
    const company = job.company || "Company Not Specified";
    const location = job.location || "Location Not Specified";
    const type = job.type || "Other";
    const salary = job.salary || "Salary Not Specified";
    const posted = job.posted || "Recently";
    const description = job.description || "No description available";
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const featured = Boolean(job.featured);

    return (
      <Card
        className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm ${
          featured ? "ring-2 ring-blue-200" : ""
        } cursor-pointer`}
        onClick={() => navigate(`/job/${job.id}`)}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
                {featured && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-lg font-medium text-blue-600 mb-2">{company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{salary}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{posted}</span>
                </div>
              </div>
            </div>
            {/* No external Apply button! Show contact info if available */}
            <div className="flex flex-col items-end gap-2">
              {job.contact_email && (
                <span className="text-xs text-gray-700 bg-blue-50 rounded px-2 py-1">Email: {job.contact_email}</span>
              )}
              {job.contact_phone && (
                <span className="text-xs text-gray-700 bg-green-50 rounded px-2 py-1">Phone: {job.contact_phone}</span>
              )}
              {job.contact_url && (
                <a href={job.contact_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">Contact Link</a>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            {typeof description === 'string'
              ? description.length > 250 
                ? `${description.substring(0, 250).replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '')}...` 
                : description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '')
              : 'No description available'
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      );
  } catch (error) {
    console.error("%c Error rendering JobCard:", "background: red; color: white", error, job);
    // Return a more informative fallback card
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Job Listing</CardTitle>
          <p className="text-sm text-gray-500">Error displaying this job listing</p>
          <p className="text-xs text-red-500 mt-1">Error: {(error as Error).message || "Unknown error"}</p>
        </CardHeader>
        <CardContent>
          <p>Please try refreshing the page or contact support if this issue persists.</p>
        </CardContent>
      </Card>
    );
  }
};

export default JobCard;
