import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
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

    useEffect(() => {
        fetch("http://localhost:8000/colaboradores_evaluados_admin")
            .then((res) => res.json())
            .then((data) => {
                data.forEach(element => {
                    element.fecha = element.fecha.split('T')[0];
                });
                setColaboradores(data);
            });
    }, []);


    return (
        <div id="lista">
            <Navigation user={sessionStorage.getItem("rol")} />
            {colaboradores.length > 0 ? (
                <>
                    <Row className="mx-3">
                        <Col sm={12} md={4}>
                            <FloatingLabel label="Buscar:" style={{ maxWidth: 900 + "px" }}>
                                <Form.Control onChange={(e) =>
                                    setFilters({
                                        global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                                    })} className="sm"></Form.Control>
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 25 + "px" }}>
                        <DataTable id="colaboradores" value={colaboradores} removableSort stripedRows filters={filters}
                            paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
                            selectionMode="single" onRowSelect={(e) => navigate("/datos", { state: { email: e.data.id } })}
                            style={{ border: "2px solid black" }}>
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="id" header="Correo" sortable />
                            <Column field="empresa" header="Empresa" sortable />
                            <Column field="cargo" header="Cargo" sortable />
                            <Column field="evaluador" header="Evaluado por:" sortable />
                            <Column field="resultados" header="Puntuación (%)" sortable />
                            <Column field="fecha" header="Fecha de evaluación" sortable />
                        </DataTable>
                    </Row>
                </>
            ) : (<h1>Actualmente no hay colaboradores evaluados</h1>)}
        </div>
    );
}

export default ListaEvaluados;