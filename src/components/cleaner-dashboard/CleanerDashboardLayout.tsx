import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CleanerDashboardSidebar from "./CleanerDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const CleanerDashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect customers to their dashboard
  useEffect(() => {
    if (!roleLoading && role && role !== "cleaner") {
      navigate("/dashboard", { replace: true });
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Don't render if user is not a cleaner (will redirect via useEffect)
  if (role && role !== "cleaner") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CleanerDashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-heading text-lg font-semibold">Cleaner Portal</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CleanerDashboardLayout;
