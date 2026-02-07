import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import logo from "@/assets/logo.jpeg";
import { Link } from "react-router-dom";

const DashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Redirect cleaners to their dashboard
  useEffect(() => {
    if (!roleLoading && role === "cleaner") {
      navigate("/cleaner/dashboard", { replace: true });
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role === "cleaner") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Dashboard Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="The Cleaning Network" className="h-8 w-auto rounded" />
              <span className="font-heading font-semibold text-foreground hidden sm:inline">
                The Cleaning Network
              </span>
            </Link>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
