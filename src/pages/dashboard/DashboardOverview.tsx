import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  History,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
  id: string;
  service_type: string;
  service_price: number;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  cleaner_name: string | null;
  addresses: {
    street_address: string;
    city: string;
  } | null;
}

interface Profile {
  full_name: string | null;
  email: string | null;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();
        
        setProfile(profileData);

        // Fetch upcoming bookings
        const today = new Date().toISOString().split("T")[0];
        const { data: upcoming } = await supabase
          .from("bookings")
          .select(`
            id,
            service_type,
            service_price,
            scheduled_date,
            scheduled_time,
            status,
            cleaner_name,
            addresses (
              street_address,
              city
            )
          `)
          .eq("customer_id", user.id)
          .gte("scheduled_date", today)
          .in("status", ["pending", "confirmed"])
          .order("scheduled_date", { ascending: true })
          .limit(3);

        setUpcomingBookings(upcoming || []);

        // Fetch recent completed bookings
        const { data: recent } = await supabase
          .from("bookings")
          .select(`
            id,
            service_type,
            service_price,
            scheduled_date,
            scheduled_time,
            status,
            cleaner_name,
            addresses (
              street_address,
              city
            )
          `)
          .eq("customer_id", user.id)
          .eq("status", "completed")
          .order("scheduled_date", { ascending: false })
          .limit(3);

        setRecentBookings(recent || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "completed":
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your cleaning services
          </p>
        </div>
        <Button asChild variant="cta">
          <Link to="/search">
            <Plus className="h-4 w-4 mr-2" />
            Book a Cleaning
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled cleanings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Total cleanings done
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Cleaning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingBookings.length > 0
                ? format(new Date(upcomingBookings[0].scheduled_date), "MMM d")
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingBookings.length > 0
                ? upcomingBookings[0].scheduled_time
                : "No upcoming bookings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Saved locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Cleanings</CardTitle>
            <CardDescription>Your scheduled cleaning appointments</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/upcoming">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{booking.service_type}</h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(booking.scheduled_date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.scheduled_time}
                      </span>
                      {booking.addresses && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.addresses.city}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">${booking.service_price}</div>
                    {booking.cleaner_name && (
                      <div className="text-sm text-muted-foreground">{booking.cleaner_name}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No upcoming cleanings</h3>
              <p className="text-muted-foreground mb-4">
                Book your first cleaning to get started
              </p>
              <Button asChild>
                <Link to="/search">Find a Cleaner</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Your past cleaning services</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/history">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{booking.service_type}</h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(booking.scheduled_date), "MMM d, yyyy")}
                      </span>
                      {booking.cleaner_name && (
                        <span>{booking.cleaner_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${booking.service_price}</div>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Book Again
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No cleaning history yet</h3>
              <p className="text-muted-foreground">
                Your completed cleanings will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
