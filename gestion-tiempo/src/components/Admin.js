import React, { useState, useEffect } from "react";
import "../App.css";
import Calendar from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form';


function Admin() {
  const [colaboradores, setColaboradores] = useState();
  const [fechasUsadas, setFechasUsadas] = useState([]);
  const [dates, setDates] = useState();
  const [calendarValues, setCalendarValues] = useState();
  const [nivel, setNivel] = useState();
  const [reviewedUser, setReviewedUser] = useState();


  function setUser(user) {
    const parts = user.split(",");
    sessionStorage.setItem("user", parts[0]);
    setNivel(parts[1]);
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

  function getFechas(user) {
    const msj = toast.loading("Enviando...");
    let fechasFormateadas = [];
    setCalendarValues([]);
    setDates();
    fetch("http://localhost:8000/fechas?id=" + user)
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

  useEffect(() => {
    fetch("http://localhost:8000/colaboradores")
      .then((res) => res.json())
      .then((data) => setColaboradores(data));
    setUser("jfiguera@integra-ws.com,Administrativo");
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
      {nivel === "Administrativo" && colaboradores && (
        <div id="admin_only">
          <h1>Admin</h1>
          <label>Ver registros de: </label>
          <select onChange={(e) => setReviewedUser(e.target.value)} defaultValue="">
            <option value={""} disabled hidden></option>{
              colaboradores.filter((e) => e.nivel !== "Administrativo")
                .map((item) =>
                  <option value={item.id} key={item.id}>{item.nombre} - {item.id}</option>
                )
            }
          </select>
          <button onClick={() => getFechas(reviewedUser)}>Ver</button>
          <br />
          {reviewedUser && (
            <table id="data_colaborador">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Nombre</th>
                  <th>Empresa</th>
                  <th>Nivel</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {colaboradores.filter(e => e.id === reviewedUser).map(e =>
                  <tr>
                    <td key={e.id}>{e.id}</td>
                    <td key={e.nombre}>{e.nombre}</td>
                    <td key={e.empresa}>{e.empresa}</td>
                    <td key={e.nivel}>{e.nivel}</td>
                    <td key={e.tipo_horario}>{e.tipo_horario}</td>
                  </tr>
                )}
              </tbody>

            </table>
          )}
          {dates && (
            <div>
              <button onClick={() => aprobarReposo()}>Aprobar</button>
              <button onClick={() => noAprobarReposo()}>No aprobar</button>
            </div>
          )}
        </div>
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
  );
}

export default Admin;