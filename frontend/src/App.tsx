import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { PlantsProvider } from "./contexts/PlantsContext";

function App() {
  return (
    <PlantsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </PlantsProvider>
  );
}

export default App;
