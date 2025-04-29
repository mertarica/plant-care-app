import { useState } from "react";

const PlantSearch = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <input
      type="text"
      placeholder="Search plants..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
      }}
    />
  );
};

export default PlantSearch;
