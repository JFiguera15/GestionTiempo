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
    const [modificar, setModificar] = useState(true);
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
    });

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <InputGroup className="mb-3" as={Col} controlId="formGridNombre">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Nombre">
                            <Form.Control defaultValue={datos?.nombre} name="nombre" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FloatingLabel label="Correo">
                            <Form.Control defaultValue={datos.id} name="email" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridNacionalidad">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-flag-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Nacionalidad">
                            <Form.Control defaultValue={datos.nacionalidad} name="nacionalidad" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>
                </Row>

                <Row>
                    <InputGroup className="mb-3" as={Col} controlId="formGridFechaN">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Fecha de Nacimiento">
                            <Form.Control
                                defaultValue={new Date(datos.fecha_nacimiento).toLocaleDateString("sv")} name="fechaN" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridFechaI">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Fecha de Ingreso">
                            <Form.Control
                                defaultValue={datos.fecha_ingreso} name="fechaI" disabled={modificar} />
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
                        <Form.Control defaultValue={datos.empresa} name="empresa" disabled={modificar} />
                    </FloatingLabel>
                </InputGroup>

                <Row className="mb-3">
                    <InputGroup className="mb-3" as={Col} controlId="formGridDepartamento">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-building"></i></InputGroup.Text>
                        <FloatingLabel label="Departamento">
                            <Form.Select defaultValue={datos.departamento} name="departamento" disabled={modificar}>
                                <option>{datos.departamento}</option>
                                <option>...</option>
                            </Form.Select>
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridCargo">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Cargo">
                            <Form.Control defaultValue={datos.cargo} name="cargo" disabled={modificar} />
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridGenero">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-gender-ambiguous"></i></InputGroup.Text>
                        <FloatingLabel label="Genero">
                            <Form.Control defaultValue={datos.genero} name="genero" disabled={modificar} />
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
                        Cambiar
                    </Button>
                )}

            </Form>
        </Container>
    );
}

export default DatosUsuario;