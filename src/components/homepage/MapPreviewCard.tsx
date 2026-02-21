import { MapPin } from "lucide-react";

const MapPreviewCard = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Map Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-background overflow-hidden">
        {/* Fake map styling */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/3 w-px h-24 bg-border" />
          <div className="absolute top-1/3 left-1/4 w-32 h-px bg-border" />
          <div className="absolute top-1/2 left-1/2 w-px h-20 bg-border" />
          <div className="absolute top-2/3 left-1/5 w-24 h-px bg-border" />
          <div className="absolute top-1/4 right-1/4 w-20 h-px bg-border" />
        </div>
        
        {/* Map Pins */}
        <div className="absolute top-1/4 right-1/3">
          <div className="w-6 h-8 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-secondary fill-secondary" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2">
          <div className="w-6 h-8 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary fill-primary" />
          </div>
        </div>

        {/* Map labels */}
        <span className="absolute top-4 right-4 text-[10px] text-muted-foreground">Oshawa</span>
        <span className="absolute bottom-8 right-8 text-[10px] text-muted-foreground">Cognation</span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h4 className="font-heading font-bold text-foreground">Your Cleancs Nε 9</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Cartt your r anea · Cleaning Guote · State · cearn
        </p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Coroiglet
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            IMaaspens
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Neove · 0 d.l39
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapPreviewCard;
