import React, { useState, useEffect } from "react";
import "../App.css";
import Container from 'react-bootstrap/Container';

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
            <Container style={{padding : 5 + "px"}}>
                <h4>Evaluado:</h4>
                <p>{evaluado}</p>
                <h4>Evaluador:</h4>
                <p>{evaluador}</p>
                <h4>Fecha de realización</h4>
                <p>{resultados.fecha.split('T')[0]}</p>
                <h4>Puntuación total:</h4>
                <p>{resultados.resultados}%</p>
                <h4>Eje I: Compentencias claves</h4>
                <h4>Pregunta 1: Compromiso y disciplina personal</h4>
                <p>{resultados.respuesta1}</p>
                <h4>Pregunta 2: Liderazgo</h4>
                <p>{resultados.respuesta2}</p>
                <h4>Pregunta 3: Orientación al detalle</h4>
                <p>{resultados.respuesta3}</p>
                <h4>Pregunta 4: Trabajo Colaborativo</h4>
                <p>{resultados.respuesta4}</p>
                <h4>Eje II: Desempeño de funciones clave</h4>
                <h4>Pregunta 5: Cumplimiento de funciones clave</h4>
                <p>{resultados.respuesta5}</p>
                <h4>Eje III: Perfil de adherencia a la Seguridad y Calidad</h4>
                <h4>Pregunta 6: Cumplimiento de protocolos HSE-Q</h4>
                <p>{resultados.respuesta6}</p>
                <h4>Pregunta 7: Participación de actividades HSE-Q</h4>
                <p>{resultados.respuesta7}</p>
                <h4>Pregunta 8: Participación en el Programa de Reforzamiento en HSE-Q</h4>
                <p>{resultados.respuesta8}</p>
                <h4>Eje IV: Credibilidad Técnica</h4>
                <h4>Pregunta 9: Educación y/o experiencia relacionada a la posición que ocupa.</h4>
                <p>{resultados.respuesta9}</p>
                <h4>Pregunta 10: Conocimiento del trabajo</h4>
                <p>{resultados.respuesta10}</p>
            </Container>
        </>
    )

}

export default ResultadosEvaluacion;