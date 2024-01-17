import React, { useState, useEffect } from "react";
import "../App.css";
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
    const [year, setYear] = useState(new Date().getFullYear());
    const [evaluatedYears, setEvaluatedYears] = useState([]);
    const [numeroColaboradores, setNumeroColaboradores] = useState(0);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        fetch("http://localhost:8000/colaboradores_evaluados_admin?year=" + year)
            .then((res) => res.json())
            .then((data) => {
                data.forEach(element => {
                    element.fecha = element.fecha.split('T')[0];
                });
                setColaboradores(data);
            });

        fetch("http://localhost:8000/anios_evaluados")
            .then((res) => res.json())
            .then((data) => {
                let years = []
                data.forEach(element => {
                    years.push(Object.values(element)[0])
                });
                years = [...new Set(years)];
                setEvaluatedYears(years);
            });

        fetch("http://localhost:8000/numero_colaboradores")
            .then((res) => res.json())
            .then((data) => {
                setNumeroColaboradores(Object.values(data[0])[0]);
            });
    }, [year]);

    const rowClass = (colaboradores) => {
        return {
            'puntos-100': colaboradores.resultados > 90,
            'puntos-75': colaboradores.resultados <= 90,
            'puntos-50': colaboradores.resultados <= 50,
            'puntos-25': colaboradores.resultados <= 25
        };
    };

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
                        <Col sm={12} md={4}>
                            <FloatingLabel label="Seleccionar año:" style={{ maxWidth: 900 + "px" }}>
                                <Form.Select className="sm" defaultValue={year} onChange={(e) => setYear(e.target.value)}>
                                    <option hidden defaultValue={year}>{year}</option>
                                    {evaluatedYears.map((item, index) =>
                                        <option key={index}>{item}</option>)}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <h5>Evaluaciones realizadas: {colaboradores.length} de {numeroColaboradores * 2}</h5>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 25 + "px" }}>
                        <DataTable id="colaboradores" value={colaboradores} sortField="nombre" sortOrder={1} removableSort stripedRows filters={filters}
                            paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
                            rowClassName={rowClass}
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