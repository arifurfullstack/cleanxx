import { ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuoteRequestSidebar = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <h3 className="font-heading font-bold text-foreground text-lg mb-4">
        Request a Free Quote
      </h3>

      <div className="space-y-3">
        {/* Address */}
        <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <span>Address</span>
          <ChevronDown className="h-4 w-4" />
        </div>

        {/* Quote Details */}
        <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <span>Quote Details</span>
          <ChevronDown className="h-4 w-4" />
        </div>

        {/* Search Upcoming */}
        <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <span>Search Upoment Igories</span>
          <ChevronDown className="h-4 w-4" />
        </div>

        {/* Preferred Date */}
        <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <span>Preferred Satle</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Submit Button */}
      <Button variant="secondary" className="w-full mt-4 font-semibold">
        Submit Quote Request
      </Button>

      {/* Phone */}
      <div className="flex items-center gap-2 justify-center mt-3 text-sm text-muted-foreground">
        <Phone className="h-3.5 w-3.5" />
        <span>Nertat Quarles · $120 · 334-6979</span>
      </div>
    </div>
  );
};

export default QuoteRequestSidebar;
