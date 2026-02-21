import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";
import heroCleaners from "@/assets/hero-cleaners.png";

const categories = ["A+", "Airbnb", "Office", "Windeer", "Sunstruction", "Airbnb", "Construction", "Full Home", "Office"];

const HomepageHero = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight mb-3">
              Search & Book Trusted Cleaners
            </h1>
            <p className="text-muted-foreground text-base mb-6">
              Find reliable cleaning companies near you.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center bg-card rounded-lg border border-border shadow-sm mb-4 max-w-lg">
              <div className="flex items-center flex-1 px-3 py-2.5 gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your address or postal code"
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="m-1.5 px-5 rounded-md">
                <Search className="h-4 w-4 mr-1.5" />
                Search
              </Button>
            </form>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button
                  key={`${cat}-${i}`}
                  onClick={() => navigate(`/search?service=${encodeURIComponent(cat)}`)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/80 backdrop-blur-sm text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="hidden lg:block relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={heroCleaners}
                alt="Professional cleaning team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
