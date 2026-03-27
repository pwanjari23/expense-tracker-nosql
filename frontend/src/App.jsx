import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpensifyLanding from "./ExpensifyLanding";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExpensifyLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;