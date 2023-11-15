const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')

const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestion_tiempo"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("SELECT * FROM COLABORADORES", function (err, result) {
        if (err) throw err;
    });
});

app.use(cors());
app.use(express.json());
app.use(express.text());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('/colaboradores', (req, res) => {
    const sql = "SELECT id, nombre, empresa, nivel, tipo_horario, nacionalidad, telefono_p, telefono_s, direccion, departamento, cargo, cedula, genero, fecha_nacimiento, fecha_ingreso, jefe_directo, sup_funcional, activo FROM COLABORADORES"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_activos', (req, res) => {
    const sql = "SELECT id, nombre, empresa, nivel, tipo_horario, nacionalidad, telefono_p, telefono_s, direccion, departamento, cargo, cedula, genero, fecha_nacimiento, fecha_ingreso, jefe_directo, sup_funcional, activo FROM COLABORADORES WHERE activo = 'Sí'"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_nombre_correo', (req, res) => {
    connection.query("SELECT nombre, id FROM COLABORADORES", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_menos', (req, res) => {
    connection.query("SELECT nombre, id FROM colaboradores WHERE NOT id = \'" + req.query.id + "\' AND activo = 'Sí'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/nombre_colaborador', (req, res) => {
    connection.query("SELECT nombre FROM colaboradores WHERE id = \'" + req.query.id + "\'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/datos_fecha', (req, res) => {
    connection.query("SELECT fecha_ingreso, tipo_horario FROM colaboradores WHERE id = \'" + req.query.id + "\'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/datos_usuario', (req, res) => {
    connection.query("SELECT * FROM colaboradores WHERE id = \'" + req.query.id + "\'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/usuarios_alto_nivel', (req, res) => {
    connection.query("SELECT id, nombre FROM colaboradores WHERE NOT nivel = ?", "Táctico", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_que_reportan', (req, res) => {
    const sql = "SELECT id, nombre, empresa, nivel, tipo_horario, nacionalidad, telefono_p, telefono_s, direccion, departamento, cargo, cedula, genero, fecha_nacimiento, fecha_ingreso, jefe_directo, sup_funcional FROM COLABORADORES WHERE jefe_directo = ? AND activo = 'Sí'"
    connection.query(sql, req.query.id, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_revision', (req, res) => {
    const sql = "SELECT id, nombre, empresa, nivel, tipo_horario, nacionalidad, telefono_p, telefono_s, direccion, departamento, cargo, cedula, genero, fecha_nacimiento, fecha_ingreso, jefe_directo, sup_funcional FROM COLABORADORES WHERE (jefe_directo = ? OR sup_funcional = ?) AND activo = 'Sí'"
    connection.query(sql, [req.query.id, req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/evaluado_por', (req, res) => {
    connection.query("SELECT * FROM evaluaciones WHERE evaluado = ? AND evaluador = ?", [req.query.evaluado, req.query.evaluador], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/evaluaciones_de', (req, res) => {
    connection.query("SELECT * FROM evaluaciones WHERE evaluado = ?", req.query.evaluado, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/fechas', (req, res) => {
    connection.query("SELECT fecha, tipo, aprobada, razon FROM FECHAS WHERE id = \'" + req.query.id + "\'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_aprobados', (req, res) => {
    connection.query("select * FROM colaboradores WHERE id IN (SELECT id FROM fechas WHERE aprobada = 'Sí')", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_por_aprobar', (req, res) => {
    connection.query("SELECT COUNT(DISTINCT id) FROM fechas WHERE aprobada = 'Pendiente' AND id IN (SELECT id FROM colaboradores WHERE jefe_directo = ?)",
        req.query.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

app.get('/colaboradores_por_aprobar_admin', (req, res) => {
    connection.query("SELECT COUNT(DISTINCT id) FROM fechas WHERE aprobada = 'Sí'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});


app.get('/colaboradores_por_evaluar', (req, res) => {
    connection.query("SELECT COUNT(id) from colaboradores WHERE (jefe_directo = ? OR sup_funcional = ?) AND (id NOT IN (SELECT evaluado FROM evaluaciones))",
        [req.query.id, req.query.id], function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});


app.get('/colaboradores_evaluados_admin', (req, res) => {
    connection.query("SELECT id, nombre, empresa, cargo, evaluaciones.evaluador, evaluaciones.resultados, evaluaciones.fecha FROM colaboradores INNER JOIN evaluaciones ON colaboradores.id = evaluaciones.evaluado", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_evaluados_por', (req, res) => {
    const sql = "SELECT id, nombre, empresa, cargo FROM colaboradores WHERE (jefe_directo = ? OR sup_funcional = ?) AND activo = 'Sí' AND id NOT IN (SELECT id FROM colaboradores INNER JOIN evaluaciones ON evaluaciones.evaluado = id AND evaluaciones.evaluador = ? AND YEAR(evaluaciones.fecha) = YEAR(CURRENT_DATE()))"
    connection.query(sql, [req.query.id, req.query.id, req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/estado_evaluacion', (req, res) => {
    connection.query("SELECT estado_evaluacion, fin_evaluacion FROM configuracion", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/correos', (req, res) => {
    connection.query("SELECT id FROM colaboradores", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/departamentos', (req, res) => {
    connection.query("SELECT * FROM departamentos", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/pregunta_seguridad', (req, res) => {
    connection.query("SELECT pregunta_seguridad, respuesta_seguridad FROM colaboradores WHERE id = ?", req.query.id, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/check_password', (req, res) => {
    const sql = "SELECT password FROM colaboradores WHERE id = ?";
    connection.query(sql, req.body.id, (err, data) => {
        if (err) return res.json("Error al logear");
        else if (bcrypt.compareSync(req.body.password, data[0].password)) return res.json(true);
        return res.json(false);
    })
});

app.post('/login', (req, res) => {
    const sql = "SELECT id, password, rol, activo FROM colaboradores WHERE id = ?";
    connection.query(sql, req.body.id, (err, data) => {
        if (err) return res.json("Error al logear");
        if (data.length === 0) return res.json("Usuario incorrecto");
        if (data[0].activo === "No") return res.json("Usuario no habilitado en sistema.");
        else if (bcrypt.compareSync(req.body.password, data[0].password)) return res.json(data);
        return res.json("Contraseña incorrecta");
    })
});

app.post('/agregar_colaborador', (req, res) => {
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(data.password, salt);
    const sql = "INSERT INTO colaboradores VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql,
        [data.id, password, data.nombre, data.empresa, data.nivel,
        data.horario, data.nacionalidad, data.telefonoP, data.telefonoS,
        data.direccion, data.departamento, data.cargo, data.cedula,
        data.genero, data.fechaN, data.fechaI, data.jefeD, data.supervisor, data.rol, "Sí", "", ""], function (err, result) {
            if (err) throw err;
        });
});

app.post('/enviar_evaluacion', (req, res) => {
    let data = req.body;
    const sql = "INSERT INTO evaluaciones (evaluado, resultados, evaluador, fecha, respuesta1, respuesta2, respuesta3, respuesta4, respuesta5, respuesta6, respuesta7, respuesta8, respuesta9, respuesta10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql,
        [data.evaluado, data.total, data.evaluador, data.fecha,
        data.respuesta1, data.respuesta2, data.respuesta3, data.respuesta4, data.respuesta5,
        data.respuesta6, data.respuesta7, data.respuesta8, data.respuesta9, data.respuesta10], function (err, result) {
            if (err) throw err;
        });
});

app.post('/iniciar_evaluacion', (req, res) => {
    let data = req.body;
    connection.query("UPDATE configuracion SET estado_evaluacion = ?, fin_evaluacion = ?", ["Activo", data.fecha], function (err, result) {
        if (err) throw err;
    });
});

app.post('/terminar_evaluacion', (req, res) => {
    connection.query("UPDATE configuracion SET estado_evaluacion = 'Inactivo', fin_evaluacion = '2120-12-31'", function (err, result) {
        if (err) throw err;
    });
});

app.post('/actualizar_colaborador', (req, res) => {
    let data = req.body;
    const sql = "UPDATE colaboradores SET "
        + "nombre = ?, empresa = ?, nivel = ?, tipo_horario = ?, nacionalidad = ?, telefono_p = ?, telefono_s = ?, direccion = ?, departamento = ?, cargo = ?, cedula = ?, genero = ?, fecha_nacimiento = ?, fecha_ingreso = ?, jefe_directo = ?, sup_funcional = ?, rol = ?"
        + " WHERE id = ?";
    connection.query(sql,
        [data.nombre, data.empresa, data.nivel,
        data.horario, data.nacionalidad, data.telefonoP, data.telefonoS,
        data.direccion, data.departamento, data.cargo, data.cedula,
        data.genero, data.fechaN, data.fechaI, data.jefeD, data.supervisor, data.rol, data.id], function (err, result) {
            if (err) throw err;
        });

});

app.post('/cambiar_password', (req, res) => {
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(data.password, salt);
    const sql = "UPDATE colaboradores SET password = ? WHERE id = ?";
    connection.query(sql,
        [password, data.id], function (err, result) {
            if (err) throw err;
        });
});

app.post('/cambiar_respuesta_seguridad', (req, res) => {
    let data = req.body;
    const sql = "UPDATE colaboradores SET pregunta_seguridad = ?, respuesta_seguridad = ?  WHERE id = ?";
    connection.query(sql,
        [data.pregunta, data.respuesta, data.id], function (err, result) {
            if (err) throw err;
        });
});

app.post('/eliminar_colaborador', (req, res) => {
    let data = req.body;
    const sql = "DELETE FROM colaboradores where id = ?";
    connection.query(sql, data, function (err, result) {
        if (err) throw err;
    });
});

app.post('/deshabilitar_colaborador', (req, res) => {
    let data = req.body;
    const sql = "UPDATE colaboradores SET activo = 'No' where id = ?";
    connection.query(sql, data, function (err, result) {
        if (err) throw err;
    });
});

app.post('/rehabilitar_colaborador', (req, res) => {
    let data = req.body;
    const sql = "UPDATE colaboradores SET activo = 'Sí' where id = ?";
    connection.query(sql, data, function (err, result) {
        if (err) throw err;
    });
});

app.post('/enviar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("INSERT INTO FECHAS (fecha, id, tipo, aprobada, razon) VALUES (\""
            + data.fechas[i] + "\", \"" + data.id + "\", \"" + data.tipo + "\", \'" + data.estado + "\', \'" + data.razon + "\')", function (err, result) {
                if (err) throw err;
            });
    }
});

app.post('/aprobar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("UPDATE FECHAS SET aprobada = \'" + data.tipo +
            "\' WHERE fecha =\'" + data.fechas[i] + "\' AND id =\'" + data.id + "\' AND tipo =\'Reposo\'", function (err, result) {
                if (err) throw err;
            });
    }
});


app.post('/borrar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("DELETE FROM fechas WHERE id = \'" + data.id +
            "\' AND fecha =\'" + data.fechas[i] + "\'", function (err, result) {
                if (err) throw err;
            });
    }
});


app.post('/cambiar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("UPDATE fechas SET tipo = \'" + data.tipo + "\', aprobada = \'" + data.estado +
            "\', razon = \'" + data.razon + "\' WHERE id = \'" + data.id + "\' AND fecha = \'" + data.fechas[i] + "\'", function (err, result) {
                if (err) throw err;
            });
    }
});


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

