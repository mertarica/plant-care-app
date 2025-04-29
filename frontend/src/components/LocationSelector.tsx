import Autocomplete from "react-google-autocomplete";

const LocationSelector = ({
  defaultValue,
  onSelect,
}: {
  defaultValue?: string;
  onSelect: (location: { name: string; lat: number; lng: number }) => void;
}) => {
  return (
    <Autocomplete
      apiKey={"AIzaSyADzc1vOVH7Z_pblfp1sjomEZlT-Slxvxw"}
      defaultValue={defaultValue}
      placeholder="Search for a location"
      onPlaceSelected={(place) => {
        if (place.formatted_address) {
          onSelect({
            name: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      }}
      className="w-full px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 border border-gray-300 focus:border-plant-green-500 focus:ring-plant-green-200"
    />
  );
};

export default LocationSelector;
