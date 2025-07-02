
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Web Development",
      description: "Learning React and TypeScript",
      progress: 65,
      totalHours: 100,
      completedHours: 65,
      status: "active"
    },
    {
      id: 2,
      name: "UI/UX Design",
      description: "Mastering Figma and design principles",
      progress: 30,
      totalHours: 80,
      completedHours: 24,
      status: "active"
    },
    {
      id: 3,
      name: "Machine Learning",
      description: "Python and ML algorithms",
      progress: 100,
      totalHours: 120,
      completedHours: 120,
      status: "completed"
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    totalHours: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProject = () => {
    if (newProject.name && newProject.totalHours) {
      const project = {
        id: projects.length + 1,
        name: newProject.name,
        description: newProject.description,
        progress: 0,
        totalHours: parseInt(newProject.totalHours),
        completedHours: 0,
        status: "active"
      };
      
      setProjects([...projects, project]);
      setNewProject({ name: "", description: "", totalHours: "" });
      setIsDialogOpen(false);
    }
  };

  const overallProgress = Math.round(
    (projects.reduce((acc, p) => acc + p.completedHours, 0) / 
     projects.reduce((acc, p) => acc + p.totalHours, 0)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Track your learning projects and goals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Describe your project"
                />
              </div>
              <div>
                <Label htmlFor="hours">Target Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={newProject.totalHours}
                  onChange={(e) => setNewProject({...newProject, totalHours: e.target.value})}
                  placeholder="Total hours to complete"
                />
              </div>
              <Button onClick={handleCreateProject} className="w-full bg-primary hover:bg-primary/90">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">All Projects Combined</span>
              <span className="text-lg font-bold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {projects.reduce((acc, p) => acc + p.completedHours, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Hours Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.totalHours, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {projects.filter(p => p.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge 
                  variant={project.status === "completed" ? "default" : "secondary"}
                  className={project.status === "completed" ? "bg-primary" : ""}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{project.completedHours}h completed</span>
                  <span>{project.totalHours}h total</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                disabled={project.status === "completed"}
              >
                {project.status === "completed" ? "Completed" : "Continue Working"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
