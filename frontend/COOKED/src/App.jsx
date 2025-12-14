import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import AfterLogin from "./pages/AfterLogin";
import Dashboard from "./pages/Dashboard";
import Roast from "./pages/Roast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/after-login" element={<AfterLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roast" element={<Roast />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
