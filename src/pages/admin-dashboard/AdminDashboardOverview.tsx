import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, CalendarCheck, DollarSign, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalUsers: number;
  totalCleaners: number;
  totalBookings: number;
  pendingBookings: number;
}

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCleaners: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user count
        const { count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch cleaner count
        const { count: cleanerCount } = await supabase
          .from("cleaner_profiles")
          .select("*", { count: "exact", head: true });

        // Fetch booking counts
        const { count: bookingCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        const { count: pendingCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        setStats({
          totalUsers: userCount || 0,
          totalCleaners: cleanerCount || 0,
          totalBookings: bookingCount || 0,
          pendingBookings: pendingCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered customers",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Cleaners",
      value: stats.totalCleaners,
      description: "Service providers",
      icon: Briefcase,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      description: "All time bookings",
      icon: CalendarCheck,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to the admin panel. Monitor platform activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Platform Health
            </CardTitle>
            <CardDescription>System status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database Status</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Auth Service</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Storage</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Revenue Summary
            </CardTitle>
            <CardDescription>Platform earnings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-sm font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-medium">$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
