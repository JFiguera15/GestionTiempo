import React, { useState, useEffect } from "react";
import "../App.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';


function ListaColaboradores() {

    const [colaboradores, setColaboradores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/colaboradores")
            .then((res) => res.json())
            .then((data) => setColaboradores(data));
    }, []);


    return (
        <div>
            {colaboradores && (
                <Table id="colaboradores" striped hover bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Empresa</th>
                            <th>Cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colaboradores.map((e, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{e.nombre}</td>
                                <td>{e.id}</td>
                                <td>{e.empresa}</td>
                                <td>{e.cargo}</td>
                                <td><Button onClick={() => navigate("/datos", { state: { email: e.id } })}>Ver</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );


}

export default ListaColaboradores;