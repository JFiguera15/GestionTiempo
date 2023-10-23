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

function ListaEvaluados() {

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
        fetch("http://localhost:8000/colaboradores_evaluados")
            .then((res) => res.json())
            .then((data) => {
                const uniqueIds = [];
                const unique = data.filter(element => {
                    const isDuplicate = uniqueIds.includes(element.id);

                    if (!isDuplicate) {
                        uniqueIds.push(element.id);

                        return true;
                    }

                    return false;
                });
                setColaboradores(unique);
            });
    }, []);


    return (
        <div id="lista">
            <Navigation user={sessionStorage.getItem("rol")} />
            {colaboradores.length > 0 ? (
                <>
                    <Row className="mx-3">
                        <Col className="mb-3" sm={12} md={4}>
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
                            selectionMode="single" onRowSelect={(e) => navigate("/datos", { state: { email: e.data.id } })} style={{ border: "2px solid black" }}>
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="id" header="Correo" sortable />
                            <Column field="empresa" header="Empresa" sortable />
                            <Column field="cargo" header="Cargo" sortable />
                        </DataTable>
                    </Row>
                </>
            ) : (<h1>Actualmente no hay colaboradores evaluados</h1>)}
        </div>
    );
}

export default ListaEvaluados;