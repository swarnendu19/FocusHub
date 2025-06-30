
import React from 'react';
import Navbar from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus, Code, Pencil, Book, FastForward } from 'lucide-react';

const projectTypes = [
  { 
    name: 'Coding', 
    icon: <Code className="h-10 w-10 text-focus-aqua" />,
    totalHours: '8h 23m',
    sessions: 12
  },
  { 
    name: 'Design', 
    icon: <Pencil className="h-10 w-10 text-focus-purple" />,
    totalHours: '5h 15m',
    sessions: 8
  },
  { 
    name: 'Reading', 
    icon: <Book className="h-10 w-10 text-focus-gold" />,
    totalHours: '3h 45m',
    sessions: 6
  },
  { 
    name: 'Quick Tasks', 
    icon: <FastForward className="h-10 w-10 text-focus-green" />,
    totalHours: '2h 10m',
    sessions: 14
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-focus-dark text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <Button className="bg-focus-purple hover:bg-focus-purple/90 glow">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <p className="text-muted-foreground">Organize and track your work across different projects</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectTypes.map((project, index) => (
            <Card key={index} className="neon-card hover:shadow-lg transition-all duration-300">
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
                <Button variant="outline" className="w-full border-focus-purple/40 hover:border-focus-purple/80">
                  Start Session
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <Card className="neon-card border-dashed border-2 border-focus-purple/30 hover:border-focus-purple/60 flex items-center justify-center min-h-[200px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FolderPlus className="h-12 w-12 text-focus-purple/60 mb-4" />
              <p className="text-center text-muted-foreground">Create a new project to track your focused work</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Projects;
