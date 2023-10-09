import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from 'react-router-dom';

function AgregarUsuario() {

    const [datos, setDatos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [modificar, setModificar] = useState(true);
    const [view, setView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [highUsers, setHighUsers] = useState([]);
    const [confirmar, setConfirmar] = useState(false);
    const navigate = useNavigate();

    function estaModificando() {
        setModificar(!modificar);
    }

    useEffect(() => {
        fetch("http://localhost:8000/departamentos")
            .then((res) => res.json())
            .then((data) => {
                setDepartamentos(data);
            });
        fetch("http://localhost:8000/correos")
            .then((res) => res.json())
            .then((data) => {
                setDatos(data);
            });
        fetch("http://localhost:8000/colaboradores_nombre_correo")
            .then((res) => res.json())
            .then((data) => {
                setHighUsers(data);
            });
    }, []);

    function check() {
        if (datos?.some((e) => e.id === email)) {
            alert("Ya existe usuario con este correo.");
            return;
        }
        else if (password === confirmPass) {
            setConfirmar(true);
            return;
        } else {
            alert("Las contraseñas no son iguales");
            return;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append("id", email);
        formData.append("password", password);
        formData.append("evaluando", "");
        const formJson = Object.fromEntries(formData.entries());
        fetch("http://localhost:8000/agregar_colaborador",
            {
                method: "POST",
                body: JSON.stringify(formJson),
                headers: { "Content-Type": "application/json" }
            }).then((res) => res.json());
        navigate("/datos", { state: { email: email } });
    }

    return (
        <Container>
            {!confirmar && datos && (
                <Col>
                    <InputGroup className="mb-3" as={Col} controlId="formGridEmail">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FloatingLabel label="Correo">
                            <Form.Control type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridPassword">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Contraseña">
                            <Form.Control type={view ? "password" : "text"} name="password"
                                onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>
                        <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                    </InputGroup>
                    <InputGroup className="mb-3" as={Col} controlId="formGridConfirmPassword">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Confirmar contraseña">
                            <Form.Control type={view ? "password" : "text"} name="confirmPassword"
                                onChange={(e) => setConfirmPass(e.target.value)} />
                        </FloatingLabel>
                        <Button variant="info" onClick={() => setView(!view)}><i class="bi bi-eye"></i></Button>
                    </InputGroup>
                    <Button onClick={() => check()}>{loading ? "Cargando..." : "Enviar"}</Button>
                </Col>

            )}
            {confirmar && (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <InputGroup className="mb-3" as={Col} controlId="formGridNombre">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Nombre">
                                <Form.Control name="nombre" required />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridCedula">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-person-vcard-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Cedula de identidad">
                                <Form.Control name="cedula" required />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridNacionalidad">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-flag-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Nacionalidad">
                                <Form.Control name="nacionalidad" required />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridGenero">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-gender-ambiguous"></i></InputGroup.Text>
                            <FloatingLabel label="Genero">
                                <Form.Control name="genero" required />
                            </FloatingLabel>
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mb-3" as={Col} controlId="formGridTelefonoP">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Teléfono principal">
                                <Form.Control name="telefonoP" required />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridTelefonoS">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-telephone-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Teléfono Secundario">
                                <Form.Control name="telefonoS" />
                            </FloatingLabel>
                        </InputGroup>
                    </Row>

                    <Row>
                        <InputGroup className="mb-3" as={Col} controlId="formGridFechaN">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Fecha de Nacimiento">
                                <Form.Control name="fechaN" type="date" required />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridFechaI">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-calendar-event-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Fecha de Ingreso" >
                                <Form.Control name="fechaI" type="date" required />
                            </FloatingLabel>
                        </InputGroup>
                    </Row>

                    <InputGroup className="mb-3" as={Col} controlId="formGridDireccion">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-geo-alt-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Dirección">
                            <Form.Control name="direccion" />
                        </FloatingLabel>
                    </InputGroup>

                    <InputGroup className="mb-3" as={Col} controlId="formGridEmpresa">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-building-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Empresa">
                            <Form.Select name="empresa" defaultValue="" required>
                                <option value={""} disabled hidden></option>
                                <option>Cooserpoz</option>
                                <option>Dynaxtream</option>
                                <option>Entergix Facilities</option>
                                <option>Essential OFS, C.A</option>
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
                                <Form.Select name="departamento" defaultValue="" required>
                                    <option value={""} disabled hidden></option>
                                    {departamentos.map((item) =>
                                        <option>{item.nombre}</option>)}
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>

                        <InputGroup className="mb-3" as={Col} controlId="formGridCargo">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Cargo" required>
                                <Form.Control name="cargo" />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridNivel">
                            <InputGroup.Text id="basic-addon1"><i className="bi bi-person-badge-fill"></i></InputGroup.Text>
                            <FloatingLabel label="Nivel">
                                <Form.Select name="nivel" defaultValue="" required>
                                    <option value={""} disabled hidden></option>
                                    <option>Operativo</option>
                                    <option>Estratégico</option>
                                    <option>Táctico</option>
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridHorario">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-check"></i></InputGroup.Text>
                            <FloatingLabel label="Tipo de horario">
                                <Form.Select name="horario" defaultValue="" required>
                                    <option value={""} disabled hidden></option>
                                    <option>5x2</option>
                                    <option>7x1</option>
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mb-3" as={Col} controlId="formGridJefeD">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                            <FloatingLabel label="Jefe Directo">
                                <Form.Select name="jefeD" defaultValue="" required>
                                    <option value="" disabled hidden></option>
                                    {highUsers.map((item) =>
                                        <option value={item.id}>{item.nombre}</option>)}
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridSupervisor">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                            <FloatingLabel label="Supervisor Funcional">
                                <Form.Select name="supervisor" defaultValue="" required>
                                    <option value="" disabled hidden></option>
                                    {highUsers.map((item) =>
                                        <option value={item.id}>{item.nombre}</option>)}
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup className="mb-3" as={Col} controlId="formGridRol">
                            <InputGroup.Text id="basic-addon1"><i class="bi bi-person-fill-up"></i></InputGroup.Text>
                            <FloatingLabel label="Rol">
                                <Form.Select name="rol" defaultValue="" required>
                                    <option value="" disabled hidden></option>
                                    <option>Administrador</option>
                                    <option>Usuario</option>
                                </Form.Select>
                            </FloatingLabel>
                        </InputGroup>
                    </Row>

                    <Button variant="primary" type="submit">
                        Enviar
                    </Button>
                    {sessionStorage.getItem("user") === datos?.id && (
                        <Button variant="primary" onClick={() => estaModificando()}>
                            Cambiar
                        </Button>
                    )}

                </Form>
            )}
        </Container>
    );
}

export default AgregarUsuario;