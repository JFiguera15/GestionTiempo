import React, { useState, useEffect } from "react";
import "../App.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";

const preguntasOperativo = [
    ["Cumple con sus compromisos con desempeño promedio y se establece objetivos dentro de lo esperado.", "Cumple los compromisos con buen desempeño ocasionalmente y se establece objetivos dentro de lo esperado.", "Cumple con frecuencia los compromisos mostrando buen desempeño y tiende a establecerse objetivos por encima de lo esperado.", "Cumple con sus compromisos con alto desempeño frecuentemente y tiende a establecerse objetivos por encima de lo esperado."],
    ["Se fija objetivos personales, rara vez participa en iniciativas técnicas o de mejora con el equipo de trabajo, conoce los aspectos básicos de su trabajo, raramente brinda guía o mentoría a sus compañeros.", "Sigue los objetivos del equipo, ocasionalmente participa con iniciativas técnicas o de mejora en general, conoce los aspectos generales de su trabajo y de otras posiciones, brinda guía o mentoría a sus compañeros ocasionalmente.", "Puede fijar objetivos pensando en lo personal y en el equipo, promueve iniciativas técnicas y de mejora realizando poco seguimiento de lo encomendado. Conoce a profundidad su trabajo. Trabaja con energía y buen ánimo.", "Puede fijar objetivos que son aceptados por el equipo desde el punto de vista técnico y general, realizando un adecuado seguimiento de lo encomendado. Sabe fragmentar tareas. Sus compañeros confían en su expertise, trabaja con energía y buen ánimo."],
    ["Requiere de reforzamiento para mantener organización en sus tareas, puede dejar pasar ocasionalmente algunos errores menores en sus entregables. Requiere monitoreo para apegarse a los procedimientos y normas.", "Organiza sus tareas diarias, mas requiere recordatorio sobre los pendientes. Con frecuencia su trabajo está correcto. Comprende los procedimientos y normas, requiriendo poco monitoreo para el cumplimiento de los mismos.", "Puede fraccionar un problema en partes, aunque tiende a enfocarse en aspectos específicos, tomando poco en cuenta el panorama general de la situación. Su trabajo cumple exactamente con lo requerido, sin mayores aportes o mejoras. Establece prioridades solamente en función a la urgencia. Tiende a organizarse para la ejecución de sus tareas. Se apega a los procedimientos.", "Analiza relaciones de algunas partes de un problema. Casi siempre su trabajo está correcto y con frecuencia da aportes. Establece prioridades para las tareas según su urgencia y en ocasiones la importancia. Es metódico en el abordaje de sus tareas. Se apega a los procedimientos fielmente."],
    ["Prefiere trabajar de forma individual, confía en más en su desempeño personal que en el rendimiento del equipo, rara vez se involucra en acciones grupales, sus logros son individuales.", "Prefiere trabajar de forma individual, aunque se muestra abierto al trabajo en equipo, ocasionalmente se involucra en acciones grupales, sus logros son individuales, con aportes modestos a los logros grupales.", "Le agrada el trabajo en equipo, cumple con las tareas que el grupo le asigna. Apoya los logros compartidos. Privilegia el interés personal, aunque ocasionalmente toma en cuenta los intereses grupales.", "Comprende la necesidad de que todos colaboren para la mejor consecución de los objetivos generales. Se compromete en la búsqueda de logros compartidos. Privilegia el interés del grupo por encima del interés personal."]
];


