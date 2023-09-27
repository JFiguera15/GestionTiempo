import React, { useState, createContext } from "react";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';



function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const body = {
            id: email,
            password: password,
        }
        fetch("http://localhost:8000/login",
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            }).then((res) => res.json())
            .then((data) => {
                if (data === "Contraseña incorrecta") {
                    alert(data);
                } else if (data === "Usuario incorrecto"){
                    alert(data);
                } else if (data.length !== 0) {
                    sessionStorage.setItem("user", data[0].id);
                    sessionStorage.setItem("nivel", data[0].nivel);
                    navigate("/datos", {state: { email: email }});
                }
            });
    }

    return (
        <Container>
            <Col md>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Correo electronico"
                        className="mb-3"
                    >
                        <Form.Control type="email" placeholder="nombre@ejemplo.com" onChange={(e) => setEmail(e.target.value)} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="Contraseña">
                        <Form.Control type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </FloatingLabel>
                    <br />
                    <Button variant="primary" type="submit">
                        Enviar
                    </Button>
                </Form>
            </Col>
        </Container>


    );
}

export default Login;