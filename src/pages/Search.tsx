import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters, { FilterState } from "@/components/SearchFilters";
import CleanerCard, { Cleaner } from "@/components/CleanerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Mock data - will be replaced with API calls
const mockCleaners: Cleaner[] = [
  {
    id: 1,
    name: "SparklePro Cleaning",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 127,
    location: "Toronto, ON",
    services: ["Home", "Deep Clean", "Airbnb"],
    priceFrom: 85,
    verified: true,
    featured: true,
    instantBooking: true,
    responseTime: "Responds in ~1 hour",
    description: "Professional home cleaning with eco-friendly products. Serving Toronto and GTA with same-day availability.",
  },
  {
    id: 2,
    name: "CleanSweep Masters",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 89,
    location: "Vancouver, BC",
    services: ["Office", "Commercial", "Post-Construction"],
    priceFrom: 120,
    verified: true,
    featured: false,
    instantBooking: true,
    responseTime: "Responds in ~2 hours",
    description: "Specialized in commercial and office cleaning. Trusted by over 50 businesses in Vancouver.",
  },
  {
    id: 3,
    name: "Eco Clean Solutions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    rating: 5.0,
    reviews: 64,
    location: "Calgary, AB",
    services: ["Eco-Friendly", "Home", "Move In/Out"],
    priceFrom: 95,
    verified: true,
    featured: true,
    instantBooking: false,
    responseTime: "Responds in ~30 min",
    description: "100% eco-friendly cleaning using only natural, non-toxic products. Perfect for families with kids and pets.",
  },
  {
    id: 4,
    name: "Maid Masters",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    location: "Montreal, QC",
    services: ["Home", "Regular", "Deep Clean"],
    priceFrom: 75,
    verified: true,
    featured: false,
    instantBooking: true,
    responseTime: "Responds in ~3 hours",
    description: "Affordable and reliable home cleaning services. Weekly, bi-weekly, and monthly plans available.",
  },
  {
    id: 5,
    name: "Crystal Clear Cleaners",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 203,
    location: "Toronto, ON",
    services: ["Home", "Office", "Windows"],
    priceFrom: 90,
    verified: true,
    featured: false,
    instantBooking: true,
    responseTime: "Responds in ~1 hour",
    description: "Comprehensive cleaning services including specialized window cleaning. Satisfaction guaranteed.",
  },
  {
    id: 6,
    name: "Fresh Start Cleaning Co.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 78,
    location: "Ottawa, ON",
    services: ["Move In/Out", "Deep Clean", "Post-Construction"],
    priceFrom: 150,
    verified: true,
    featured: true,
    instantBooking: false,
    responseTime: "Responds in ~2 hours",
    description: "Specializing in move-in/move-out and post-construction cleaning. We handle the toughest jobs.",
  },
  {
    id: 7,
    name: "Green Leaf Cleaning",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 92,
    location: "Edmonton, AB",
    services: ["Eco-Friendly", "Home", "Airbnb"],
    priceFrom: 88,
    verified: true,
    featured: false,
    instantBooking: true,
    responseTime: "Responds in ~45 min",
    description: "Sustainable cleaning solutions for environmentally conscious homeowners. Carbon-neutral operations.",
  },
  {
    id: 8,
    name: "Premier Office Cleaners",
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 167,
    location: "Vancouver, BC",
    services: ["Office", "Commercial", "Industrial"],
    priceFrom: 200,
    verified: true,
    featured: false,
    instantBooking: false,
    responseTime: "Responds in ~4 hours",
    description: "Enterprise-grade commercial cleaning for offices, warehouses, and industrial facilities.",
  },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  
  const initialService = searchParams.get("service");
  const [filters, setFilters] = useState<FilterState>({
    location: searchParams.get("location") || "",
    serviceTypes: initialService ? [initialService] : [],
    minRating: 0,
    priceRange: [0, 500],
    verifiedOnly: false,
    instantBooking: false,
    sortBy: "recommended",
  });

  // Filter and sort cleaners
  const filteredCleaners = useMemo(() => {
    let result = [...mockCleaners];

    // Filter by location
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      result = result.filter((c) => 
        c.location.toLowerCase().includes(locationLower)
      );
    }

    // Filter by service types
    if (filters.serviceTypes.length > 0) {
      result = result.filter((c) =>
        filters.serviceTypes.some((type) =>
          c.services.some((s) => s.toLowerCase().includes(type.toLowerCase()))
        )
      );
    }

    // Filter by rating
    if (filters.minRating > 0) {
      result = result.filter((c) => c.rating >= filters.minRating);
    }

    // Filter by price range
    result = result.filter(
      (c) => c.priceFrom >= filters.priceRange[0] && c.priceFrom <= filters.priceRange[1]
    );

    // Filter by verified
    if (filters.verifiedOnly) {
      result = result.filter((c) => c.verified);
    }

    // Filter by instant booking
    if (filters.instantBooking) {
      result = result.filter((c) => c.instantBooking);
    }

    // Sort
    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-high":
        result.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // Recommended: featured first, then by rating
        result.sort((a, b) => {
          if (a.featured !== b.featured) return b.featured ? 1 : -1;
          return b.rating - a.rating;
        });
    }

    return result;
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, location: searchQuery });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by location, city, or postal code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-background"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredCleaners.length}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* View Toggle (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 mb-6">
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Results Grid/List */}
            {filteredCleaners.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredCleaners.map((cleaner, index) => (
                  <div
                    key={cleaner.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CleanerCard cleaner={cleaner} variant={viewMode} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">No cleaners found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search for a different location.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      location: "",
                      serviceTypes: [],
                      minRating: 0,
                      priceRange: [0, 500],
                      verifiedOnly: false,
                      instantBooking: false,
                      sortBy: "recommended",
                    })
                  }
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredCleaners.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
