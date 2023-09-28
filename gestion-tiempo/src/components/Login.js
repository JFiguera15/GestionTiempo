import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState(true);
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
                } else if (data === "Usuario incorrecto") {
                    alert(data);
                } else if (data.length !== 0) {
                    sessionStorage.setItem("user", data[0].id);
                    sessionStorage.setItem("nivel", data[0].nivel);
                    navigate("/datos", { state: { email: email } });
                }
            });
    }

    return (
        <Container>
            <Col>
                <Form onSubmit={handleSubmit}>
                    <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FloatingLabel label="Correo">
                            <Form.Control type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridPassword">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Contraseña">
                            <Form.Control type= {view ? "password" : "text" }  name="password" onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>
                        <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                    </InputGroup>
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