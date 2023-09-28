import React from "react";
import Usuario from "./components/Usuario";
import Admin from "./components/Admin";
import Login from "./components/Login";
import DatosUsuario from "./components/DatosUsuario";
import ListaColaboradores from "./components/ListaColaboradores";
import ProtectedRoutes from "./ProtectedRoutes";
import AgregarUsuario from "./components/AgregarUsuario";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


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
          <li>
            <nav><NavLink to="/datos">Datos</NavLink></nav>
          </li>
          <li>
            <nav><NavLink to="/lista">Lista</NavLink></nav>
          </li>
          <li>
            <nav><NavLink to="/login">Login</NavLink></nav>
          </li>

        </ul>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/datos" element={<DatosUsuario />} />
            <Route path="/lista" element={<ListaColaboradores />} />
            <Route path="/agregar_usuario" element={<AgregarUsuario />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App