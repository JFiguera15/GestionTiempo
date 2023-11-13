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
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx/xlsx.mjs';

function ListaColaboradores() {

    const [colaboradores, setColaboradores] = useState([]);
    const [viewEval, setViewEval] = useState(false);
    const [viewActive, setViewActive] = useState(false);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    function downloadCSV(data) {
        console.log(data);
        const headers = Object.keys(data[0]);
        const csvContent = "data:text/csv;charset=utf-8," + [["Id", "Nombre", "Empresa", "Nivel", "Tipo de horario", "Nacionalidad",
            "Teléfono primario", "Teléfono secundario", "Dirección", "Departamento",
            "Cargo", "Cédula", "Género", "Fecha de nacimiento",
            "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional", "¿Activo?"], ...data.map(obj => headers.map(key => obj[key]))].map(e => e.join(",")).join("\n");
        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "colaboradores.csv");
        document.body.appendChild(link);
        link.click();
    }

    function exportToPdf(data) {
        const doc = new jsPDF("l");
        const tableColumn = Object.keys(data[0]);
        const tableRows = [];

        data.forEach((item) => {
            const row = [];

            tableColumn.forEach((column) => {
                row.push(item[column].toString());
            });

            tableRows.push(row);
        });

        doc.autoTable({
            head: [["Id", "Nombre", "Empresa", "Nivel", "Tipo de horario", "Nacionalidad",
                "Teléfono primario", "Teléfono secundario", "Dirección", "Departamento",
                "Cargo", "Cédula", "Género", "Fecha de nacimiento",
                "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional", "¿Activo?"]],
            body: tableRows,
            // split overflowing columns into pages
            horizontalPageBreak: true,
            tableWidth: 'wrap',
        });

        doc.save("colaboradores.pdf");
    }

    function exportToExcel(data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, [
            ["Id", "Nombre", "Empresa", "Nivel", "Tipo de horario", "Nacionalidad",
                "Teléfono primario", "Teléfono secundario", "Dirección", "Departamento",
                "Cargo", "Cédula", "Género", "Fecha de nacimiento",
                "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional", "¿Activo?"]
        ], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'colaboradores.xlsx');
    }


    useEffect(() => {
        if (sessionStorage.getItem("rol") === "Administrador") {
            if (viewActive) {
                fetch("http://localhost:8000/colaboradores_activos")
                    .then((res) => res.json())
                    .then((data) => {
                        data.forEach(element => {
                            element.fecha_ingreso = element.fecha_ingreso.split('T')[0];
                            element.fecha_nacimiento = element.fecha_nacimiento.split('T')[0];
                        });
                        setColaboradores(data)
                    });
            } else {
                fetch("http://localhost:8000/colaboradores")
                    .then((res) => res.json())
                    .then((data) => {
                        data.forEach(element => {
                            element.fecha_ingreso = element.fecha_ingreso.split('T')[0];
                            element.fecha_nacimiento = element.fecha_nacimiento.split('T')[0];
                        });
                        setColaboradores(data)
                    });
            }
        } else {
            if (viewEval) {
                fetch("http://localhost:8000/colaboradores_evaluados_por?id=" + sessionStorage.getItem("user"))
                    .then((res) => res.json())
                    .then((data) => {
                        setColaboradores(data)
                    });
            }
            else {
                fetch("http://localhost:8000/colaboradores_revision?id=" + sessionStorage.getItem("user"))
                    .then((res) => res.json())
                    .then((data) => {
                        setColaboradores(data)
                    });
            }

        }
    }, [viewEval, viewActive]);

    return (
        <div id="lista">
            <Navigation user={sessionStorage.getItem("rol")} />
            <Row className="mx-3">
                <Col sm={12} md={4}>
                    <FloatingLabel label="Buscar:" style={{ maxWidth: 900 + "px" }}>
                        <Form.Control onChange={(e) =>
                            setFilters({
                                global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                            })} className="sm" style={{ border: "1px solid black" }}></Form.Control>
                    </FloatingLabel>
                </Col>
                {sessionStorage.getItem("rol") === "Administrador" && (
                    <>
                        <Col sm={12} md={4}>
                            <Form.Check inline reverse type="switch" label="Mostrar solo colaboradores activos" style={{ fontWeight: "bolder" }} onChange={() => setViewActive(!viewActive)} />
                        </Col>
                        <Col sm={12} md={4}>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Exportar datos
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => downloadCSV(colaboradores)}>CSV</Dropdown.Item>
                                    <Dropdown.Item onClick={() => exportToExcel(colaboradores)}>Excel</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </>
                )}
                {sessionStorage.getItem("rol") === "Usuario" && (
                    <>
                        <Col>
                            <Form.Check inline reverse type="switch" label="Mostrar solo colaboradores sin evaluar" style={{ fontWeight: "bolder" }} onChange={() => setViewEval(!viewEval)} />
                        </Col>
                    </>
                )}
            </Row>
            {colaboradores.length > 0 ? (
                <>
                    <Row style={{ marginTop: 25 + "px" }}>
                        <DataTable id="colaboradores" value={colaboradores} sortField="nombre" sortOrder={1} removableSort stripedRows filters={filters}
                            paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
                            selectionMode="single" onRowSelect={(e) => navigate("/datos", { state: { email: e.data.id } })} style={{ border: "2px solid black" }}>
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="id" header="Correo" sortable />
                            <Column field="empresa" header="Empresa" sortable />
                            <Column field="cargo" header="Cargo" sortable />
                            {sessionStorage.getItem("rol") === "Administrador" ? <Column field="activo" header="¿Activo?" sortable /> : ""}
                        </DataTable>
                    </Row>
                </>
            ) : (<h1 className="mt-3">No hay colaboradores que usted pueda ver</h1>)}
        </div>
    );
}

export default ListaColaboradores;