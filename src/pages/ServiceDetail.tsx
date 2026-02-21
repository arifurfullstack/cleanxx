import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, MapPin, Clock, DollarSign, Star, CheckCircle,
  Eye, ShoppingBag, AlertCircle, MessageSquare, Share2, Link, Loader2, Zap,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import logoDefault from "@/assets/logo.jpeg";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBuying, setIsBuying] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["service-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_listings")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;

      // Increment views
      supabase.from("service_listings")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", id!)
        .then();

      // Fetch cleaner profile
      const { data: profile } = await supabase
        .from("cleaner_profiles")
        .select("id, business_name, profile_image, is_verified, bio, hourly_rate, years_experience, response_time, user_id")
        .eq("id", data.cleaner_profile_id)
        .single();

      // Fetch reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("cleaner_profile_id", data.cleaner_profile_id);

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        cleaner_name: profile?.business_name || "Cleaning Pro",
        cleaner_image: profile?.profile_image,
        cleaner_verified: profile?.is_verified || false,
        cleaner_bio: profile?.bio,
        cleaner_experience: profile?.years_experience,
        cleaner_response_time: profile?.response_time,
        cleaner_user_id: profile?.user_id,
        cleaner_rating: avgRating,
        cleaner_reviews_count: reviews?.length || 0,
      };
    },
  });

  // Fetch similar listings
  const { data: similarListings = [] } = useQuery({
    queryKey: ["similar-services", id, listing?.category],
    enabled: !!listing,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_listings")
        .select("id, title, price, price_type, image_url, category")
        .eq("is_active", true)
        .eq("category", listing!.category)
        .neq("id", id!)
        .order("orders_count", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
  });

  const getPriceLabel = (type: string, price: number) => {
    switch (type) {
      case "hourly": return `$${price}/hr`;
      case "starting_at": return `From $${price}`;
      default: return `$${price}`;
    }
  };

  const handleInstantBuy = useCallback(async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to book a service.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!listing) return;

    // Prevent booking own service
    if (user.id === listing.cleaner_user_id) {
      toast({ title: "Cannot book", description: "You cannot book your own service.", variant: "destructive" });
      return;
    }

    setIsBuying(true);
    try {
      const scheduledDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
      const { data, error } = await supabase.from("bookings").insert({
        customer_id: user.id,
        cleaner_id: listing.cleaner_user_id,
        cleaner_name: listing.cleaner_name,
        service_type: listing.title,
        service_price: listing.price,
        duration_hours: listing.duration_hours || 2,
        scheduled_date: scheduledDate,
        scheduled_time: "09:00",
        status: "pending",
        special_instructions: `Instant booking for service: ${listing.title}`,
      }).select().single();

      if (error) throw error;

      // Increment orders count
      await supabase.from("service_listings")
        .update({ orders_count: (listing.orders_count || 0) + 1 })
        .eq("id", listing.id);

      toast({ title: "Service Booked!", description: "Your booking has been placed. The cleaner will confirm shortly." });
      navigate("/dashboard/upcoming-bookings");
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsBuying(false);
    }
  }, [user, listing, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-80 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center max-w-4xl">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">This service listing may have been removed.</p>
          <Button onClick={() => navigate("/services")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Services
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back + Share */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Services
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link Copied!" });
              }}>
                <Link className="h-4 w-4 mr-2" /> Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-xl overflow-hidden">
              <img
                src={listing.image_url || logoDefault}
                alt={listing.title}
                className="w-full max-h-[400px] object-cover"
              />
            </div>

            {/* Gallery */}
            {listing.gallery_images && listing.gallery_images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.gallery_images.map((img: string, i: number) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} className="h-20 w-28 object-cover rounded-lg shrink-0" />
                ))}
              </div>
            )}

            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline">{listing.category}</Badge>
                {listing.cleaner_verified && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified Pro
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {listing.cleaner_rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">{listing.cleaner_rating.toFixed(1)}</span>
                    ({listing.cleaner_reviews_count} reviews)
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {listing.views_count} views
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" /> {listing.orders_count} orders
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold text-lg text-foreground mb-2">About This Service</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{listing.description}</p>
            </div>

            {/* What's Included */}
            {listing.features && listing.features.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="font-semibold text-lg text-foreground mb-3">What's Included</h2>
                  <ul className="space-y-2">
                    {listing.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Service Details */}
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listing.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                </div>
              )}
              {listing.duration_hours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Duration</p>
                    <p className="font-medium">{listing.duration_hours} hours</p>
                  </div>
                </div>
              )}
              {listing.delivery_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Delivery</p>
                    <p className="font-medium">{listing.delivery_time}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pricing Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-foreground">
                    {getPriceLabel(listing.price_type, listing.price)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.price_type === "hourly" ? "per hour" : listing.price_type === "starting_at" ? "starting price" : "fixed price"}
                  </p>
                </div>

                <Button
                  variant="cta"
                  className="w-full mb-3"
                  size="lg"
                  disabled={isBuying}
                  onClick={handleInstantBuy}
                >
                  {isBuying ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {isBuying ? "Booking..." : "Instant Buy"}
                </Button>

                <Button variant="outline" className="w-full mb-3" size="lg" onClick={() => navigate(`/cleaner/${listing.cleaner_profile_id}`)}>
                  <MessageSquare className="h-4 w-4 mr-2" /> Contact & Book
                </Button>

                <Separator className="my-4" />

                {/* Cleaner Card */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.cleaner_image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {listing.cleaner_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{listing.cleaner_name}</p>
                    {listing.cleaner_rating > 0 && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {listing.cleaner_rating.toFixed(1)} ({listing.cleaner_reviews_count})
                      </p>
                    )}
                  </div>
                  {listing.cleaner_verified && (
                    <Badge variant="outline" className="text-[10px] shrink-0">Verified</Badge>
                  )}
                </div>

                {listing.cleaner_bio && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{listing.cleaner_bio}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  {listing.cleaner_experience && (
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-foreground">{listing.cleaner_experience}+</p>
                      <p className="text-muted-foreground">Years Exp</p>
                    </div>
                  )}
                  {listing.cleaner_response_time && (
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-foreground text-[11px]">{listing.cleaner_response_time}</p>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => navigate(`/cleaner/${listing.cleaner_profile_id}`)}>
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Services */}
        {similarListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Similar Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarListings.map((s) => (
                <Card
                  key={s.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/services/${s.id}`)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={s.image_url || logoDefault} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium line-clamp-2">{s.title}</p>
                    <p className="text-primary font-bold text-sm mt-1">
                      {getPriceLabel(s.price_type, s.price)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
