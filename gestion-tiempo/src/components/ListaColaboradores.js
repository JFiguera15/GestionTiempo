import React, { useState, useEffect } from "react";
import "../App.css";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from "primereact/api";


function ListaColaboradores() {

    const [colaboradores, setColaboradores] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        fetch("http://localhost:8000/colaboradores")
            .then((res) => res.json())
            .then((data) => setColaboradores(data));
    }, []);


    return (
        <div>
            <FloatingLabel label="Buscar:">
                <Form.Control onChange={(e) => 
                setFilters({
                    global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS}
                })} className="sm"></Form.Control>
            </FloatingLabel>

            {colaboradores && (
                <>
                    <DataTable id="colaboradores" value={colaboradores} removableSort stripedRows filters={filters}
                    paginator rows={5} rowsPerPageOptions={[5,10,15]}
                    selectionMode="single" onRowSelect={(e) => navigate("/datos", { state: { email: e.data.id } })}>
                        <Column field="nombre" header="Nombre" sortable />
                        <Column field="id" header="Correo" sortable />
                        <Column field="empresa" header="Empresa" sortable />
                        <Column field="cargo" header="Cargo" sortable />
                    </DataTable>
                </>
            )}
        </div>
    );


}

export default ListaColaboradores;