import React, { useState, useEffect } from "react";
import "../App.css";
import Calendar from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form';

function Usuario() {
  const [colaboradores, setColaboradores] = useState();
  const [fechasUsadas, setFechasUsadas] = useState([]);
  const [dates, setDates] = useState();
  const [calendarValues, setCalendarValues] = useState();
  const [select, setSelect] = useState("Trabajado");


  function setUser(user) {
    const parts = user.split(",");
    //sessionStorage.setItem("user", parts[0]);
  }

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

  function enviarFechas() {
    const body = {
      id: sessionStorage.getItem("user"),
      fechas: dates,
      tipo: select,
      estado: (select === "Reposo") ? "Pendiente" : "",
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
    //getFechas(sessionStorage.getItem("user"));
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
          fechasFormateadas.push([new Date(element.fecha).toLocaleDateString("sv"), element.tipo, element.aprobada]);
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
    getFechas(sessionStorage.getItem("user"));
  }

  function cambiarFechas() {
    const body = {
      id: sessionStorage.getItem("user"),
      fechas: dates,
      tipo: select,
      estado: (select === "Reposo") ? "Pendiente" : "",
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
  }

  useEffect(() => {
    getFechas();
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
      <h1>Usuario</h1>
      <br />
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
      <select
        value={select}
        onChange={e => setSelect(e.target.value)}>
        <option value="Trabajado">Trabajado</option>
        <option value="Libre">Libre</option>
        <option value="Reposo">Reposo</option>
      </select>
      {select === "Reposo" && (
        <Form.Select aria-label="Default select example">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      )}
      <br />
      <button onClick={enviarFechas} disabled={!dates || verificar(false)}>Enviar</button>
      <button onClick={cambiarFechas} disabled={!verificar(true)}>Cambiar</button>
      <button onClick={borrarFechas} disabled={!verificar(true)}>Borrar</button>
    </div>
  );
}

export default Usuario;