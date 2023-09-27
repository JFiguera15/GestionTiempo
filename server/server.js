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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('/colaboradores', (req, res) => {
    connection.query("SELECT * FROM COLABORADORES", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/colaboradores_no_administrativos', (req, res) => {
    connection.query("SELECT * FROM COLABORADORES WHERE NOT nivel =\'Administrativo\'", function (err, result) {
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

app.get('/fechas', (req, res) => {
    connection.query("SELECT fecha, tipo, aprobada FROM FECHAS WHERE id = \'" + req.query.id + "\'", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT id, password, nivel FROM colaboradores WHERE id = ?";
    connection.query(sql, req.body.id, (err, data) => {
        if (err) return res.json("Error al logear");
        if (data.length === 0) return res.json("Usuario incorrecto")
        else if(bcrypt.compareSync(req.body.password, data[0].password)) return res.json(data);
        return res.json("Contraseña incorrecta");

    })
});

app.post('/enviar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("INSERT INTO FECHAS VALUES (\"" 
        + data.fechas[i]+ "\", \"" + data.id + "\", \"" + data.tipo + "\", \'" + data.estado + "\');" , function (err, result) {
            if (err) throw err;
        });
    }
});

app.post('/aprobar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("UPDATE FECHAS SET aprobada = \'" + data.tipo + 
        "\' WHERE fecha =\'" + data.fechas[i] +"\' AND id =\'" + data.id + "\' AND tipo =\'Reposo\'", function (err, result) {
            if (err) throw err;
        });
    }
});


app.post('/borrar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("DELETE FROM fechas WHERE id = \'" + data.id + 
        "\' AND fecha =\'" + data.fechas[i] +"\'", function (err, result) {
            if (err) throw err;
        });
    }
});


app.post('/cambiar', (req, res) => {
    let data = req.body;
    for (let i = 0; i < data.fechas.length; i++) {
        connection.query("UPDATE fechas SET tipo = \'" + data.tipo + "\', aprobada = \'" + data.estado + 
        "\' WHERE id = \'" + data.id + "\' AND fecha = \'" + data.fechas[i] + "\'", function (err, result) {
            if (err) throw err;
        });
    }
});


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

