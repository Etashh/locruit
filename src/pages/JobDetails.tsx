import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { Job } from "@/services/jobService";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch job from localStorage (for demo), or fetch from API
    const fetchJob = async () => {
      setLoading(true);
      try {
        // Try to find job in localStorage (from jobs list)
        const jobs = JSON.parse(localStorage.getItem("jobsList") || "[]");
        let found = jobs.find((j: Job) => String(j.id) === String(id));
        if (!found) {
          // Fallback: fetch from API
          const res = await fetch(`/api/job/${id}`);
          found = await res.json();
        }
        setJob(found);
      } catch (e) {
        setJob(null);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!job) return <div className="p-8 text-center text-red-600">Job not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <Card className="bg-white/90 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <CardTitle className="text-2xl text-gray-800">{job.title}</CardTitle>
            {job.featured && (
              <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">Featured</Badge>
            )}
          </div>
          <p className="text-lg font-medium text-blue-600 mb-2">{job.company}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{job.posted}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{skill}</Badge>
              ))}
            </div>
          </div>
          {(job.contact_email || job.contact_phone || job.contact_url) && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Contact / Apply</h3>
              {job.contact_email && <div>Email: <a href={`mailto:${job.contact_email}`} className="text-blue-600 underline">{job.contact_email}</a></div>}
              {job.contact_phone && <div>Phone: <a href={`tel:${job.contact_phone}`} className="text-blue-600 underline">{job.contact_phone}</a></div>}
              {job.contact_url && <div>Link: <a href={job.contact_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{job.contact_url}</a></div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;
