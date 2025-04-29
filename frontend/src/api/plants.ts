import apiClient from "./client";

export const getPlant = async (id: string): Promise<Plant> => {
  const response = await apiClient.get(`/plants/${id}`);
  return response.data;
};

export const getPlants = async (): Promise<Plant[]> => {
  const response = await apiClient.get("/plants");
  return response.data;
};

export const createPlant = async (plant: PlantCreate): Promise<Plant> => {
  const response = await apiClient.post("/plants", plant);
  return response.data;
};

export const updatePlant = async (
  id: string,
  plant: Partial<PlantCreate>
): Promise<Plant> => {
  const response = await apiClient.patch(`/plants/${id}`, plant);
  return response.data;
};

export const deletePlant = async (id: string): Promise<void> => {
  await apiClient.delete(`/plants/${id}`);
};

export const searchPlantsByText = async (query: string): Promise<Plant[]> => {
  const response = await apiClient.get("/plants/search", {
    params: { q: query },
  });
  return response.data;
};
