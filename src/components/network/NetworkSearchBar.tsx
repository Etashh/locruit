
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NetworkSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const NetworkSearchBar = ({ searchTerm, setSearchTerm }: NetworkSearchBarProps) => {
  return (
    <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by name or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default NetworkSearchBar;
