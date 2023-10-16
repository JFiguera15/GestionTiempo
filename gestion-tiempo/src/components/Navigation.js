import "../App.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation({ user }) {
    if (user === "Administrador") {
        return (
            <Navbar style={{
                backgroundColor: "#013466",
                marginBottom: 25 + "px",
                width: 100 + "%",
            }}>
                <Nav>
                    <img src={require("./images//logo.png")}  width="140" height="50"></img>
                    <Nav.Link href="/usuario">Usuario</Nav.Link>
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    <Nav.Link href="/datos">Datos</Nav.Link>
                    <Nav.Link href="/lista">Lista</Nav.Link>
                    <Nav.Link href="/agregar_usuario">Agregar</Nav.Link>
                    <Nav.Link href="/login">Salir</Nav.Link>
                </Nav>
            </Navbar>
        )
    }
    else {
        return (
            <Navbar>
                <Nav>
                    <Nav.Link href="/usuario">Usuario</Nav.Link>
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    <Nav.Link href="/datos">Datos</Nav.Link>
                    <Nav.Link href="/lista">Lista</Nav.Link>
                    <Nav.Link href="/login">Salir</Nav.Link>
                </Nav>
            </Navbar>
        )
    }
}

export default Navigation;