import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Countdown from "./countdown";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/countdown" element={<Countdown />} />
      </Routes>
    </BrowserRouter>
  );
}