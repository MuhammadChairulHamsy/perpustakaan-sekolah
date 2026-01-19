// src/components/ui/SearchBar.jsx
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const SearchBar = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          onClick={() => onChange("")}
          variant="ghost"
          className="hover:bg-foreground transition-colors duration-500 ease-in-out w-7 h-7 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
