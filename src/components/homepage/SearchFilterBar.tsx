import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const filterChips = ["Serereeh", "Raole deme", "Search +", "Trunaneing", "Reserves"];

const SearchFilterBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-card border-b border-border py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-muted rounded-md px-3 py-2 gap-2 flex-1 max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter your address or postal code"
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filterChips.map((chip, i) => (
            <button
              key={chip}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                i === 2
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
