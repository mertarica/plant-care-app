interface PlantBase {
  name: string;
  type: PlantType;
  weekly_water_need: number; // ml per week
  expected_humidity: number; // percentage (0-100)
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface Plant extends PlantBase {
  id: string;
  created_at?: string;
  updated_at?: string;
  health_score?: number; // cached health score (0-100)
  last_checked?: string; // ISO timestamp
}

type PlantCreate = Omit<
  Plant,
  "id" | "created_at" | "updated_at" | "health_score" | "last_checked"
>;
type PlantUpdate = Partial<PlantCreate>;