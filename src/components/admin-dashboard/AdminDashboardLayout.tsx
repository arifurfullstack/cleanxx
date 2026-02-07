import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield } from "lucide-react";

const AdminDashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!roleLoading && role && role !== "admin") {
      // Redirect to appropriate dashboard based on role
      if (role === "cleaner") {
        navigate("/cleaner/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-destructive" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Don't render if user is not an admin (will redirect via useEffect)
  if (role && role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminDashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              <h1 className="font-heading text-lg font-semibold">Admin Panel</h1>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboardLayout;
