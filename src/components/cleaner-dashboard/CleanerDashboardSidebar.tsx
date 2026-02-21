import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  DollarSign, 
  Settings, 
  ClipboardList,
  LogOut,
  Crown,
  Zap,
  ShoppingBag
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Overview", url: "/cleaner/dashboard", icon: LayoutDashboard },
  { title: "My Services", url: "/cleaner/services", icon: ShoppingBag },
  { title: "Booking Requests", url: "/cleaner/bookings", icon: ClipboardList },
  { title: "My Schedule", url: "/cleaner/schedule", icon: Calendar },
  { title: "Membership", url: "/cleaner/subscription", icon: Crown },
  { title: "Sponsored Spotlight", url: "/cleaner/sponsorship", icon: Zap },
  { title: "My Profile", url: "/cleaner/profile", icon: User },
  { title: "Earnings", url: "/cleaner/earnings", icon: DollarSign },
  { title: "Settings", url: "/cleaner/settings", icon: Settings },
];

const CleanerDashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Cleaner Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-2.5 rounded-lg transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CleanerDashboardSidebar;
