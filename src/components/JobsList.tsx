
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Job } from "@/services/jobService";
import JobCard from "./JobCard";

interface JobsListProps {
  filteredJobs: Job[];
  userLocationAddress: string;
}

const JobsList = ({ filteredJobs = [], userLocationAddress = "" }: JobsListProps) => {
  // Enhanced debug logging
  console.log("%c JobsList component received: ", "background: #bada55; color: #222", { 
    filteredJobsCount: filteredJobs?.length || 0,
    hasArray: Array.isArray(filteredJobs),
    userLocationAddress,
    receivedProps: filteredJobs
  });

  if (Array.isArray(filteredJobs) && filteredJobs.length > 0) {
    console.log("%c First job in list: ", "background: #ffa500; color: #000", filteredJobs[0]);
  }

  // Safe guard against undefined jobs
  const jobs = Array.isArray(filteredJobs) ? filteredJobs : [];
  
  return (
    <>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'} found 
          {userLocationAddress ? ` near ${userLocationAddress}` : ''}
        </h2>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id || Math.random().toString(36).substring(2)} job={job} />
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found matching your criteria. Try adjusting your filters.</p>
        </div>
      )}

      {/* Load More */}
      {jobs.length > 0 && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Load More Jobs
          </Button>
        </div>
      )}
    </>
  );
};

export default JobsList;
