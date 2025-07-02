
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-green-600">FocusHUB</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-green-600 text-white text-sm font-semibold">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
