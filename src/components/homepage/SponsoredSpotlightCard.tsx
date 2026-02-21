import { Star, MapPin, Clock, DollarSign, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SponsoredCleaner {
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  startingPrice: number;
  services: string[];
}

const SponsoredSpotlightCard = ({ cleaner }: { cleaner: SponsoredCleaner }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="shrink-0">
          <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted">
            <img src={cleaner.image} alt={cleaner.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-heading font-bold text-foreground text-base">{cleaner.name}</h4>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary">
              ✓
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-bold text-xs">{cleaner.rating}</span>
            <span className="text-xs text-secondary">
              <DollarSign className="h-3 w-3 inline" /> Starting ${cleaner.startingPrice}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
            <MapPin className="h-3 w-3" />
            {cleaner.location}
            <span className="ml-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <Settings className="h-3 w-3" />
              Most re in areas
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Starting ret ${cleaner.startingPrice}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Convars at ${cleaner.startingPrice}
            </span>
            <span className="flex items-center gap-1">
              <Settings className="h-3 w-3" /> Voot
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="shrink-0 flex flex-col gap-2 justify-center">
          <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold text-xs px-4">
            Request Quote
          </Button>
          <Button variant="default" size="sm" className="font-semibold text-xs px-4">
            Book Now
          </Button>
          <Button variant="secondary" size="sm" className="font-semibold text-xs px-4">
            Refereset Quenôre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsoredSpotlightCard;
