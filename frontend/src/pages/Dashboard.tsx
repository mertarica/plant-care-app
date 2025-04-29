import PlantList from "../components/plants/PlantList";
import PlantForm from "../components/plants/PlantForm";
import Button from "../components/common/Button";
import { usePlants } from "../contexts/PlantsContext";
import PlantSearch from "../components/plants/PlantSearch";

const Dashboard = () => {
  const {
    state: { plants, modalOpen, isLoading },
    setModalOpen,
    setCurrentPlant,
  } = usePlants();

  const handleAddPlant = () => {
    setModalOpen(true);
    setCurrentPlant(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="mb-4 flex justify-start">
          <PlantSearch />
        </div>
        <div className="mb-4 flex justify-end">
          <Button variant="primary" onClick={handleAddPlant}>
            Add New Plant
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start justify-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            Plant Care Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage your plants' health
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Dashboard grid */}
          <div className="flex flex-col gap-6">
            {/* Stats cards in horizontal row at top */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-gray-500 text-sm font-medium">
                  Weekly Water Need
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-2xl font-bold text-green-700">
                    {plants
                      .reduce(
                        (total, plant) => total + plant.weekly_water_need,
                        0
                      )
                      .toFixed(0)}{" "}
                    mm
                  </span>
                  <span className="ml-2 text-sm text-gray-500">this week</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Plants
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-2xl font-bold text-green-700">
                    {plants.length}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    plants in your collection
                  </span>
                </div>
              </div>
            </div>

            {/* plant list */}
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">Your Plants</h2>
              {plants.length > 0 ? (
                <PlantList plants={plants} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No plants added yet</p>
                  <Button variant="primary" onClick={handleAddPlant}>
                    Add your first plant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Plant Form Modal */}
      {modalOpen && <PlantForm />}
    </div>
  );
};

export default Dashboard;
