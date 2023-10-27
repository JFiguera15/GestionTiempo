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
import Navigation from "./Navigation";


function Admin() {
  const [colaboradores, setColaboradores] = useState([]);
  const [fechasUsadas, setFechasUsadas] = useState([]);
  const [dates, setDates] = useState();
  const [horario, setHorario] = useState();
  const [diasVac, setDiasVac] = useState(0);
  const [diasComp, setDiasComp] = useState(0);
  const [calendarValues, setCalendarValues] = useState();
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
      tipo: (sessionStorage.getItem('rol') === "Administrador") ? "GTH" : "Sí",
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
    window.location.reload();
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
    window.location.reload();
  }

  function calculateCompensatoryDays() {
    if (horario === "7x1") return 0;
    let dias = 0;
    fechasUsadas.forEach((item) => {
      if (item[1] === "Trabajado" && ((new Date(item[0]).getDay() === 5 || new Date(item[0]).getDay() === 6))) dias++;
    })
    return dias;
  }

  function getVacationDays(dias, totalVac) {
    let vacationDays = diasVac;
    vacationDays += dias;
    let diasHabiles = 0;
    fechasUsadas.forEach((item) => {
      if (item[3] === "Vacaciones" && !((new Date(item[0]).getDay() === 5 || new Date(item[0]).getDay() === 6))) diasHabiles++;
    })
    if (diasHabiles <= vacationDays) {
      if (diasHabiles > dias) {
        diasHabiles -= dias;
        setDiasComp(0);
        setDiasVac(diasVac - diasHabiles);
      } else {
        setDiasComp(dias - diasHabiles);
      }
    }
  }

  function getFechas(user) {
    const msj = toast.loading("Cargando...");
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
    if (sessionStorage.getItem("rol") === "Administrador") {
      fetch("http://localhost:8000/colaboradores_aprobados")
        .then((res) => res.json())
        .then((data) => setColaboradores(data));
    } else {
      fetch("http://localhost:8000/colaboradores_que_reportan?id=" + sessionStorage.getItem("user"))
        .then((res) => res.json())
        .then((data) => setColaboradores(data));
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDates();
        setCalendarValues([]);
      }
    });
  }, []);

  useEffect(() => {
    getVacationDays(calculateCompensatoryDays());

  }, [fechasUsadas]);

  return (
    <div className="aprobar">
      <Navigation user={sessionStorage.getItem("rol")} />
      <Toaster />
      {colaboradores ? (colaboradores.length === 0) ? <h1>No existen solicitudes actualmente.</h1> : (
        <div id="admin_only">
          <Container fluid="sm" style={{
            height: 100 + "%",
            backgroundColor: "#3258B6",
            paddingTop: 10 + "px",
            border: 5 + "px solid black",
          }}>
            <Row className="mb-3">
              <Col>
                <FloatingLabel label="Usuario a ver"
                  style={{ maxWidth: 500 + "px", marginLeft: "auto", marginRight: "auto" }}>
                  <Form.Select
                    defaultValue=""
                    onChange={(e) => {
                      getFechas(colaboradores[e.target.value].id);
                      setReviewedUser(colaboradores[e.target.value].id);
                      setHorario(colaboradores[e.target.value].tipo_horario);
                      setDiasVac(15 + (new Date().getFullYear() - new Date(colaboradores[e.target.value].fecha_ingreso).getFullYear()));
                    }}>
                    <option value={""} disabled hidden></option>{
                      colaboradores.filter((e) => e.id !== sessionStorage.getItem("user"))
                        .map((item, index) =>
                          <option value={index} key={item.id}>{item.nombre} - {item.id}</option>
                        )
                    }
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            {reviewedUser && (
              <Table bordered id="data_colaborador" size="sm" responsive="md"
                style={{ width: 70 + "%", marginLeft: "auto", marginRight: "auto" }}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Empresa</th>
                    <th>Departamento</th>
                    <th>Cargo</th>
                    <th>Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradores.filter(e => e.id === reviewedUser).map(e =>
                    <tr>
                      <td>{e.nombre}</td>
                      <td>{e.id}</td>
                      <td>{e.empresa}</td>
                      <td>{e.departamento}</td>
                      <td>{e.cargo}</td>
                      <td>{e.nivel}</td>
                    </tr>
                  )}
                </tbody>

              </Table>
            )}
            <Row>
              <Col>
                {reviewedUser && (
                  <Table bordered size="sm"
                    style={{ width: 60 + "%", marginLeft: "auto", marginRight: "auto" }}>
                    <thead>
                      <tr>
                        <th>Tipo de horario:</th>
                        <th>Días de vacaciones disponibles:</th>
                        <th>Días compensatorios disponibles:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{horario}</td>
                        <td>{diasVac}</td>
                        <td>{diasComp}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
            <Row>
              <Col className="mb-3" md sm={12}>
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
              </Col>
              <Col md sm={12}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th colSpan={2}>Leyenda</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: "#00a128" }}></td>
                      <td>Día trabajado</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#f53232" }}></td>
                      <td>Día libre</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#5776ff" }}></td>
                      <td>Día de resposo solicitado</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#0f3bff" }}></td>
                      <td>Día de resposo aprobado por jefe</td>

                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "orange" }}></td>
                      <td>Día de resposo aprobado por GTH</td>

                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#001057" }}></td>
                      <td>Día de resposo no aprobado</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              {dates && (
                <Col md sm={12}>
                  {console.log(fechasUsadas)}
                  <Table bordered striped size="sm">
                    <thead>
                      <tr>
                        <th>Dia</th>
                        <th>Razón</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dates.map(e =>
                        <tr>
                          <td>{e}</td>
                          <td>{fechasUsadas.find((i) => i[0] === e) ? fechasUsadas.find((i) => i[0] === e)[3] : "No aplica"}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                </Col>
              )}
            </Row>
            <Row>
              <Col>
                <ButtonGroup className="mb-3">
                  <Button onClick={() => aprobarReposo()}>Aprobar</Button>
                  <Button onClick={() => noAprobarReposo()}>No aprobar</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Container>
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