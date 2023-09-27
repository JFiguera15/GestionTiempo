import React, { useState, useEffect } from "react";
import "../App.css";
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

function ListaColaboradores() {

    const [colaboradores, setColaboradores] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/colaboradores")
            .then((res) => res.json())
            .then((data) => setColaboradores(data));
    }, []);

    return (
        <div>
            {colaboradores && (
                <Table id="data_colaborador">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Empresa</th>
                            <th>Departamento</th>
                            <th>Cargo</th>
                            <th>Nivel</th>
                            <th>Horario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colaboradores.map((e, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{e.id}</td>
                                <td>{e.nombre}</td>
                                <td>{e.empresa}</td>
                                <td>{e.departamento}</td>
                                <td>{e.cargo}</td>
                                <td>{e.nivel}</td>
                                <td>{e.tipo_horario}</td>
                            </tr>
                        )}
                    </tbody>

                </Table>
            )}
        </div>
    );


}

export default ListaColaboradores;