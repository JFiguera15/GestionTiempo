import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function EstadoEvaluacion() {

    const [estado, setEstado] = useState([]);
    const [show, setShow] = useState(false);
    const [limit, setLimit] = useState(false);

    function iniciarProceso() {
        fetch("http://localhost:8000/iniciar_evaluacion", {
            method: "POST",
            body: JSON.stringify({ fecha: limit ? document.getElementById("fecha").value : "2100-12-31" }),
            headers: { "Content-Type": "application/json" }
        }).then((res) => res.json());
        setShow(false);
        window.location.reload();
    }

    function terminarProceso() {
        fetch("http://localhost:8000/terminar_evaluacion", {
            method: "POST",
        }).then((res) => res.json());
        setShow(false);
        window.location.reload();
    }

    useEffect(() => {
        fetch("http://localhost:8000/estado_evaluacion")
            .then((res) => res.json())
            .then((data) => setEstado(data[0]));
    }, [])

    return (
        <>
            <Navigation user={sessionStorage.getItem("rol")} />
            {estado ? (
                <>
                    <Container fluid="md" style={
                        {
                            color: "white",
                            marginTop: 7 + "%",
                            backgroundColor: "#013466",
                            padding: 25 + "px",
                            border: 5 + "px solid black",
                            borderRadius: 25 + "px",
                            maxWidth: 700 + "px",
                        }}>
                        <h1>Actualmente el proceso de evaluación de desempeño está:</h1>
                        <h1>{estado.estado_evaluacion}</h1>
                        {estado.estado_evaluacion === "Inactivo" && (
                            <Button onClick={() => setShow(true)}>Iniciar proceso de evaluación de desempeño</Button>
                        )}
                        {estado.estado_evaluacion === "Activo" && (
                            <>
                                {estado.fin_evaluacion.split("T")[0] !== "2100-12-31" && (<h2>Fecha límite: {estado.fin_evaluacion.split("T")[0]}</h2>)}
                                <Button onClick={() => setShow(true)}>Terminar proceso de evaluación de desempeño</Button>
                            </>
                        )}
                    </Container>
                    <Modal show={show} onHide={() => setShow(false)}>
                        {estado.estado_evaluacion === "Inactivo" && (
                            <>
                                <Modal.Header>
                                    <Modal.Title>¿Iniciar proceso de evaluación de desempeño para todos los colaboradores?</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Check type="checkbox" label="¿Con límite de tiempo?" onChange={() => setLimit(!limit)}></Form.Check>
                                    {limit && (
                                        <>
                                            <Form.Control type="date" id="fecha"></Form.Control>
                                        </>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => iniciarProceso()}>Iniciar</Button>
                                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                                </Modal.Footer>
                            </>
                        )}
                        {estado.estado_evaluacion === "Activo" && (
                            <>
                                <Modal.Header>
                                    <Modal.Title>¿Terminar proceso de evaluación de desempeño para todos los colaboradores?</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button onClick={() => terminarProceso()}>Terminar</Button>
                                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal>
                </>
            ) : (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>)}


        </>
    )
}



export default EstadoEvaluacion;