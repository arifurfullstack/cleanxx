import { Star, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CleanerOfTheWeekCard = () => {
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
          <span className="text-xs">139 · 55 reviews</span>
          <span className="ml-auto text-xs cursor-pointer hover:text-foreground">›</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex gap-5">
        {/* Cleaner Image */}
        <div className="shrink-0">
          <div className="w-32 h-36 rounded-lg overflow-hidden bg-muted">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=400&fit=crop"
              alt="SparklePro Cleaning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            SparklePro Cleaning
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-bold text-sm">5.0</span>
            <span className="text-muted-foreground text-sm">55 reviews</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <MapPin className="h-3.5 w-3.5" />
            Pickering, ON
          </div>
          <div className="flex items-center gap-1 text-sm text-primary mb-2">
            <Info className="h-3.5 w-3.5" />
            <span>Residential · Office · Deep Clean · Airbnb</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="shrink-0 flex flex-col gap-2 justify-center">
          <Button variant="secondary" className="font-semibold px-6">
            Request Quote
          </Button>
          <Button variant="default" className="font-semibold px-6">
            Book Now ›
          </Button>
          <span className="text-sm text-muted-foreground text-center">
            Request Quote · $70
          </span>
        </div>
      </div>
    </div>
  );
};

export default CleanerOfTheWeekCard;
