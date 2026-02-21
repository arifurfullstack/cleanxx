import { Star, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveCleanerOfTheWeek } from "@/hooks/useCleanerOfTheWeek";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const CleanerOfTheWeekCard = () => {
  const { data, isLoading } = useActiveCleanerOfTheWeek();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden p-5">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex gap-5">
          <Skeleton className="w-32 h-36 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.cleaner_profiles) {
    return null;
  }

  const profile = data.cleaner_profiles;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground font-semibold text-sm">
          <Star className="h-4 w-4 fill-current" />
          Cleaner of the Week
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm flex-1">
          <span className="font-medium">sponsored Spotlight✨</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
            ))}
          </div>
          <span className="text-xs">{profile.service_areas.length} areas</span>
          <Link to={`/cleaner/${profile.id}`} className="ml-auto text-xs cursor-pointer hover:text-foreground">›</Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex gap-5">
        {/* Cleaner Image */}
        <div className="shrink-0">
          <div className="w-32 h-36 rounded-lg overflow-hidden bg-muted">
            <img
              src={profile.profile_image || "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=400&fit=crop"}
              alt={profile.business_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {profile.business_name}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-bold text-sm">5.0</span>
            {profile.is_verified && (
              <span className="text-muted-foreground text-sm">Verified</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <MapPin className="h-3.5 w-3.5" />
            {profile.service_areas[0] || "Local Area"}
          </div>
          <div className="flex items-center gap-1 text-sm text-primary mb-2">
            <Info className="h-3.5 w-3.5" />
            <span>{profile.services.join(" · ")}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="shrink-0 flex flex-col gap-2 justify-center">
          <Button variant="secondary" className="font-semibold px-6">
            Request Quote
          </Button>
          <Button variant="default" className="font-semibold px-6" asChild>
            <Link to={`/cleaner/${profile.id}`}>Book Now ›</Link>
          </Button>
          <span className="text-sm text-muted-foreground text-center">
            Request Quote · ${profile.hourly_rate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CleanerOfTheWeekCard;
