import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from "primereact/api";
import Navigation from "./Navigation";

function ListaColaboradores() {

    const [colaboradores, setColaboradores] = useState([]);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    function iniciarProceso() {
        fetch("http://localhost:8000/iniciar_evaluacion", {
            method: "POST",
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
        if(sessionStorage.getItem("rol") === "Administrador") {
            fetch("http://localhost:8000/colaboradores")
            .then((res) => res.json())
            .then((data) => setColaboradores(data));
        } else {
            fetch("http://localhost:8000/colaboradores_revision?id=" + sessionStorage.getItem("user"))
            .then((res) => res.json())
            .then((data) => setColaboradores(data));
        }
    }, []);


    return (
        <div id="lista">
            <Navigation user={sessionStorage.getItem("rol")} />
            {colaboradores.length > 0 ? (
                <>
                    <Row className="mx-3">
                        <Col className="mb-3" sm={12} lg={4}>
                            <FloatingLabel label="Buscar:" style={{ maxWidth: 900 + "px" }}>
                                <Form.Control onChange={(e) =>
                                    setFilters({
                                        global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                                    })} className="sm"></Form.Control>
                            </FloatingLabel>
                        </Col>
                        {sessionStorage.getItem("rol") === "Administrador" && (
                            <>
                                <Col className="mb-3" sm={12} lg={4}>
                                    <Button onClick={() => navigate("/agregar_usuario")}>Agregar nuevo colaborador</Button>
                                </Col>
                                <Col className="mb-3" sm={12} lg={4}>
                                    {colaboradores[0].evaluando === "No" && (
                                        <Button onClick={() => setShow(true)}>Iniciar proceso de evaluación de desempeño</Button>
                                    )}
                                    {colaboradores[0].evaluando === "En proceso" && (
                                        <Button onClick={() => setShow(true)}>Terminar proceso de evaluación de desempeño</Button>
                                    )}
                                </Col>
                            </>
                        )}

                    </Row>
                    <Row style={{ marginTop: 25 + "px" }}>
                        <DataTable id="colaboradores" value={colaboradores} removableSort stripedRows filters={filters}
                            paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
                            selectionMode="single" onRowSelect={(e) => navigate("/datos", { state: { email: e.data.id } })}>
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="id" header="Correo" sortable />
                            <Column field="empresa" header="Empresa" sortable />
                            <Column field="cargo" header="Cargo" sortable />
                        </DataTable>
                    </Row>
                </>
            ) : (<h1>No hay colaboradores que usted pueda ver</h1>)}
            <Modal show={show} onHide={() => setShow(false)}>
                {colaboradores[0]?.evaluando === "No" && (
                    <>
                        <Modal.Header>
                            <Modal.Title>¿Iniciar proceso de evaluación de desempeño para todos los colaboradores?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button onClick={() => iniciarProceso()}>Iniciar</Button>
                            <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                        </Modal.Footer>
                    </>
                )}
                {colaboradores[0]?.evaluando === "En proceso" && (
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
        </div>
    );
}

export default ListaColaboradores;