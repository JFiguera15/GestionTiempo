import React from "react";
import Usuario from "./components/Usuario";
import Admin from "./components/Admin";
import Login from "./components/Login";
import DatosUsuario from "./components/DatosUsuario";
import ListaColaboradores from "./components/ListaColaboradores";
import ProtectedRoutes from "./ProtectedRoutes";
import AgregarUsuario from "./components/AgregarUsuario";
import Evaluacion from "./components/Evaluacion";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
        


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar>
        <Nav>
          <Nav.Link href="/usuario">Usuario</Nav.Link>
          <Nav.Link href="/admin">Admin</Nav.Link>
          <Nav.Link href="/datos">Datos</Nav.Link>
          <Nav.Link href="/lista">Lista</Nav.Link>
          <Nav.Link href="/agregar_usuario">Agregar</Nav.Link>
          <Nav.Link href="/evaluacion">Evaluacion</Nav.Link>
          <Nav.Link href="/login">Salir</Nav.Link>
        </Nav>
      </Navbar>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/datos" element={<DatosUsuario />} />
            <Route path="/lista" element={<ListaColaboradores />} />
            <Route path="/agregar_usuario" element={<AgregarUsuario />} />
            <Route path="/evaluacion" element={<Evaluacion />}/>
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App