function Evaluacion() {
    const [pageEje1, setPageEje1] = useState(1);
    const [pageEje3, setPageEje3] = useState(1);
    const [pageEje4, setPageEje4] = useState(1);
    const [sliderVal1, setSliderVal1] = useState(0);
    const [sliderVal2, setSliderVal2] = useState(0);
    const [sliderVal3, setSliderVal3] = useState(0);
    const [results, setResults] = useState({
        pregunta1: 0,
        pregunta2: 0,
        pregunta3: 0,
        pregunta4: 0,
        pregunta5: 0,
        pregunta6: 0,
        pregunta7: 0,
        pregunta8: 0,
        pregunta9: 0,
        pregunta10: 0,
    })

    function handleSubmit(e) {
        e.preventDefault();
        console.log(results);
        console.log(e.target);
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    let eje1 = [];
    for (let number = 1; number <= 4; number++) {
        eje1.push(
            <Pagination.Item key={number} onClick={() => setPageEje1(number)} active={number === pageEje1}>
                {number}
            </Pagination.Item>,
        );
    }

    let eje3 = [];
    for (let number = 1; number <= 3; number++) {
        eje3.push(
            <Pagination.Item key={number} onClick={() => setPageEje3(number)} active={number === pageEje3}>
                {number}
            </Pagination.Item>,
        );
    }

    let eje4 = [];
    for (let number = 1; number <= 2; number++) {
        eje4.push(
            <Pagination.Item key={number} onClick={() => setPageEje4(number)} active={number === pageEje4}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <h2>Eje I</h2>
                {pageEje1 - 1 === 0 && (
                    <Form.Group>
                        {preguntasOperativo[0].map((item, index) =>
                            <Form.Check type="radio" label={item} name="pregunta1" value={1.875 * (index + 1)} onChange={(e) => results.pregunta1 = e.target.value} />)}
                    </Form.Group>
                )}
                {pageEje1 - 1 === 1 && (
                    <Form.Group>
                        {preguntasOperativo[1].map((item, index) =>
                            <Form.Check type="radio" label={item} name="pregunta2" value={1.875 * (index + 1)} onChange={(e) => results.pregunta2 = e.target.value} />)}
                    </Form.Group>
                )}
                {pageEje1 - 1 === 2 && (
                    <Form.Group>
                        {preguntasOperativo[2].map((item, index) =>
                            <Form.Check type="radio" label={item} name="pregunta3" value={1.875 * (index + 1)} onChange={(e) => results.pregunta3 = e.target.value} />)}
                    </Form.Group>
                )}
                {pageEje1 - 1 === 3 && (
                    <Form.Group>
                        {preguntasOperativo[3].map((item, index) =>
                            <Form.Check type="radio" label={item} name="pregunta4" value={1.875 * (index + 1)} onChange={(e) => results.pregunta4 = e.target.value} />)}
                    </Form.Group>
                )}
                <Pagination>{eje1}</Pagination>
                <Container>
                    <h2>Eje II</h2>
                    <Form.Label>{sliderVal1}%</Form.Label>
                    <Form.Range name="pregunta5" onChange={(e) => {
                        results.pregunta5 = e.target.value;
                        setSliderVal1(e.target.value);
                    }} defaultValue={sliderVal1} />
                </Container>
                <Container>
                    <h2>Eje III</h2>
                    <Form.Label>{sliderVal2}%</Form.Label>
                    {pageEje3 -1 == 0 && (
                        <Form.Range name="pregunta6" onChange={(e) => {
                            results.pregunta6 = e.target.value;
                            setSliderVal2(e.target.value);
                        }} defaultValue={0}>
                        </Form.Range>
                    )}
                    {pageEje3 -1 == 1 && (
                        <Form.Range name="pregunta7" onChange={(e) => {
                            results.pregunta7 = e.target.value;
                            setSliderVal2(e.target.value);
                        }} defaultValue={0}>
                        </Form.Range>
                    )}
                    {pageEje3 - 1 == 2 && (
                        <Form.Range name="pregunta8" onChange={(e) => {
                            results.pregunta8 = e.target.value;
                            setSliderVal2(e.target.value);
                        }} defaultValue={0}>
                        </Form.Range>
                    )}
                    
                    <Pagination>{eje3}</Pagination>
                </Container>
                <Container>
                    <h2>Eje IV</h2>
                    <Pagination>{eje4}</Pagination>
                </Container>
                <Button type="submit">Submit</Button>
            </Form>

        </>
    )

}

export default Evaluacion;