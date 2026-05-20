import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Parkings from "./pages/Parkings";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/parkings" element={<Parkings />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;