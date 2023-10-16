import React, { useState, useEffect } from "react";
import "../App.css";
import Calendar from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";



function Usuario() {
  const [fechasUsadas, setFechasUsadas] = useState([]);
  const [dates, setDates] = useState();
  const [razon, setRazon] = useState("");
  const [diasVac, setDiasVac] = useState(0);
  const [diasComp, setDiasComp] = useState(0);
  const [otraRazon, setOtraRazon] = useState("");
  const [calendarValues, setCalendarValues] = useState();
  const [select, setSelect] = useState("Trabajado");
  const [horario, setHorario] = useState("");


  function verificar(negate) {
    if (dates) {
      let compartidos = fechasUsadas.filter((e) => dates.includes(e[0]));
      compartidos = compartidos.map(e => e[0]);
      if (compartidos.length === 0) {
        return false;
      } else if (compartidos.length === dates.length && compartidos.length > 0) {
        return compartidos.every((e) => dates.includes(e));
      } else if (dates.length > compartidos.length && compartidos.length > 0) {
        if (negate) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }

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

  function calculateCompensatoryDays() {
    if (horario === "7x1") return 0;
    let dias = 0;
    fechasUsadas.forEach((item) => {
      if (item[1] === "Trabajado" && ((new Date(item[0]).getDay() === 5 || new Date(item[0]).getDay() === 6))) dias++;
    })
    return dias;
  }

  function getVacationDays(dias) {
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

  function enviarFechas() {
    let diasHabiles = 0;
    if (razon === "Vacaciones") {
      dates.forEach((item) => {
        if (!(new Date(item).getDay() === 6 || new Date(item).getDay() === 5)) diasHabiles++;
      })
    };
    if (diasHabiles <= diasVac) {
      const body = {
        id: sessionStorage.getItem("user"),
        fechas: dates,
        tipo: select,
        estado: (select === "Reposo") ? "Pendiente" : "",
        razon: otraRazon ? otraRazon : razon,
      }
      fetch("http://localhost:8000/enviar",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        }).then((res) => res.json());
      setCalendarValues([]);
      setDates();
      window.location.reload();
    } else {
      alert("No tiene suficientes dias de vacaciones disponibles");
    }

  }

  function getFechas() {
    const msj = toast.loading("Enviando...");
    let fechasFormateadas = [];

    setCalendarValues([]);
    setDates();
    fetch("http://localhost:8000/fechas?id=" + sessionStorage.getItem("user"))
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

  function borrarFechas() {
    const body = {
      id: sessionStorage.getItem("user"),
      fechas: dates,
    }
    fetch("http://localhost:8000/borrar",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }).then((res) => res.json());
    setCalendarValues([]);
    setDates([]);
    getFechas();
    window.location.reload();
  }

  function cambiarFechas() {
    let diasHabiles = 0;
    if (razon === "Vacaciones") {
      dates.forEach((item) => {
        if (!(new Date(item).getDay() === 6 || new Date(item).getDay() === 5)) diasHabiles++;
      })
    };
    if (diasHabiles <= diasVac) {
      const body = {
        id: sessionStorage.getItem("user"),
        fechas: dates,
        tipo: select,
        estado: (select === "Reposo") ? "Pendiente" : "",
        razon: otraRazon ? otraRazon : razon,
      }
      fetch("http://localhost:8000/cambiar",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        }).then((res) => res.json());
      setCalendarValues([]);
      setDates([]);
      getFechas(sessionStorage.getItem("user"));
      setDiasComp(0);
      window.location.reload();
    } else {
      alert("No tiene suficientes dias de vacaciones disponibles");
    }
  }

  useEffect(() => {
    getFechas();
    fetch("http://localhost:8000/datos_fecha?id=" + sessionStorage.getItem("user"))
      .then((res) => res.json())
      .then((data) => {
        setDiasVac(15 + (new Date().getFullYear() - new Date(data[0].fecha_ingreso).getFullYear()));
        setHorario(data[0].tipo_horario);
      });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDates();
        setCalendarValues([]);
        setRazon();
        setOtraRazon();
      }
    });

  }, []);

  useEffect(() => {
    if (fechasUsadas.length > 0) {
      getVacationDays(calculateCompensatoryDays());
    };
  }, [fechasUsadas]);

  return (
    <div className="solicitar">
      <Toaster />
      <Navigation user={sessionStorage.getItem("rol")} />
      <Container fluid="sm">
        <Row>
          <Col>
            {fechasUsadas && (
              <Table bordered size="sm">
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
            <Calendar value={calendarValues}
              onChange={(e) => {
                setDates(getDaysArray(e[0], e[1]))
                setCalendarValues(e)
              }}
              selectRange={true}
              locale="es-VE"
              tileClassName={({ date, view }) => view === 'month'
                && fechasUsadas.some(e => e[0] === date.toLocaleDateString("sv"))
                ? writeClass(date)
                : null}
            />
            <Row>
              <Col>
                <Form.Select
                  value={select}
                  onChange={e => setSelect(e.target.value)}>
                  <option value="Trabajado">Trabajado</option>
                  <option value="Libre">Libre</option>
                  <option value="Reposo">Reposo</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              {select === "Reposo" && (
                <Col xs={12} md={8} xl={12}>
                  <FloatingLabel label="Razón de reposo:">
                    <Form.Select aria-label="Default select example" required defaultValue={""}
                      onChange={(e) => setRazon(e.target.value)}>
                      <option hidden></option>
                      <option>Vacaciones</option>
                      <option>Tramite de Licencia de Conducir</option>
                      <option>Tramite de Documentos de Identidad</option>
                      <option>Tramites Educativos</option>
                      <option>Fallecimiento Familiar</option>
                      <option>Nacimiento de Hijos</option>
                      <option>Enfermedad de Familiar Directo</option>
                      <option value="otro">Otro (Identifique:)</option>
                    </Form.Select>
                  </FloatingLabel>
                  <Row>
                    {razon === "otro" && (
                      <Col>
                        <FloatingLabel label="Razón de reposo:">
                          <Form.Control onChange={(e) => setOtraRazon(e.target.value)} />
                        </FloatingLabel>
                      </Col>
                    )}
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <ButtonGroup>
              <Button onClick={enviarFechas} disabled={!dates || verificar(false)}>Enviar</Button>
              <Button onClick={cambiarFechas} disabled={!verificar(true)}>Cambiar</Button>
              <Button onClick={borrarFechas} disabled={!verificar(true)} variant="danger">Borrar</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container >
    </div>

  );
}

export default Usuario;