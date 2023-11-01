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
import ResultadosEvaluacion from "./ResultadosEvaluacion";
import Navigation from "./Navigation";
import * as XLSX from 'xlsx/xlsx.mjs';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'


function DatosUsuario() {

    const [datos, setDatos] = useState({});
    const [departamentos, setDepartamentos] = useState([]);
    const [modificar, setModificar] = useState(true);
    const [evaluador, setEvaluador] = useState();
    const [reload, setReload] = useState(true);
    const [show, setShow] = useState(false);
    const [changeQuestion, setChangeQuestion] = useState(false);
    const [verEval, setVerEval] = useState(false);
    const [cambiarCon, setCambiarCon] = useState(false);
    const [highUsers, setHighUsers] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [evaluacion, setEvaluacion] = useState([]);
    const [view, setView] = useState(true);
    const handleClose = () => setShow(false);
    const location = useLocation();
    const navigate = useNavigate();

    function borrar() {
        fetch("http://localhost:8000/eliminar_colaborador",
            {
                method: "POST",
                body: datos.id,
                headers: { "Content-Type": "text/plain" }
            });
        handleClose();
        Swal.fire("Borrado con éxito.")
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

    function downloadCSV(data) {
        console.log(data);
        const headers = Object.keys(data[0]);
        const csvContent = "data:text/csv;charset=utf-8," + [["Fecha", "Tipo", "¿Aprobada?", "Razón"], ...data.map(obj => headers.map(key => obj[key]))].map(e => e.join(",")).join("\n");
        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "fechas_" + getUser().split("@")[0] + ".csv");
        document.body.appendChild(link);
        link.click();
    }

    function exportToExcel(data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, [
            ["Fecha", "Tipo", "¿Aprobada?", "Razón"]
        ], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, "fechas_" + getUser().split("@")[0] + ".xlsx");
    }


    function changeSecQuestion(q, a) {
        if (q && a) {
            fetch("http://localhost:8000/cambiar_respuesta_seguridad",
                {
                    method: "POST",
                    body: JSON.stringify({ pregunta: q, respuesta: a, id: datos.id }),
                    headers: { "Content-Type": "application/json" }
                }).then(window.location.reload());
        } else {
            Swal.fire("Escriba una respuesta válida");
        }

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
        fetch("http://localhost:8000/colaboradores_menos?id=" + getUser())
            .then((res) => res.json())
            .then((data) => {
                setHighUsers(data);
            });
        if (location.state?.email && (sessionStorage.getItem("rol") === "Administrador" || sessionStorage.getItem("user") === getUser())) {
            fetch("http://localhost:8000/evaluaciones_de?evaluado=" + getUser())
                .then((res) => res.json())
                .then((data) => { setEvaluacion(data) });
        } else if (location.state?.email) {
            fetch("http://localhost:8000/evaluado_por?evaluado=" + getUser() + "&evaluador=" + sessionStorage.getItem("user"))
                .then((res) => res.json())
                .then((data) => { setEvaluacion(data) });
        }

    }, [reload]);

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append("id", datos.id)
        const formJson = Object.fromEntries(formData.entries());
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
        if (newPassword === confirmPass) {
            fetch("http://localhost:8000/cambiar_password",
                {
                    method: "POST",
                    body: JSON.stringify({ password: newPassword, id: datos.id }),
                    headers: { "Content-Type": "application/json" }
                }).then(setCambiarCon(false)).then(Swal.fire("Contraseña cambiada con éxito"));
        } else Swal.fire("Las contraseñas no coinciden");
    }

    return (
        <div id="datos">
            <Navigation user={sessionStorage.getItem("rol")} />
            <Container fluid="md" style={{
                height: 100 + "%",
                backgroundColor: "#3258B6",
                paddingTop: 10 + "px",
                border: 5 + "px solid black",
            }}>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3" >
                        <InputGroup as={Col} controlId="formGridEmail">
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <FloatingLabel label="Correo">
                                <Form.Control defaultValue={datos.id} name="email" disabled />
                            </FloatingLabel>
                        </InputGroup>
                    </Row>
                    <Row>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridNombre">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Nombre">
                                    <Form.Control defaultValue={datos?.nombre} name="nombre" disabled={modificar} required />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridCedula">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Cedula de Identidad">
                                    <Form.Control defaultValue={datos.cedula} name="cedula" disabled={modificar} required />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridNacionalidad">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-flag-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Nacionalidad">
                                    <Form.Control defaultValue={datos.nacionalidad} name="nacionalidad" disabled={modificar} required />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridGenero">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-gender-ambiguous"></i></InputGroup.Text>
                                <FloatingLabel label="Genero">
                                    <Form.Control defaultValue={datos.genero} name="genero" disabled={modificar} required />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="mb-3" xs={12} sm={6}>
                            <InputGroup controlId="formGridTelefonoP">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Teléfono principal">
                                    <Form.Control defaultValue={datos.telefono_p} name="telefonoP" disabled={modificar} required />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col className="mb-3" xs={12} sm={6}>
                            <InputGroup controlId="formGridTelefonoS">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Teléfono Secundario">
                                    <Form.Control defaultValue={datos.telefono_s} name="telefonoS" disabled={modificar} />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="mb-3" xs={12} sm={6}>
                            <InputGroup controlId="formGridFechaN">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Fecha de Nacimiento">
                                    <Form.Control
                                        defaultValue={datos.fecha_nacimiento?.split("T")[0]}
                                        name="fechaN" disabled={modificar} type="date" />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col className="mb-3" xs={12} sm={6}>
                            <InputGroup controlId="formGridFechaI">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Fecha de Ingreso">
                                    <Form.Control
                                        defaultValue={datos.fecha_ingreso?.split("T")[0]}
                                        name="fechaI" disabled={modificar} type="date" />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <InputGroup as={Col} controlId="formGridDireccion">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-geo-alt-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Dirección">
                                <Form.Control defaultValue={datos.direccion} name="direccion" disabled={modificar} />
                            </FloatingLabel>
                        </InputGroup>
                    </Row>

                    <Row className="mb-3">
                        <InputGroup as={Col} controlId="formGridEmpresa">
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
                    </Row>
                    <Row>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridDepartamento">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-building"></i></InputGroup.Text>
                                <FloatingLabel label="Departamento">
                                    <Form.Select defaultValue={datos.departamento} name="departamento" disabled={modificar}>
                                        <option hidden>{datos.departamento}</option>
                                        {departamentos.map((item) =>
                                            <option>{item.nombre}</option>)}
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridCargo">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Cargo">
                                    <Form.Control defaultValue={datos.cargo} name="cargo" disabled={modificar} />
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridNivel">
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
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-3">
                            <InputGroup controlId="formGridHorario">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-check"></i></InputGroup.Text>
                                <FloatingLabel label="Tipo de horario">
                                    <Form.Select name="horario" defaultValue="" required disabled={modificar}>
                                        <option hidden>{datos.tipo_horario}</option>
                                        <option>5x2</option>
                                        <option>7x1</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col lg={4} md={12} className="mb-3">
                            <InputGroup controlId="formGridJefeD">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                                <FloatingLabel label="Jefe Directo">
                                    <Form.Select name="jefeD" required disabled={modificar}>
                                        <option hidden>{datos.jefe_directo}</option>
                                        {highUsers.map((item) =>
                                            <option value={item.id}>{item.nombre}</option>)}
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={4} md={12} className="mb-3">
                            <InputGroup controlId="formGridSupervisor">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                                <FloatingLabel label="Supervisor Funcional">
                                    <Form.Select name="supervisor" required disabled={modificar}>
                                        <option hidden>{datos.sup_funcional}</option>
                                        {highUsers.map((item) =>
                                            <option value={item.id}>{item.nombre}</option>)}
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                        <Col lg={4} md={12} className="mb-3">
                            <InputGroup controlId="formGridRol">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                                <FloatingLabel label="Rol">
                                    <Form.Select name="rol" required disabled={modificar}>
                                        <option hidden>{datos.rol}</option>
                                        <option>Administrador</option>
                                        <option>Usuario</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup className="mb-3">
                                {(datos.jefe_directo === sessionStorage.getItem("user") || datos.sup_funcional === sessionStorage.getItem("user"))
                                    && (datos.evaluando === "Activo")
                                    && !(evaluacion.some((e) => (new Date(e.fecha).getFullYear() === new Date().getFullYear() && e.evaluador === sessionStorage.getItem("user"))))
                                    && (
                                        <Button variant="primary" onClick={() => evaluar()} disabled={!modificar}>Evaluar</Button>
                                    )}
                                {(evaluacion.length > 0) && (
                                    <Button variant="primary" onClick={() => setVerEval(true)} disabled={!modificar}>Ver Evaluaciones</Button>
                                )}
                                {(sessionStorage.getItem("user") === datos.id) && (modificar) && (
                                    <>
                                        <Button variant="secondary" onClick={() => setCambiarCon(true)}>
                                            Cambiar Contraseña
                                        </Button>
                                        <Button variant="secondary" onClick={() => setChangeQuestion(true)}>
                                            Cambiar pregunta de seguridad
                                        </Button>
                                    </>
                                )}
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup className="mb-3">
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
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                Exportar datos de fechas
                                            </Dropdown.Toggle>
                                            <DropdownMenu>
                                                <Dropdown.Item onClick={() => {
                                                    const fechas = [];
                                                    fetch("http://localhost:8000/fechas?id=" + getUser())
                                                        .then((res) => res.json())
                                                        .then((data) => {
                                                            if (data.length === 0) {
                                                                Swal.fire("No hay datos referentes a este usuario.");
                                                                return;
                                                            }
                                                            data.forEach(element => {
                                                                fechas.push([new Date(element.fecha).toISOString().split('T')[0], element.tipo, element.aprobada, element.razon]);
                                                            });
                                                            downloadCSV(fechas);
                                                        });
                                                }}>CSV</Dropdown.Item>
                                                <Dropdown.Item onClick={() => {
                                                    const fechas = [];
                                                    fetch("http://localhost:8000/fechas?id=" + getUser())
                                                        .then((res) => res.json())
                                                        .then((data) => {
                                                            if (data.length === 0) {
                                                                Swal.fire("No hay datos referentes a este usuario.");
                                                                return;
                                                            }
                                                            data.forEach(element => {
                                                                fechas.push([new Date(element.fecha).toISOString().split('T')[0], element.tipo, element.aprobada, element.razon]);
                                                            });
                                                            exportToExcel(fechas);
                                                        });
                                                }}>Excel</Dropdown.Item>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </>
                                )}
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    show={verEval}
                    onHide={() => setVerEval(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Resultados evaluaciones de desempeño</Modal.Title>
                    </Modal.Header>

                    {evaluacion.length > 0 && (
                        <>
                            <FloatingLabel label="Evaluación de:">
                                <Form.Select name="evaluador"
                                    onChange={(e) => setEvaluador(e.target.value)} defaultValue={""}>
                                    <option value="" disabled hidden></option>
                                    {evaluacion.map((item, index) =>
                                        <option value={index}>{item.evaluador + " (" + item.fecha.split('T')[0] + ")"}</option>)}
                                    <option value={"general"}>Vista general</option>
                                </Form.Select>
                            </FloatingLabel>

                            {(evaluador && (evaluador !== "general")) && (
                                <ResultadosEvaluacion resultados={evaluacion[evaluador]} />
                            )}
                            {(evaluador && (evaluador === "general")) && (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Evaluado por:</th>
                                            <th>Fecha</th>
                                            <th>Puntuación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluacion.map((item) =>
                                            <tr>
                                                <td>{item.evaluador}</td>
                                                <td>{item.fecha.split("T")[0]}</td>
                                                <td>{item.resultados}%</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </>
                    )}
                    <Modal.Footer>
                        <Button onClick={() => setVerEval(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={(sessionStorage.getItem("user") === getUser() && !datos?.pregunta_seguridad)}>
                    <Modal.Header>
                        <Modal.Title>Seleccionar Pregunta de seguridad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label>Pregunta</Form.Label>
                        <Form.Select defaultValue={""} className="mb-1" id="pregunta_s">
                            <option>¿En qué ciudad se conocieron tus padres?</option>
                            <option>¿Cómo se llamaba tu mamá?</option>
                            <option>¿A qué secundaria fuiste?</option>
                        </Form.Select>
                        <Form.Label>Respuesta</Form.Label>
                        <Form.Control id="respuesta_s"></Form.Control>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => changeSecQuestion(document.getElementById("pregunta_s").value, document.getElementById("respuesta_s").value)}>Enviar</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={changeQuestion}>
                    <Modal.Header>
                        <Modal.Title>Cambiar Pregunta de seguridad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label>Pregunta</Form.Label>
                        <Form.Select defaultValue={""} className="mb-1" id="pregunta_s">
                            <option hidden>{datos?.pregunta_seguridad}</option>
                            <option>¿En qué ciudad se conocieron tus padres?</option>
                            <option>¿Cómo se llamaba tu mamá?</option>
                            <option>¿A qué secundaria fuiste?</option>
                        </Form.Select>
                        <Form.Label>Respuesta</Form.Label>
                        <Form.Control id="respuesta_s" defaultValue={datos?.respuesta_seguridad}></Form.Control>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => changeSecQuestion(document.getElementById("pregunta_s").value, document.getElementById("respuesta_s").value)}>Enviar</Button>
                        <Button variant="secondary" onClick={() => setChangeQuestion(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
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

                <Modal show={cambiarCon} onHide={() => setCambiarCon(false)}>
                    <Modal.Body>
                        <InputGroup as={Col} controlId="formGridNewPassword">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Contraseña nueva">
                                <Form.Control type={view ? "password" : "text"} name="newPassword"
                                    onChange={(e) => setNewPassword(e.target.value)} />
                            </FloatingLabel>
                            <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                        </InputGroup>
                        <InputGroup as={Col} controlId="formGridConfirmPassword">
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
        </div>
    );
}

export default DatosUsuario;