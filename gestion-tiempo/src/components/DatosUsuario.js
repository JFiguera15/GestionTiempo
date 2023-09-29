import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useLocation } from 'react-router-dom';


function DatosUsuario() {

    const [datos, setDatos] = useState({});
    const [departamentos, setDepartamentos] = useState([]);
    const [modificar, setModificar] = useState(true);
    const [reload, setReload] = useState(true);
    const location = useLocation();

    function getUser() {
        if (location.state?.email) return location.state?.email;
        return sessionStorage.getItem("user");
    }

    function estaModificando() {
        setModificar(!modificar);
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

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FloatingLabel label="Correo">
                            <Form.Control defaultValue={datos.id} name="email" disabled />
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                <Row>
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

                <Row>
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

                <Row className="mb-3">
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
                                <option>Administrativo</option>
                                <option>Estratégico</option>
                                <option>Táctico</option>
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridHorario">
                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-check"></i></InputGroup.Text>
                        <FloatingLabel label="Tipo de horario">
                            <Form.Select name="horario" required disabled={modificar}>
                                <option hidden>{datos.tipo_horario}</option>
                                <option>5x2</option>
                                <option>7x1</option>
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>
                </Row>
                {!modificar && (
                    <Button variant="primary" type="submit">
                        Enviar
                    </Button>
                )}
                {sessionStorage.getItem("user") === datos?.id && (
                    <Button variant="primary" onClick={() => estaModificando()}>
                        Modificar datos
                    </Button>
                )}

            </Form>
        </Container>
    );
}

export default DatosUsuario;