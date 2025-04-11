
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus, Code, Pencil, Book, FastForward } from 'lucide-react';

const projectTypes = [
  { 
    name: 'Coding', 
    icon: <Code className="h-10 w-10 text-blue-500" />,
    totalHours: '8h 23m',
    sessions: 12
  },
  { 
    name: 'Design', 
    icon: <Pencil className="h-10 w-10 text-indigo-500" />,
    totalHours: '5h 15m',
    sessions: 8
  },
  { 
    name: 'Reading', 
    icon: <Book className="h-10 w-10 text-blue-600" />,
    totalHours: '3h 45m',
    sessions: 6
  },
  { 
    name: 'Quick Tasks', 
    icon: <FastForward className="h-10 w-10 text-blue-400" />,
    totalHours: '2h 10m',
    sessions: 14
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <p className="text-gray-500">Organize and track your work across different projects</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectTypes.map((project, index) => (
            <Card key={index} className="shadow-sm bg-white hover:shadow transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  {project.icon}
                  <span className="ml-3">{project.name}</span>
                </CardTitle>
                <CardDescription>
                  {project.sessions} sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{project.totalHours}</div>
                <Button variant="outline" className="w-full border-blue-200 hover:border-blue-400 text-blue-600">
                  Start Session
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <Card className="shadow-sm bg-white border-2 border-dashed border-blue-200 hover:border-blue-300 flex items-center justify-center min-h-[200px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FolderPlus className="h-12 w-12 text-blue-300 mb-4" />
              <p className="text-center text-gray-500">Create a new project to track your focused work</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Projects;
