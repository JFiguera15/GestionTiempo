import React, { useState, useEffect } from "react";
import "../App.css";
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function ResultadosEvaluacion({ resultados }) {

    const [evaluado, setEvaluado] = useState();
    const [evaluador, setEvaluador] = useState();

    useEffect(() => {
        fetch("http://localhost:8000/nombre_colaborador?id=" + resultados.evaluado)
            .then((res) => res.json())
            .then((data) => {
                setEvaluado(data[0].nombre);
            });
        fetch("http://localhost:8000/nombre_colaborador?id=" + resultados.evaluador)
            .then((res) => res.json())
            .then((data) => {
                setEvaluador(data[0].nombre);
            });
    })

    return (
        <>
            <Container>
                <h4>Evaluado:</h4>
                <p>{evaluado}</p>
                <h4>Evaluador:</h4>
                <p>{evaluador}</p>
                <h4>Puntuación total:</h4>
                <p>{resultados.resultados}%</p>
                <h4>Pregunta 1:</h4>
                <p>{resultados.pregunta1}</p>
                <h4>Pregunta 2:</h4>
                <p>{resultados.pregunta2}</p>
                <h4>Pregunta 3:</h4>
                <p>{resultados.pregunta3}</p>
                <h4>Pregunta 4:</h4>
                <p>{resultados.pregunta4}</p>
                <h4>Pregunta 5:</h4>
                <p>{resultados.pregunta5}</p>
                <h4>Pregunta 6:</h4>
                <p>{resultados.pregunta6}</p>
                <h4>Pregunta 7:</h4>
                <p>{resultados.pregunta7}</p>
                <h4>Pregunta 8:</h4>
                <p>{resultados.pregunta8}</p>
                <h4>Pregunta 9:</h4>
                <p>{resultados.pregunta9}</p>
                <h4>Pregunta 10:</h4>
                <p>{resultados.pregunta10}</p>
            </Container>
        </>
    )

}

export default ResultadosEvaluacion;