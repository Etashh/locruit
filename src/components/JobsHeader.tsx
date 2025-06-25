
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface JobsHeaderProps {}

const JobsHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Find Local Opportunities Near You
          </h1>
          <p className="text-xl text-gray-600">
            Discover internships, part-time jobs, and career opportunities in your neighborhood
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Link to="/create-job">
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white hover:scale-105 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Post a Local Job
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobsHeader;
