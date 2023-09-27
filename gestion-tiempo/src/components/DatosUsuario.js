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
    const location = useLocation();

    function getUser(){
        if (location.state?.email) return location.state?.email;
        return sessionStorage.getItem("user");
    }

    useEffect(() => {
        fetch("http://localhost:8000/datos_usuario?id=" + getUser())
            .then((res) => res.json())
            .then((data) => {
                setDatos(data[0]);
            });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <Container>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <InputGroup className="mb-3" as={Col} controlId="formGridNombre">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Nombre">
                                    <Form.Control defaultValue={datos?.nombre} name="nombre" readOnly />
                                </FloatingLabel>
                            </InputGroup>
                            <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                <FloatingLabel label="Correo">
                                    <Form.Control defaultValue={datos.id} name="email" readOnly />
                                </FloatingLabel>
                            </InputGroup>

                            <InputGroup className="mb-3" as={Col} controlId="formGridNacionalidad">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-flag-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Nacionalidad">
                                    <Form.Control defaultValue={datos.nacionalidad} name="nacionalidad" readOnly />
                                </FloatingLabel>
                            </InputGroup>
                        </Row>

                        <Row>
                            <InputGroup className="mb-3" as={Col} controlId="formGridFechaN">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-event-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Fecha de Nacimiento">
                                    <Form.Control 
                                        defaultValue={new Date(datos.fecha_nacimiento)} name="nombre" readOnly />
                                </FloatingLabel>
                            </InputGroup>
                            <InputGroup className="mb-3" as={Col} controlId="formGridFechaI">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-event-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Fecha de Ingreso">
                                    <Form.Control 
                                        defaultValue={datos.fecha_ingreso} name="email" readOnly />
                                </FloatingLabel>
                            </InputGroup>
                        </Row>

                        <InputGroup className="mb-3" as={Col} controlId="formGridDireccion">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-geo-alt-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Dirección">
                                <Form.Control defaultValue={datos.direccion} name="direccion" readOnly />
                            </FloatingLabel>
                        </InputGroup>

                        <InputGroup className="mb-3" as={Col} controlId="formGridEmpresa">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-building-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Empresa">
                                <Form.Control defaultValue={datos.empresa} name="empresa" readOnly />
                            </FloatingLabel>
                        </InputGroup>

                        <Row className="mb-3">
                            <InputGroup className="mb-3" as={Col} controlId="formGridDepartamento">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-building"></i></InputGroup.Text>
                                <FloatingLabel label="Departamento">
                                    <Form.Select defaultValue={datos.departamento} name="departamento" readOnly>
                                        <option>{datos.departamento}</option>
                                        <option>...</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </InputGroup>

                            <InputGroup className="mb-3" as={Col} controlId="formGridCargo">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-person-badge-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Cargo">
                                    <Form.Control defaultValue={datos.cargo} name="cargo" readOnly />
                                </FloatingLabel>
                            </InputGroup>

                            <InputGroup className="mb-3" as={Col} controlId="formGridGenero">
                                <InputGroup.Text id="basic-addon1"><i class="bi bi-gender-ambiguous"></i></InputGroup.Text>
                                <FloatingLabel label="Genero">
                                    <Form.Control defaultValue={datos.genero} name="genero" readOnly />
                                </FloatingLabel>
                            </InputGroup>
                        </Row>

                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Form>
        </Container>
    );
}

export default DatosUsuario;