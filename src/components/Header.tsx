
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[#4A5F67] bg-[#1A2B32] shadow-md">
      <div className="flex items-center gap-4">
        {/* Logo Placeholder */}
        <div className="text-2xl font-extrabold text-[#58CC02] tracking-tight font-[din-round]">QuestLog</div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-[#FFFFFF] hover:bg-[#2A3F47]">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#FFFFFF] hover:bg-[#2A3F47]">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#FFFFFF] hover:bg-[#2A3F47]">
          <LogOut className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9 border-2 border-[#58CC02]">
          <AvatarFallback className="bg-[#1CB0F6] text-white text-sm font-semibold">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
