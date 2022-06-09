import { Login, Ec2Control } from "./pages";

import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./lib/Auth";

function App() {
  return (
    <div>
      <CssBaseline />
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ec2-control" element={<Ec2Control />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
