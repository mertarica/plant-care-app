import { useState, useCallback } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import LocationSelector from "../LocationSelector";
import { usePlantTypes } from "../../hooks/usePlantTypes";
import { usePlants } from "../../contexts/PlantsContext";

const PlantForm = () => {
  const {
    state: { currentPlant },
    setModalOpen,
    setCurrentPlant,
    addPlant,
    editPlant,
  } = usePlants();
  const { plantTypeOptions } = usePlantTypes();

  const [formData, setFormData] = useState({
    id: currentPlant?.id || "",
    name: currentPlant?.name || "",
    type: currentPlant?.type || "",
    weekly_water_need: currentPlant?.weekly_water_need || 0,
    expected_humidity: currentPlant?.expected_humidity || 50,
    location: currentPlant?.location || { name: "", latitude: 0, longitude: 0 },
  });

  const updateField = useCallback(
    <K extends keyof typeof formData>(
      field: K,
      value: (typeof formData)[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.id) {
        editPlant(formData.id, formData);
      } else {
        addPlant(formData);
      }
      setModalOpen(false);
    },
    [formData, addPlant, editPlant, setModalOpen]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentPlant(null);
  }, [setModalOpen, setCurrentPlant]);

  const isEditMode = Boolean(currentPlant?.id);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit Plant" : "Add New Plant"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plant Name */}
              <Input
                label="Plant Name"
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="E.g., Snake Plant, Monstera"
                required
              />

              {/* Plant Type */}
              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Plant Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 border border-gray-300 focus:border-plant-green-500 focus:ring-plant-green-200"
                >
                  {plantTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Water Need */}
              <div>
                <Input
                  label="Weekly Water Need (mm)"
                  type="number"
                  id="weekly_water_need"
                  value={formData.weekly_water_need.toString()}
                  onChange={(e) =>
                    updateField("weekly_water_need", Number(e.target.value))
                  }
                  placeholder="E.g., 250"
                  required
                />
                <div className="mt-1 text-xs text-gray-500">
                  Approximate amount of water your plant needs per week in
                  milliliters
                </div>
              </div>

              {/* Humidity */}
              <div>
                <Input
                  label="Expected Humidity (%)"
                  type="number"
                  id="expected_humidity"
                  min="0"
                  max="100"
                  value={formData.expected_humidity.toString()}
                  onChange={(e) =>
                    updateField("expected_humidity", Number(e.target.value))
                  }
                  placeholder="E.g., 50"
                  required
                />
                <div className="mt-1 text-xs text-gray-500">
                  Ideal humidity level for your plant (0-100%)
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
                <span className="text-red-500 ml-1">*</span>
              </label>
              <LocationSelector
                defaultValue={formData.location.name}
                onSelect={(location) =>
                  updateField("location", {
                    name: location.name,
                    latitude: location.lat,
                    longitude: location.lng,
                  })
                }
              />
              <div className="mt-1 text-xs text-gray-500">
                Where is your plant located? This helps calculate local weather
                conditions.
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isEditMode ? "Update Plant" : "Add Plant"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantForm;
