import { Star } from "lucide-react";
import SponsoredSpotlightCard from "./SponsoredSpotlightCard";

const sponsoredCleaners = [
  {
    name: "Maid Masters",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=400&fit=crop",
    rating: 5.0,
    reviews: 156,
    location: "Oshawa, ON",
    startingPrice: 120,
    services: ["Home", "Regular", "Deep Clean"],
  },
];

const SponsoredSpotlightSection = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-accent text-accent" />
        <h3 className="font-heading font-bold text-foreground text-lg">Sponsored Spotlight</h3>
      </div>
      {sponsoredCleaners.map((cleaner) => (
        <SponsoredSpotlightCard key={cleaner.name} cleaner={cleaner} />
      ))}
    </div>
  );
};

export default SponsoredSpotlightSection;
