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
            "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional"], ...data.map(obj => headers.map(key => obj[key]))].map(e => e.join(",")).join("\n");
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
                "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional"]],
            body: tableRows,
            // split overflowing columns into pages
            horizontalPageBreak: true,
            tableWidth: 'wrap',
            styles: { cellPadding: 0.5, fontSize: 8 },
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
                "Fecha de ingreso", "Jefe Directo", "Supervisor Funcional"]
        ], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'colaboradores.xlsx');
    }


    useEffect(() => {
        if (sessionStorage.getItem("rol") === "Administrador") {
            fetch("http://localhost:8000/colaboradores")
                .then((res) => res.json())
                .then((data) => { 
                    data.forEach(element => {
                        element.fecha_ingreso = element.fecha_ingreso.split('T')[0];
                        element.fecha_nacimiento = element.fecha_nacimiento.split('T')[0];
                    });
                    setColaboradores(data) });
        } else {
            fetch("http://localhost:8000/colaboradores_revision?id=" + sessionStorage.getItem("user"))
                .then((res) => res.json())
                .then((data) => { setColaboradores(data) });
        }
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
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Exportar datos
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => downloadCSV(colaboradores)}>CSV</Dropdown.Item>
                                    <Dropdown.Item onClick={() => exportToExcel(colaboradores)}>Excel</Dropdown.Item>
                                    <Dropdown.Item onClick={() => exportToPdf(colaboradores)}>PDF</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
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
            ) : (<h1>No hay colaboradores que usted pueda ver</h1>)}
        </div>
    );
}

export default ListaColaboradores;