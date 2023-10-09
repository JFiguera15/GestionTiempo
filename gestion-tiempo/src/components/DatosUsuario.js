import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';


function DatosUsuario() {

    const [datos, setDatos] = useState({});
    const [departamentos, setDepartamentos] = useState([]);
    const [modificar, setModificar] = useState(true);
    const [reload, setReload] = useState(true);
    const [show, setShow] = useState(false);
    const [borrado, setBorrado] = useState(false);
    const [cambiarCon, setCambiarCon] = useState(false);
    const [highUsers, setHighUsers] = useState([]);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [fueEvaluado, setFueEvaluado] = useState(0);
    const [view, setView] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const location = useLocation();
    const navigate = useNavigate();

    function borrar() {
        console.log(JSON.stringify(datos.id));
        fetch("http://localhost:8000/eliminar_colaborador",
            {
                method: "POST",
                body: datos.id,
                headers: { "Content-Type": "text/plain" }
            });
        handleClose();
        setBorrado(true);
    }

    function getUser() {
        if (location.state?.email) return location.state?.email;
        return sessionStorage.getItem("user");
    }

    function estaModificando() {
        setModificar(!modificar);
    }

    function evaluar() {
        navigate("/evaluacion", { state: { id: datos.id, nivel: datos.nivel } })
    }

    useEffect(() => {
        fetch("http://localhost:8000/datos_usuario?id=" + getUser())
            .then((res) => res.json())
            .then((data) => {
                setDatos(data[0]);
            });
        fetch("http://localhost:8000/departamentos")
            .then((res) => res.json())
            .then((data) => {
                setDepartamentos(data);
            });
        fetch("http://localhost:8000/colaboradoes_menos?id=" + getUser())
            .then((res) => res.json())
            .then((data) => {
                setHighUsers(data);
            });
        if (location.state?.email) {
            fetch("http://localhost:8000/evaluado_por?evaluado=" + getUser() + "&evaluador=" + sessionStorage.getItem("user"))
                .then((res) => res.json())
                .then((data) => setFueEvaluado(data.length));
        }

    }, [reload]);

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append("id", datos.id)
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        fetch("http://localhost:8000/actualizar_colaborador",
            {
                method: "POST",
                body: JSON.stringify(formJson),
                headers: { "Content-Type": "application/json" }
            }).then((res) => res.json());
        setReload(!reload);
        setModificar(!modificar);
    }

    function cambiarContrasena() {
        if (newPassword !== password) {
            if (newPassword === confirmPass) {
                fetch("http://localhost:8000/cambiar_password",
                    {
                        method: "POST",
                        body: JSON.stringify({ password: newPassword, id: datos.id }),
                        headers: { "Content-Type": "application/json" }
                    }).then(setCambiarCon(false));
            } else alert("Las contraseñas no coinciden");
        } else alert("La contraseña nueva no puede ser la misma que la contraseña vieja");
    }

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FloatingLabel label="Correo">
                            <Form.Control defaultValue={datos.id} name="email" disabled />
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                <Row fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridNombre">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Nombre">
                            <Form.Control defaultValue={datos?.nombre} name="nombre" disabled={modificar} required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridCedula">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Cedula de Identidad">
                            <Form.Control defaultValue={datos.cedula} name="cedula" disabled={modificar} required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridNacionalidad">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-flag-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Nacionalidad">
                            <Form.Control defaultValue={datos.nacionalidad} name="nacionalidad" disabled={modificar} required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridGenero">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-gender-ambiguous"></i></InputGroup.Text>
                        <FloatingLabel label="Genero">
                            <Form.Control defaultValue={datos.genero} name="genero" disabled={modificar} required />
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                <Row fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridTelefonoP">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Teléfono principal">
                            <Form.Control defaultValue={datos.telefono_p} name="telefonoP" disabled={modificar} required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridTelefonoS">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Teléfono Secundario">
                            <Form.Control defaultValue={datos.telefono_s} name="telefonoS" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                <Row fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridFechaN">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Fecha de Nacimiento">
                            <Form.Control
                                defaultValue={datos.fecha_nacimiento?.split("T")[0]}
                                name="fechaN" disabled={modificar} type="date" />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridFechaI">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Fecha de Ingreso">
                            <Form.Control
                                defaultValue={datos.fecha_ingreso?.split("T")[0]}
                                name="fechaI" disabled={modificar} type="date" />
                        </FloatingLabel>
                    </InputGroup>
                </Row>

                <InputGroup className="mb-3" as={Col} controlId="formGridDireccion">
                    <InputGroup.Text id="basic-addon1"><i className="bi bi-geo-alt-fill"></i></InputGroup.Text>
                    <FloatingLabel label="Dirección">
                        <Form.Control defaultValue={datos.direccion} name="direccion" disabled={modificar} />
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3" as={Col} controlId="formGridEmpresa">
                    <InputGroup.Text id="basic-addon1"><i className="bi bi-building-fill"></i></InputGroup.Text>
                    <FloatingLabel label="Empresa">
                        <Form.Select name="empresa" required disabled={modificar}>
                            <option hidden>{datos.empresa}</option>
                            <option>Cooserpoz</option>
                            <option>Dynaxtream</option>
                            <option>Entergix Facilities</option>
                            <option>Essential OFS, C.A.</option>
                            <option>Integra Well Services, C.A.</option>
                            <option>Kybaliontech</option>
                            <option>Neoconex Pro</option>
                            <option>Petroalianza, C.A.</option>
                            <option>Proilift Artificial Lift System</option>
                            <option>Sinoenergy Corporation</option>
                            <option>TecnoConsultores</option>
                            <option>Xenix Services</option>
                            <option>Xperts Energy</option>
                        </Form.Select>
                    </FloatingLabel>
                </InputGroup>

                <Row className="mb-3" fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridDepartamento">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-building"></i></InputGroup.Text>
                        <FloatingLabel label="Departamento">
                            <Form.Select defaultValue={datos.departamento} name="departamento" disabled={modificar}>
                                <option hidden>{datos.departamento}</option>
                                {departamentos.map((item) =>
                                    <option>{item.nombre}</option>)}
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridCargo">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Cargo">
                            <Form.Control defaultValue={datos.cargo} name="cargo" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridNivel">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Nivel">
                            <Form.Select name="nivel" required disabled={modificar}>
                                <option hidden>{datos.nivel}</option>
                                <option>Operativo</option>
                                <option>Estratégico</option>
                                <option>Táctico</option>
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridHorario">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-check"></i></InputGroup.Text>
                        <FloatingLabel label="Tipo de horario">
                            <Form.Select name="horario" defaultValue="" required disabled={modificar}>
                                <option hidden>{datos.tipo_horario}</option>
                                <option>5x2</option>
                                <option>7x1</option>
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                <Row fluid>
                    <InputGroup className="mb-3" as={Col} controlId="formGridJefeD">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                        <FloatingLabel label="Jefe Directo">
                            <Form.Select name="jefeD" required disabled={modificar}>
                                <option hidden>{datos.jefe_directo}</option>
                                {highUsers.map((item) =>
                                    <option value={item.id}>{item.nombre}</option>)}
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridSupervisor">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                        <FloatingLabel label="Supervisor Funcional">
                            <Form.Select name="supervisor" required disabled={modificar}>
                                <option hidden>{datos.sup_funcional}</option>
                                {highUsers.map((item) =>
                                    <option value={item.id}>{item.nombre}</option>)}
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                    {sessionStorage.getItem("rol") === "Administrador" && (
                        <InputGroup className="mb-3" as={Col} controlId="formGridRol">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                            <FloatingLabel label="Rol">
                                <Form.Select name="rol" required disabled={modificar}>
                                    <option hidden>{datos.rol}</option>
                                    <option>Administrador</option>
                                    <option>Usuario</option>
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                    )}
                </Row>
                <ButtonGroup>
                    {!modificar && (
                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    )}
                    {((sessionStorage.getItem("rol") === "Administrador")) && (
                        <>
                            <Button variant="primary" onClick={() => estaModificando()}>
                                {modificar ? "Modificar datos" : "Cancelar"}
                            </Button>
                            <Button variant="danger" onClick={() => setShow(true)} disabled={!modificar}>Eliminar</Button>

                        </>
                    )}
                    {(datos.jefe_directo === sessionStorage.getItem("user") || datos.sup_funcional === sessionStorage.getItem("user"))
                        && (!fueEvaluado) && (
                            <Button variant="primary" onClick={() => evaluar()} disabled={!modificar}>Evaluar</Button>
                        )}
                    {(sessionStorage.getItem("user") === datos.id) && (modificar) && (
                        <Button variant="secondary" onClick={() => setCambiarCon(true)}>
                            Cambiar Contraseña
                        </Button>
                    )}
                </ButtonGroup>
            </Form>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>¿Eliminar usuario?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    El usuario {datos.id} sera borrado de la base de datos.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => borrar()}>Eliminar</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={borrado} onHide={() => setBorrado(false)}>
                <Modal.Body>
                    <h2>Borrado con éxito</h2>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => navigate("/lista")}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={cambiarCon} onHide={() => setCambiarCon(false)}>
                <Modal.Body>
                    <InputGroup className="mb-3" as={Col} controlId="formGridNewPassword">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Contraseña nueva">
                            <Form.Control type={view ? "password" : "text"} name="newPassword"
                                onChange={(e) => setNewPassword(e.target.value)} />
                        </FloatingLabel>
                        <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridConfirmPassword">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Confirmar contraseña nueva">
                            <Form.Control type={view ? "password" : "text"} name="confirmPassword"
                                onChange={(e) => setConfirmPass(e.target.value)} />
                        </FloatingLabel>
                        <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => cambiarContrasena()} disabled={!confirmPass}>
                        Cambiar
                    </Button>
                    <Button variant="secondary" onClick={() => setCambiarCon(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default DatosUsuario;