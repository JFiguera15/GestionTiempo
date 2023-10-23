import React from "react";
import Usuario from "./components/Usuario";
import Admin from "./components/Admin";
import Login from "./components/Login";
import DatosUsuario from "./components/DatosUsuario";
import ListaColaboradores from "./components/ListaColaboradores";
import ProtectedRoutes from "./ProtectedRoutes";
import AgregarUsuario from "./components/AgregarUsuario";
import Evaluacion from "./components/Evaluacion";
import AdminRoutes from "./AdminRoutes";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import ListaEvaluados from "./components/ListaEvaluados";
import EstadoEvaluacion from "./components/EstadoEvaluacion";


function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<AdminRoutes />}>
              <Route path="/agregar_usuario" element={<AgregarUsuario />} />
              <Route path="/lista_evaluados" element={<ListaEvaluados />} />
              <Route path="/estado_evaluacion" element={<EstadoEvaluacion />} />
            </Route>
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/datos" element={<DatosUsuario />} />
            <Route path="/lista" element={<ListaColaboradores />} />
            <Route path="/evaluacion" element={<Evaluacion />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App