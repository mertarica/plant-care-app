import PlantCard from "./PlantCard";

interface PlantListProps {
  plants: Plant[];
}

const PlantList = ({ plants }: PlantListProps) => {
  return (
    <div className="plant-list">
      <div className="plants-grid">
        {plants.map((plant) => (
          <div key={plant.id} className="plant-item my-4">
            <PlantCard plant={plant} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantList;
