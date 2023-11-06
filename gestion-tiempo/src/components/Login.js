import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgot, setForgot] = useState(false);
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [verified, setVerified] = useState(false);
    const [view, setView] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    function forgotPass(id) {
        fetch("http://localhost:8000/pregunta_seguridad?id=" + id)
            .then((res) => res.json())
            .then((data) => {
                setPregunta(data[0]?.pregunta_seguridad);
                setRespuesta(data[0]?.respuesta_seguridad);
            });
    }

    function changePass(id, pass) {
        fetch("http://localhost:8000/cambiar_password",
            {
                method: "POST",
                body: JSON.stringify({ password: pass, id: id }),
                headers: { "Content-Type": "application/json" }
            }).then(setForgot(false)).then(Swal.fire("Contraseña cambiada con éxito")).then(setVerified(false));
    }

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
                console.log(data)
                if (data === "Contraseña incorrecta") {
                    Swal.fire(data);
                } else if (data === "Usuario incorrecto") {
                    Swal.fire(data);
                } else if (data === "Usuario no habilitado en sistema.") {
                    Swal.fire(data);
                } else if (data.length !== 0) {
                    sessionStorage.setItem("user", data[0].id);
                    sessionStorage.setItem("rol", data[0].rol);
                    navigate("/datos", { state: { email: email } });
                }
            });
    }

    return (
        <Container fluid="md" style={
            {
                marginTop: 15 + "%",
                backgroundColor: "#013466",
                padding: 25 + "px",
                border: 5 + "px solid black",
                borderRadius: 25 + "px"
            }}>
            <Row>
                <Col lg={6}>
                    <img src={require("./images//logo-2.png")} className="mb-3" style={{ width: 100 + "%", height: "auto" }} alt="Logo Integra WS"></img>
                </Col>
                <Col lg={6}>
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
                                <Form.Control type={view ? "password" : "text"} name="password" onChange={(e) => setPassword(e.target.value)} />
                            </FloatingLabel>
                            <Button variant="info" onClick={() => setView(!view)}>{view ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}</Button>
                        </InputGroup>
                        <ButtonGroup>
                            <Button variant="success" type="submit">
                                Iniciar Sesión
                            </Button>
                            <Button variant="secondary" onClick={() => setForgot(true)}>
                                Olvidé mi contraseña
                            </Button>
                        </ButtonGroup>
                    </Form>
                </Col>
            </Row>

            <Modal show={forgot} onHide={() => setForgot(false)}>
                <Modal.Header>
                    <Modal.Title>Recuperar contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <h4>Correo:</h4>
                        <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <FloatingLabel label="Correo">
                                <Form.Control type="email" id="recover_email" readOnly={pregunta} />
                            </FloatingLabel>
                        </InputGroup>
                    </>
                    {(!pregunta && !verified) && (
                        <Button onClick={() => forgotPass(document.getElementById("recover_email").value)}>Verificar</Button>
                    )}
                    {(pregunta && !verified) && (
                        <>
                            <h4>{pregunta}</h4>
                            <Form.Control id="response" className="mb-2"></Form.Control>
                            <Button onClick={() => {
                                if (document.getElementById("response").value === respuesta) {
                                    setVerified(true);
                                } else {
                                    Swal.fire("Respuesta incorrecta");
                                }
                            }}>Verificar</Button>
                        </>
                    )}
                    {verified && (
                        <>
                            <InputGroup as={Col} controlId="formGridNewPassword">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Contraseña nueva">
                                    <Form.Control type={view ? "password" : "text"} id="newPassword" />
                                </FloatingLabel>
                                <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                            </InputGroup>
                            <InputGroup as={Col} controlId="formGridConfirmPassword" className="mb-3">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Confirmar contraseña nueva">
                                    <Form.Control type={view ? "password" : "text"} id="confirmPassword" />
                                </FloatingLabel>
                                <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                            </InputGroup>
                            <Button onClick={() => {
                                if (document.getElementById("newPassword").value === document.getElementById("confirmPassword").value) {
                                    changePass(document.getElementById("recover_email").value, document.getElementById("newPassword").value)
                                } else {
                                    alert("Las contraseñas no coinciden.")
                                }
                            }
                            }>Cambiar contraseña</Button>
                        </>
                    )}

                </Modal.Body>
            </Modal>
        </Container >
    );
}

export default Login;