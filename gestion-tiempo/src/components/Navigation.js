import "../App.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation({ user }) {
    if (user === "Administrador") {
        return (
            <Navbar expand="md" style={{
                backgroundColor: "#013466",
                marginBottom: 25 + "px",
                width: 100 + "%",
            }} >
                <Navbar.Brand href="/datos"><img src={require("./images//logo.png")} width="140" height="50"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: "#7ABEE7" }} />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/datos">Datos personales</Nav.Link>
                        <Nav.Link href="/lista">Lista de colaboradores</Nav.Link>
                        <NavDropdown title="Gestión de tiempo">
                            <NavDropdown.Item href="/usuario">Personal</NavDropdown.Item>
                            <NavDropdown.Item href="/admin">De otros colaboradores</NavDropdown.Item>
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
            }} >
                <Navbar.Brand href="/datos"><img src={require("./images//logo.png")} width="140" height="50"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: "#7ABEE7" }} />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/datos">Datos personales</Nav.Link>
                        <Nav.Link href="/lista">Lista de colaboradores</Nav.Link>
                        <NavDropdown title="Gestión de tiempo">
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