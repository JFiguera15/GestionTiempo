import React  from "react";
import Usuario from "./components/Usuario";
import Admin from "./components/Admin";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ul className="navbar">
        <li>
        <nav><NavLink to="/usuario">Usuario</NavLink></nav>
        </li>
        <li>
        <nav><NavLink to="/admin">Admin</NavLink></nav>
        </li>
      </ul>
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