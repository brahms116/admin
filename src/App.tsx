import { Login, Ec2Control } from "./pages";
import create from "zustand";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ec2-control" element={<Ec2Control />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
