import { useEffect, useState } from "react";
import "../App.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation({ user }) {
    const [porAprobar, setPorAprobar] = useState(0);
    const [porEvaluar, setPorEvaluar] = useState(false);

    useEffect(() => {
        if(user === "Administrador") {
            fetch("http://localhost:8000/colaboradores_por_aprobar_admin")
            .then((res) => res.json())
            .then((data) => {
                setPorAprobar(Object.values(data[0])[0]);
                console.log(Object.values(data[0])[0]);
            });
        } else {
            fetch("http://localhost:8000/colaboradores_por_aprobar?id=" + sessionStorage.getItem("user"))
            .then((res) => res.json())
            .then((data) => {
                setPorAprobar(Object.values(data[0])[0]);
                console.log(Object.values(data[0])[0]);
            });
        }
        
    }, [])

    if (user === "Administrador") {
        return (
            <Navbar expand="md" style={{
                backgroundColor: "#013466",
                marginBottom: 25 + "px",
                width: 100 + "%",
                WebkitBoxShadow: "0px 4px 5px 0px rgba(0,0,0,0.75)",
                boxShadow : "0px 4px 5px 0px rgba(0,0,0,0.75)"
            }} >
                <Navbar.Brand href="/datos"><img src={require("./images//logo.png")} 
                width="140" height="50"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: "#7ABEE7" }} />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/datos">Datos personales</Nav.Link>
                        <NavDropdown title="Colaboradores">
                            <NavDropdown.Item href="/lista">Lista de colaboradores</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/agregar_usuario">Agregar colaborador nuevo</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title= {porAprobar ? ("Gestión de tiempo (" + porAprobar + ")") : "Gestión de tiempo"}>
                            <NavDropdown.Item href="/usuario">Personal</NavDropdown.Item>
                            <NavDropdown.Item href="/admin">De otros colaboradores</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Desempeño">
                            <NavDropdown.Item href="/lista_evaluados">Lista de colaboradores evaluados</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/estado_evaluacion">Estado de evaluacion</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/login">Salir</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    else {
        return (
            <Navbar expand="md" className="px-3" style={{
                backgroundColor: "#013466",
                marginBottom: 25 + "px",
                width: 100 + "%",
                WebkitBoxShadow: "0px 4px 5px 0px rgba(0,0,0,0.75)",
                boxShadow : "0px 4px 5px 0px rgba(0,0,0,0.75)"
            }} >
                <Navbar.Brand href="/datos"><img src={require("./images//logo.png")} width="140" height="50"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: "#7ABEE7" }} />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/datos">Datos personales</Nav.Link>
                        <NavDropdown title="Colaboradores">
                            <NavDropdown.Item href="/lista">Lista de colaboradores</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown NavDropdown title= {porAprobar ? ("Gestión de tiempo (" + porAprobar + ")") : "Gestión de tiempo"}>
                            <NavDropdown.Item href="/usuario">Personal</NavDropdown.Item>
                            <NavDropdown.Item href="/admin">De otros colaboradores</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/login" className="justify-content-end">Salir</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation;