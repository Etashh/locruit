
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Code, Briefcase, Palette, Users, Calculator } from "lucide-react";

interface SkillsStepProps {
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
}

const skillCategories = {
  "Technical": {
    icon: Code,
    skills: ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "HTML/CSS"],
    color: "blue"
  },
  "Business": {
    icon: Briefcase,
    skills: ["Marketing", "Data Analysis", "Project Management", "Sales"],
    color: "green"
  },
  "Creative": {
    icon: Palette,
    skills: ["Design", "Photography", "Video Editing", "Writing", "Social Media"],
    color: "purple"
  },
  "Service": {
    icon: Users,
    skills: ["Customer Service", "Tutoring"],
    color: "orange"
  }
};

const SkillsStep = ({ selectedSkills, onSkillToggle }: SkillsStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label className="text-base font-medium flex items-center space-x-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span>Select your skills</span>
        </Label>
        <p className="text-sm text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300">
          Choose all that apply to you - the more skills, the better your matches! ✨
        </p>

        <div className="space-y-6">
          {Object.entries(skillCategories).map(([category, { icon: Icon, skills, color }], categoryIndex) => (
            <div key={category} className="animate-fade-in group" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <div className={`flex items-center space-x-2 mb-3 text-${color}-600 group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="font-medium text-lg">{category}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, skillIndex) => (
                  <div key={skill} className="animate-fade-in" style={{ animationDelay: `${(categoryIndex * skills.length + skillIndex) * 0.05}s` }}>
                    <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 ${
                      selectedSkills.includes(skill) 
                        ? `bg-${color}-50 border-${color}-300 shadow-md scale-105` 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => onSkillToggle(skill)}
                        className="data-[state=checked]:animate-bounce transition-transform duration-200 hover:scale-110"
                      />
                      <Label 
                        htmlFor={skill} 
                        className={`text-sm cursor-pointer transition-all duration-300 hover:font-medium ${
                          selectedSkills.includes(skill) 
                            ? `text-${color}-700 font-medium` 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {skill}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 animate-fade-in transform transition-all duration-300 hover:shadow-md hover:scale-102">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>{selectedSkills.length}</strong> skills selected. Great job! More skills = better opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
