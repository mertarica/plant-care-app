import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getPlants,
  createPlant,
  updatePlant,
  deletePlant,
} from "../api/plants";

type PlantsState = {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  modalOpen: boolean;
  currentPlant: Plant | null;
};

type PlantsActions =
  | { type: "FETCH_PLANTS_START" }
  | { type: "FETCH_PLANTS_SUCCESS"; payload: Plant[] }
  | { type: "FETCH_PLANTS_ERROR"; payload: string }
  | { type: "ADD_PLANT"; payload: Plant }
  | { type: "UPDATE_PLANT"; payload: Plant }
  | { type: "DELETE_PLANT"; payload: string }
  | { type: "SET_MODAL_OPEN"; payload: boolean }
  | { type: "SET_CURRENT_PLANT"; payload: Plant | null };

const initialState: PlantsState = {
  plants: [],
  isLoading: false,
  error: null,
  modalOpen: false,
  currentPlant: null,
};

const plantsReducer = (
  state: PlantsState,
  action: PlantsActions
): PlantsState => {
  switch (action.type) {
    case "FETCH_PLANTS_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_PLANTS_SUCCESS":
      return { ...state, plants: action.payload, isLoading: false };
    case "FETCH_PLANTS_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "ADD_PLANT":
      return { ...state, plants: [...state.plants, action.payload] };
    case "UPDATE_PLANT":
      console.log(action.payload);
      return {
        ...state,
        plants: state.plants.map((plant) =>
          plant.id === action.payload.id ? action.payload : plant
        ),
      };
    case "DELETE_PLANT":
      return {
        ...state,
        plants: state.plants.filter((plant) => plant.id !== action.payload),
      };
    case "SET_MODAL_OPEN":
      return { ...state, modalOpen: action.payload };
    case "SET_CURRENT_PLANT":
      return { ...state, currentPlant: action.payload };
    default:
      return state;
  }
};

type PlantsContextType = {
  state: PlantsState;
  fetchPlants: () => Promise<void>;
  addPlant: (plant: PlantCreate) => Promise<void>;
  editPlant: (id: string, updates: PlantUpdate) => Promise<void>;
  removePlant: (id: string) => Promise<void>;
  setModalOpen: (isOpen: boolean) => Promise<void>;
  setCurrentPlant: (plant: Plant | null) => Promise<void>;
};

const PlantsContext = createContext<PlantsContextType | undefined>(undefined);

export const PlantsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(plantsReducer, initialState);

  const fetchPlants = async () => {
    dispatch({ type: "FETCH_PLANTS_START" });
    try {
      const plants = await getPlants();
      dispatch({ type: "FETCH_PLANTS_SUCCESS", payload: plants });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "FETCH_PLANTS_ERROR", payload: errorMessage });
    }
  };

  const addPlant = async (plantData: PlantCreate) => {
    try {
      const newPlant = await createPlant(plantData);
      dispatch({ type: "ADD_PLANT", payload: newPlant });
    } catch (error) {
      console.error("Failed to add plant:", error);
      throw error;
    }
  };

  const editPlant = async (id: string, updates: PlantUpdate) => {
    try {
      const updatedPlant = await updatePlant(id, updates);
      dispatch({ type: "UPDATE_PLANT", payload: updatedPlant });
    } catch (error) {
      console.error("Failed to update plant:", error);
      throw error;
    }
  };

  const removePlant = async (id: string) => {
    try {
      await deletePlant(id);
      dispatch({ type: "DELETE_PLANT", payload: id });
    } catch (error) {
      console.error("Failed to delete plant:", error);
      throw error;
    }
  };

  const setModalOpen = async (isOpen: boolean) => {
    dispatch({ type: "SET_MODAL_OPEN", payload: isOpen });
  };

  const setCurrentPlant = async (plant: Plant | null) => {
    dispatch({ type: "SET_CURRENT_PLANT", payload: plant });
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <PlantsContext.Provider
      value={{
        state,
        fetchPlants,
        addPlant,
        editPlant,
        removePlant,
        setModalOpen,
        setCurrentPlant,
      }}
    >
      {children}
    </PlantsContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantsContext);
  if (context === undefined) {
    throw new Error("usePlants must be used within a PlantsProvider");
  }
  return context;
};
