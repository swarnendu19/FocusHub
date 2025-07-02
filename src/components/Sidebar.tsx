
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link to="/">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            FocusHub
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" href="/" iconSrc="/home.svg" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem label="XP growth" href="/xp" iconSrc="/xp.svg" />
        <SidebarItem label="Project" href="/projects" iconSrc="/project.svg" />
      </div>

      <div className="p-4">
        {/* User profile section placeholder */}
      </div>
    </div>
  );
};
