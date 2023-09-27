import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';


function DatosUsuario() {

    const [datos, setDatos] = useState({});

    useEffect(() => {
        fetch("http://localhost:8000/datos_usuario?id=" + sessionStorage.getItem("user"))
            .then((res) => res.json())
            .then((data) => {
                setDatos(data[0]);
            });
    }, []);

    return (
        
        <Container>
            {datos && (
                <h1>{datos.nombre}</h1>
            )}
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" defaultValue={datos.id} disabled/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNacionalidad">
                        <Form.Label>Nacionalidad</Form.Label>
                        <Form.Control defaultValue={datos.nacionalidad}/>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridDireccion">
                    <Form.Label>Address</Form.Label>
                    <Form.Control placeholder="1234 Main St" defaultValue={datos.direccion} disabled/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridEmpresa">
                    <Form.Label>Empresa</Form.Label>
                    <Form.Control defaultValue={datos.empresa}/>
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridDepartamento">
                        <Form.Label>Departamento</Form.Label>
                        <Form.Select defaultValue={datos.departamento} disabled>
                            <option>{datos.departamento}</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCargo">
                        <Form.Label>Cargo</Form.Label>
                        <Form.Control defaultValue={datos.cargo}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridGenero">
                        <Form.Label>Genero</Form.Label>
                        <Form.Control defaultValue={datos.genero}/>
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default DatosUsuario;