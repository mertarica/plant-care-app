import { useMemo } from "react";
import { PlantType } from "../enums/plant";

export interface PlantTypeOption {
  value: PlantType | "";
  label: string;
}

export function usePlantTypes() {
  const plantTypeOptions = useMemo<PlantTypeOption[]>(
    () => [
      { value: "", label: "Select Plant Type" },
      { value: PlantType.SUCCULENT, label: "Succulent" },
      { value: PlantType.CACTUS, label: "Cactus" },
      { value: PlantType.FLOWERING, label: "Flowering Plant" },
      { value: PlantType.FERN, label: "Fern" },
      { value: PlantType.TREE, label: "Tree" },
      { value: PlantType.PALM, label: "Palm" },
      { value: PlantType.HERB, label: "Herb" },
      { value: PlantType.VINE, label: "Vine" },
      { value: PlantType.OTHER, label: "Other" },
    ],
    []
  );

  // Get a human-readable label for a plant type
  const getPlantTypeLabel = (type: PlantType): string => {
    const option = plantTypeOptions.find((opt) => opt.value === type);
    return option?.label || "Unknown";
  };

  // Get an appropriate icon for a plant type
  const getPlantIcon = (type: PlantType): string => {
    switch (type) {
      case PlantType.SUCCULENT:
        return "🪴"; // Potted plant (for succulent)
      case PlantType.CACTUS:
        return "🌵"; // Cactus
      case PlantType.TREE:
        return "🌳"; // Deciduous tree
      case PlantType.PALM:
        return "🌴"; // Palm tree
      case PlantType.FLOWERING:
        return "🌸"; // Cherry blossom
      case PlantType.FERN:
        return "🌿"; // Herb (for fern)
      case PlantType.HERB:
        return "🌱"; // Seedling (for herb)
      case PlantType.VINE:
        return "🍃"; // Leaf fluttering in wind (for vine)
      case PlantType.OTHER:
        return "🌲"; // Evergreen tree (for other)
      default:
        return "🪴"; // Potted plant (fallback)
    }
  };

  return {
    plantTypeOptions,
    getPlantTypeLabel,
    getPlantIcon,
  };
}
