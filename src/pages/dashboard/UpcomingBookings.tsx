import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  CheckCircle,
  X,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

interface Booking {
  id: string;
  service_type: string;
  service_price: number;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  status: string;
  cleaner_name: string | null;
  special_instructions: string | null;
  addresses: {
    label: string;
    street_address: string;
    city: string;
    province: string;
    postal_code: string;
  } | null;
}

const UpcomingBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { 
    settings, 
    formatCurrency, 
    isCancellationAllowed 
  } = usePlatformSettings();

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          service_type,
          service_price,
          scheduled_date,
          scheduled_time,
          duration_hours,
          status,
          cleaner_name,
          special_instructions,
          addresses (
            label,
            street_address,
            city,
            province,
            postal_code
          )
        `)
        .eq("customer_id", user.id)
        .gte("scheduled_date", today)
        .in("status", ["pending", "confirmed", "in_progress"])
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("customer_id", user?.id);

      if (error) throw error;

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "in_progress":
        return <Badge variant="info" className="gap-1"><Clock className="h-3 w-3" /> In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canCancel = (booking: Booking) => {
    return isCancellationAllowed(
      new Date(booking.scheduled_date),
      booking.scheduled_time
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Upcoming Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled cleaning services
          </p>
        </div>
        <Button asChild variant="cta">
          <Link to="/search">
            <Plus className="h-4 w-4 mr-2" />
            Book New Cleaning
          </Link>
        </Button>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const cancellationAllowed = canCancel(booking);
            
            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-xl font-semibold">
                          {booking.service_type}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">
                              {format(new Date(booking.scheduled_date), "EEEE, MMMM d, yyyy")}
                            </div>
                            <div className="text-muted-foreground">
                              {booking.scheduled_time} • {booking.duration_hours} hours
                            </div>
                          </div>
                        </div>

                        {booking.addresses && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">{booking.addresses.label}</div>
                              <div className="text-muted-foreground">
                                {booking.addresses.street_address}, {booking.addresses.city}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {booking.cleaner_name && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Cleaner: </span>
                          <span className="font-medium">{booking.cleaner_name}</span>
                        </div>
                      )}

                      {booking.special_instructions && (
                        <div className="text-sm p-3 bg-muted rounded-lg">
                          <span className="font-medium">Special Instructions: </span>
                          <span className="text-muted-foreground">{booking.special_instructions}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(booking.service_price)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        
                        {cancellationAllowed ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  disabled 
                                  className="text-muted-foreground"
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cancellation not available within {settings.cancellation_window_hours} hours of appointment</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">
              No Upcoming Appointments
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any scheduled cleanings. Book a cleaning service to get started.
            </p>
            <Button asChild size="lg">
              <Link to="/search">Find a Cleaner</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpcomingBookings;
