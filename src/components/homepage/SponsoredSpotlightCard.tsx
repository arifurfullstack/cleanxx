import { Star, MapPin, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { trackSponsoredClick } from "@/hooks/useSponsoredListings";

interface SponsoredCleaner {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  startingPrice: number;
  services: string[];
  isVerified: boolean;
}

const SponsoredSpotlightCard = ({ cleaner, listingId }: { cleaner: SponsoredCleaner; listingId: string }) => {
  const handleQuoteClick = () => trackSponsoredClick(listingId, "quote");
  const handleBookClick = () => trackSponsoredClick(listingId, "book");

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
            {cleaner.isVerified && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary">
                <Shield className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(cleaner.rating) ? "fill-accent text-accent" : "text-muted"}`} />
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
          </div>
          <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
            {cleaner.services.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 bg-muted rounded">{s}</span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="shrink-0 flex flex-col gap-2 justify-center">
          <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold text-xs px-4" onClick={handleQuoteClick}>
            Request Quote
          </Button>
          <Button variant="default" size="sm" className="font-semibold text-xs px-4" asChild onClick={handleBookClick}>
            <Link to={`/cleaner/${cleaner.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsoredSpotlightCard;
