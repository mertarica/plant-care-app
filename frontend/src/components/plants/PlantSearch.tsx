import { useState, useRef, useCallback } from "react";
import { usePlants } from "../../contexts/PlantsContext";

interface PlantSearchProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
}

const PlantSearch = ({
  className = "",
  placeholder = "Search plants...",
  initialValue = "",
}: PlantSearchProps) => {
  const { searchPlants } = usePlants();
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        searchPlants(value);
      }, 500);
    },
    [searchPlants]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    debouncedSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div
      className={`relative flex items-center rounded-lg border transition-all ${
        isFocused
          ? "border-green-500 shadow-sm shadow-green-100"
          : "border-gray-200"
      } bg-white ${className}`}
    >
      <input
        ref={inputRef}
        type="text"
        className="w-full py-2 px-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        aria-label="Search plants"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default PlantSearch;
