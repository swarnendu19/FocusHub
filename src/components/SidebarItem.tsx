
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className="h-[52px] justify-start"
      asChild
    >
      <Link to={href}>
        <div className="w-8 h-8 bg-gray-600 rounded mr-5 flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {label.charAt(0)}
          </span>
        </div>
        {label}
      </Link>
    </Button>
  );
};
