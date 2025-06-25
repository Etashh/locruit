import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Database, Settings, Globe, Code } from 'lucide-react';

const SetupGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(step => step !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Database Setup",
      icon: <Database className="w-5 h-5" />,
      description: "Run the SQL schema in your Supabase dashboard",
      instructions: [
        "Go to your Supabase dashboard",
        "Navigate to SQL Editor",
        "Copy the contents of src/database/schema.sql",
        "Paste and run the SQL commands",
        "Verify tables are created successfully"
      ],
      priority: "high"
    },
    {
      id: 2,
      title: "Google OAuth Setup",
      icon: <Globe className="w-5 h-5" />,
      description: "Configure Google authentication in Supabase",
      instructions: [
        "Go to Supabase Dashboard → Authentication → Providers",
        "Enable Google provider",
        "Get Google OAuth credentials from Google Cloud Console",
        "Add Client ID and Client Secret to Supabase",
        "Add your domain to authorized redirect URLs"
      ],
      priority: "high"
    },
    {
      id: 3,
      title: "Environment Variables",
      icon: <Settings className="w-5 h-5" />,
      description: "Verify your environment configuration",
      instructions: [
        "Check your .env file contains:",
        "VITE_SUPABASE_URL=your_supabase_url",
        "VITE_SUPABASE_ANON_KEY=your_anon_key",
        "Restart your development server"
      ],
      priority: "medium"
    },
    {
      id: 4,
      title: "Test the API",
      icon: <Code className="w-5 h-5" />,
      description: "Verify everything is working",
      instructions: [
        "Start your development server: npm run dev",
        "Navigate to /jobs page",
        "Enable location access",
        "Check if jobs are loading from the database",
        "Test Google authentication"
      ],
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Guide</h1>
        <p className="text-gray-600">
          Complete these steps to get your location-based job matching API working
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-sm">
            {completedSteps.length} of {steps.length} steps completed
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          
          return (
            <Card key={step.id} className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStep(step.id)}
                      className="p-0 h-auto"
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </Button>
                    <div className="flex items-center space-x-2">
                      {step.icon}
                      <span className={isCompleted ? 'line-through text-gray-500' : ''}>
                        {step.title}
                      </span>
                    </div>
                  </CardTitle>
                  <Badge className={getPriorityColor(step.priority)}>
                    {step.priority} priority
                  </Badge>
                </div>
                <p className="text-gray-600 ml-9">{step.description}</p>
              </CardHeader>
              <CardContent className="ml-9">
                <div className="space-y-2">
                  {step.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-sm text-gray-400 mt-0.5">{index + 1}.</span>
                      <span className="text-sm text-gray-700">{instruction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What You Get After Setup:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Location-based job matching with distance calculations</li>
                <li>• User preference management (travel distance, job types, salary)</li>
                <li>• Google OAuth authentication</li>
                <li>• Job saving and application tracking</li>
                <li>• Enhanced forgot password functionality</li>
                <li>• Real-time job recommendations based on user location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Need help? Check the console for any errors and ensure all dependencies are installed.
        </p>
      </div>
    </div>
  );
};

export default SetupGuide;