import React, { useState, useEffect } from "react";
import "../App.css";
import Calendar from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


function Admin() {
  const [colaboradores, setColaboradores] = useState([]);
  const [fechasUsadas, setFechasUsadas] = useState([]);
  const [dates, setDates] = useState();
  const [calendarValues, setCalendarValues] = useState();
  const [nivel, setNivel] = useState();
  const [reviewedUser, setReviewedUser] = useState();

  function writeClass(date) {
    let text = '';
    if (fechasUsadas.some(e => e[0] === date.toLocaleDateString("sv"))) {
      const index = fechasUsadas.findIndex(e => e[0] === date.toLocaleDateString("sv"));
      text += fechasUsadas[index][1].toLowerCase();
      if (fechasUsadas[index][2]) {
        text += ("-" + fechasUsadas[index][2].toLowerCase());
      }
    }
    return text;
  }

  const getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      if (!fechasUsadas.includes(new Date(dt).toLocaleDateString("sv"))) {
        arr.push(new Date(dt).toLocaleDateString("sv"));
      }
    }
    return arr;
  };

  function aprobarReposo() {
    const body = {
      id: reviewedUser,
      fechas: dates,
      tipo: "Sí",
    }
    fetch("http://localhost:8000/aprobar",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }).then((res) => res.json());
    setCalendarValues([]);
    setDates();
    getFechas(reviewedUser);
  }

  function noAprobarReposo() {
    const body = {
      id: reviewedUser,
      fechas: dates,
      tipo: "No",
    }
    fetch("http://localhost:8000/aprobar",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }).then((res) => res.json());
    setCalendarValues([]);
    setDates();
    getFechas(reviewedUser);
  }

  function getRazon(fecha){

  }

  function getFechas(user) {
    const msj = toast.loading("Enviando...");
    let fechasFormateadas = [];
    setCalendarValues([]);
    setDates();
    fetch("http://localhost:8000/fechas?id=" + user)
      .then((res) => res.json())
      .then((data) => {
        data.forEach(element => {
          fechasFormateadas.push([new Date(element.fecha).toLocaleDateString("sv"), element.tipo, element.aprobada, element.razon]);
        });
        setFechasUsadas(fechasFormateadas);
      })
      .then(() => {
        toast.dismiss(msj);
      });
  }

  useEffect(() => {
    setNivel(sessionStorage.getItem("rol"));
    fetch("http://localhost:8000/colaboradores_que_reportan?id=" + sessionStorage.getItem("user"))
      .then((res) => res.json())
      .then((data) => setColaboradores(data));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDates();
        setCalendarValues([]);
      }
    });
  }, []);

  return (
    <div className="App">
      <Toaster />
      {colaboradores ? (colaboradores.length === 0) ? <h1>No posee colaboradores que reporten directamente a usted.</h1> : (
        <div id="admin_only">
          <Container>
            <Row>
              <Col>
                <FloatingLabel label="Usuario a ver">
                  <Form.Select
                    aria-label="Default select example"
                    defaultValue=""
                    onChange={(e) => setReviewedUser(e.target.value)}>
                    <option value={""} disabled hidden></option>{
                      colaboradores.filter((e) => e.id !== sessionStorage.getItem("user"))
                        .map((item) =>
                          <option value={item.id} key={item.id}>{item.nombre} - {item.id}</option>
                        )
                    }
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                <Button onClick={() => getFechas(reviewedUser)}>Ver</Button>
              </Col>
            </Row>
          </Container>

          <br />
          {reviewedUser && (
            <Table id="data_colaborador">
              <thead>
                <tr>
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
                {colaboradores.filter(e => e.id === reviewedUser).map(e =>
                  <tr>
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
          {dates && (
            <>
            {console.log(fechasUsadas)}
              <ButtonGroup>
                <Button onClick={() => aprobarReposo()}>Aprobar</Button>
                <Button onClick={() => noAprobarReposo()}>No aprobar</Button>
              </ButtonGroup>
              <Table>
                <thead>
                  <th>Dia</th>
                  <th>Razón</th>
                </thead>
                <tbody>
                  {dates.map(e =>
                    <tr>
                      <td>{e}</td>
                      <td>{fechasUsadas.find((i) => i[0] === e)[3]}</td>
                    </tr>
                  )}
                </tbody>

              </Table>
            </>

          )}
          <br />
          <Calendar value={calendarValues}
            onChange={(e) => {
              setDates(getDaysArray(e[0], e[1]))
              setCalendarValues(e)
            }}
            selectRange={true}
            tileDisabled={({ date, view }) => view === 'month'
              && !fechasUsadas.some(e => (e[0] === date.toLocaleDateString("sv") && e[1] === "Reposo"))}
            locale="es-VE"
            tileClassName={({ date, view }) => view === 'month'
              && fechasUsadas.some(e => e[0] === date.toLocaleDateString("sv"))
              ? writeClass(date)
              : null}
          />
          <br />
        </div>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      )}
    </div>
  );
}

export default Admin;