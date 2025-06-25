
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface ProjectsLinksStepProps {
  projects: Project[];
  portfolio: string;
  linkedin: string;
  github: string;
  onAddProject: () => void;
  onUpdateProject: (id: string, field: string, value: string) => void;
  onRemoveProject: (id: string) => void;
  onPortfolioChange: (portfolio: string) => void;
  onLinkedinChange: (linkedin: string) => void;
  onGithubChange: (github: string) => void;
}

const ProjectsLinksStep = ({
  projects,
  portfolio,
  linkedin,
  github,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
  onPortfolioChange,
  onLinkedinChange,
  onGithubChange
}: ProjectsLinksStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Projects</Label>
          <Button variant="outline" size="sm" onClick={onAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Project title"
                    value={project.title}
                    onChange={(e) => onUpdateProject(project.id, 'title', e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProject(project.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Project description"
                  value={project.description}
                  onChange={(e) => onUpdateProject(project.id, 'description', e.target.value)}
                  rows={2}
                />
                <Input
                  placeholder="Project URL (optional)"
                  value={project.url}
                  onChange={(e) => onUpdateProject(project.id, 'url', e.target.value)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio Website</Label>
          <Input
            id="portfolio"
            placeholder="https://yourportfolio.com"
            value={portfolio}
            onChange={(e) => onPortfolioChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/yourname"
            value={linkedin}
            onChange={(e) => onLinkedinChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            id="github"
            placeholder="https://github.com/yourusername"
            value={github}
            onChange={(e) => onGithubChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsLinksStep;
