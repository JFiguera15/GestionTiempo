import React, { useState, useEffect } from "react";
import Usuario from "./components/Usuario";
import Admin from "./components/Admin";
import { BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route index element={<Usuario />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App