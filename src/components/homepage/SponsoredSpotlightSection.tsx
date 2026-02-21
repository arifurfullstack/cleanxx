import { Star } from "lucide-react";
import { useActiveSponsoredListings } from "@/hooks/useSponsoredListings";
import SponsoredSpotlightCard from "./SponsoredSpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";

const SponsoredSpotlightSection = () => {
  const { data: listings, isLoading } = useActiveSponsoredListings();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-accent text-accent" />
        <h3 className="font-heading font-bold text-foreground text-lg">Sponsored Spotlight</h3>
      </div>
      {listings.map((listing) => (
        <SponsoredSpotlightCard
          key={listing.id}
          cleaner={{
            id: listing.cleaner_profiles?.id || listing.cleaner_profile_id,
            name: listing.cleaner_profiles?.business_name || "Cleaning Pro",
            image: listing.cleaner_profiles?.profile_image || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=400&fit=crop",
            rating: 5.0,
            reviews: 0,
            location: listing.cleaner_profiles?.service_areas?.[0] || "Local Area",
            startingPrice: listing.cleaner_profiles?.hourly_rate || 0,
            services: listing.cleaner_profiles?.services || [],
            isVerified: listing.cleaner_profiles?.is_verified || false,
          }}
          listingId={listing.id}
        />
      ))}
    </div>
  );
};

export default SponsoredSpotlightSection;
