import React, { useState, useEffect } from "react";
import "../App.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import Navigation from "./Navigation";

const preguntasOperativo = [
    ["Cumple con sus compromisos con desempeño promedio y se establece objetivos dentro de lo esperado.", "Cumple los compromisos con buen desempeño ocasionalmente y se establece objetivos dentro de lo esperado.", "Cumple con frecuencia los compromisos mostrando buen desempeño y tiende a establecerse objetivos por encima de lo esperado.", "Cumple con sus compromisos con alto desempeño frecuentemente y tiende a establecerse objetivos por encima de lo esperado."],
    ["Se fija objetivos personales, rara vez participa en iniciativas técnicas o de mejora con el equipo de trabajo, conoce los aspectos básicos de su trabajo, raramente brinda guía o mentoría a sus compañeros.", "Sigue los objetivos del equipo, ocasionalmente participa con iniciativas técnicas o de mejora en general, conoce los aspectos generales de su trabajo y de otras posiciones, brinda guía o mentoría a sus compañeros ocasionalmente.", "Puede fijar objetivos pensando en lo personal y en el equipo, promueve iniciativas técnicas y de mejora realizando poco seguimiento de lo encomendado. Conoce a profundidad su trabajo. Trabaja con energía y buen ánimo.", "Puede fijar objetivos que son aceptados por el equipo desde el punto de vista técnico y general, realizando un adecuado seguimiento de lo encomendado. Sabe fragmentar tareas. Sus compañeros confían en su expertise, trabaja con energía y buen ánimo."],
    ["Requiere de reforzamiento para mantener organización en sus tareas, puede dejar pasar ocasionalmente algunos errores menores en sus entregables. Requiere monitoreo para apegarse a los procedimientos y normas.", "Organiza sus tareas diarias, mas requiere recordatorio sobre los pendientes. Con frecuencia su trabajo está correcto. Comprende los procedimientos y normas, requiriendo poco monitoreo para el cumplimiento de los mismos.", "Puede fraccionar un problema en partes, aunque tiende a enfocarse en aspectos específicos, tomando poco en cuenta el panorama general de la situación. Su trabajo cumple exactamente con lo requerido, sin mayores aportes o mejoras. Establece prioridades solamente en función a la urgencia. Tiende a organizarse para la ejecución de sus tareas. Se apega a los procedimientos.", "Analiza relaciones de algunas partes de un problema. Casi siempre su trabajo está correcto y con frecuencia da aportes. Establece prioridades para las tareas según su urgencia y en ocasiones la importancia. Es metódico en el abordaje de sus tareas. Se apega a los procedimientos fielmente."],
    ["Prefiere trabajar de forma individual, confía en más en su desempeño personal que en el rendimiento del equipo, rara vez se involucra en acciones grupales, sus logros son individuales.", "Prefiere trabajar de forma individual, aunque se muestra abierto al trabajo en equipo, ocasionalmente se involucra en acciones grupales, sus logros son individuales, con aportes modestos a los logros grupales.", "Le agrada el trabajo en equipo, cumple con las tareas que el grupo le asigna. Apoya los logros compartidos. Privilegia el interés personal, aunque ocasionalmente toma en cuenta los intereses grupales.", "Comprende la necesidad de que todos colaboren para la mejor consecución de los objetivos generales. Se compromete en la búsqueda de logros compartidos. Privilegia el interés del grupo por encima del interés personal."]
];

const preguntasTactico = [
    ["Cumple con sus compromisos con alto desempeño frecuentemente y tiende a establecerse objetivos por encima de lo esperado.", "Comprende las directivas recibidas y las transmite de forma verbal, se fija objetivos altos con frecuencia y los cumple. Reacciona en función de dar solución a los obstáculos que afecten la consecución del objetivo.", "Comprende las directivas recibidas y las transmite brindando apoyo y asesoría, se fija objetivos altos y los cumple tanto en calidad como frecuencia. Supera obstáculos con diligencia para reducir la posible afectación de las metas y objetivos.", "Apoya e instrumenta las directivas recibidas transmitiendo a los otros, por medio del ejemplo, la conducta a seguir. Se fija objetivos altos y los cumple casi siempre. Previene y supera obstáculos que afecten la consecución del objetivo."],
    ["Puede fijar objetivos que son aceptados por el equipo desde el punto de vista técnico y general, realizando un adecuado seguimiento de lo encomendado. Sabe fragmentar tareas. Sus compañeros confían en su expertise, trabaja con energía y buen ánimo.", "El equipo busca su opinión para fijar objetivos comunes, es competente organizando las tareas y hace seguimiento de su cumplimiento. Sus compañeros confían en su expertise, trabaja con energía y buen ánimo.", "El equipo lo percibe como referencia técnica, puede llegar a fijar objetivos y realiza un adecuado seguimiento brindando feedback ocasional a los distintos integrantes. Sabe delegar tareas. Escucha a los otros ocasionalmente. Motiva a sus supervisados con relativa frecuencia, es ejemplo de ética de trabajo.", "El equipo lo percibe como líder, fija objetivos y realiza un adecuado seguimiento brindando feedback oportuno a los distintos integrantes. Sabe delegar tareas con destreza. Escucha a los otros y es escuchado. Motiva a sus supervisados, es ejemplo de valores y ética de trabajo."],
    ["Analiza relaciones de algunas partes de un problema. Casi siempre su trabajo está correcto y con frecuencia da aportes. Establece prioridades para las tareas según su urgencia y en ocasiones la importancia. Es metódico en el abordaje de sus tareas. Se apega a los procedimientos fielmente.", "Puede conectar las interacciones entre las distintas partes de un problema. Su trabajo es pulcro y con frecuencia da aportes. Establece prioridades para las tareas según su urgencia y en ocasiones la importancia. Es metódico y meticuloso en el abordaje de sus tareas. Se apega a los procedimientos y ocasionalmente sugiere mejoras menores.", "Analiza las relaciones entre las muchas partes de un problema. Identifica al menos una causa o consecuencia de las acciones que realiza. Puede planificar sus acciones. Establece prioridades en función a urgencia - importancia. Apoya la optimización de los procedimientos.", "Analiza las relaciones entre las muchas partes de un problema. Reconoce varias causas o consecuencias de las acciones. Anticipa obstáculos y prevé los próximos pasos. Su trabajo es confiable y da aportes significativos. Establece prioridades en función a urgencia - importancia. Busca optimizar los procedimientos."],
    ["Comprende la necesidad de que todos colaboren para la mejor consecución de los objetivos generales. Se compromete en la búsqueda de logros compartidos. Privilegia el interés del grupo por encima del interés personal.", "Promueve la sincronía y la colaboración entre los miembros del equipo para la mejor consecución de los objetivos generales. Cumple con sus tareas y presta ocasionalmente apoyo a los otros miembros del equipo. Establece prioridades en función a las necesidades grupales.", "Se involucra en el cumplimiento de las tareas de todos los miembros de su equipo, para lograr los objetivos compartidos. Es referente profesional y fuente de confianza para los demás. Participa en el trabajo en equipo con otras áreas de la organización.", "Por medio de sus actitudes, alienta al buen desarrollo de las tareas de todos. Tiene sólida reputación profesional y genera confianza en los demás sin descuidar sus obligaciones específicas. Promueve el trabajo en equipo con otras áreas de la organización."]
];

const preguntasEstrategico = [
    ["Apoya e instrumenta las directivas recibidas transmitiendo a los otros, por medio del ejemplo, la conducta a seguir. Se fija objetivos altos y los cumple casi siempre. Previene y supera obstáculos que afecten la consecución del objetivo.", "Apoya e instrumenta las directivas que recibe, tomando en cuenta el beneficio de la organización. Colabora en el diseño de algunas directrices. Establece para sí mismo objetivos de alto desempeño, superiores al promedio. Previene obstáculos y los supera en función del bien organizacional. Los miembros de la organización lo perciben como una persona organizada y competente.", "Apoya e instrumenta las directrices que recibe tomando en cuenta el beneficio de la organización. Participa activamente en el diseño de directrices. Establece para sí mismo objetivos de alto desempeño, superiores al promedio. Previene, anticipa y supera obstáculos en función del bien organizacional. Los miembros de la organización lo perciben como referente técnico, eficiente y productivo.", "Diseña, promueve, apoya e instrumenta todas las directivas que recibe en pro del beneficio de la organización y de los objetivos comunes. Establece para sí mismo objetivos de alto desempeño, superiores al promedio y los alcanza con éxito. Los integrantes de la organización lo perciben como un ejemplo a seguir por su disciplina personal y alta productividad."],
    ["El equipo lo percibe como líder, fija objetivos y realiza un adecuado seguimiento brindando feedback oportuno a los distintos integrantes. Sabe delegar tareas con destreza. Escucha a los otros y es escuchado. Motiva a sus supervisados, es ejemplo de valores y ética de trabajo.", "Su departamento lo percibe como líder, fija objetivos y realiza un minucioso seguimiento brindando feedback oportuno a los distintos integrantes del área. Busca delegar tareas tomando en cuenta las habilidades de sus supervisados. Escucha a los otros frecuentemente y los demás prestan especial atención a sus opiniones. Motiva a sus supervisados frecuentemente, es ejemplo de valores y ética de trabajo.", "La organización lo percibe como líder en su área. Orienta las acciones de su equipo, da coaching con relativa frecuencia, educa en valores de acción y es capaz de visualizar los distintos escenarios. Fija objetivos claros, realiza su seguimiento y da feedback sobre su avance, con capacidad de reajustar planes fácilmente. Diseña y edifica las estrategias de acción y las transmite. Tiene energía y la transmite a otros en pro de un objetivo común.", "La organización lo percibe como líder integral. Orienta las acciones de su equipo con clara determinación, da coaching, inspira valores de acción y es capaz de anticipar los distintos escenarios. Fija objetivos claros, alineados con la visión organizacional, realiza su seguimiento y da feedback sobre su avance integrando las opiniones de los miembros del grupo. Diseña y edifica las estrategias de acción. Involucra a su equipo en las decisiones. Tiene energía y la transmite a otros en pro de un objetivo común."],
    ["Analiza las relaciones entre las muchas partes de un problema. Reconoce varias causas o consecuencias de las acciones. Anticipa obstáculos y prevé los próximos pasos. Su trabajo es confiable y da aportes significativos. Establece prioridades en función a urgencia - importancia. Busca optimizar los procedimientos.", "Analiza las relaciones entre varios problemas y sus partes. Reconoce varias causas o consecuencias de las acciones. Anticipa obstáculos y prevé los próximos pasos. Comunica ocasionalmente los resultados de sus análisis. Prevé las prioridades de su departamento. Participa en la optimización los procedimientos.", "Realiza análisis, organizando, secuenciando, y analizando sistemas interdependientes, disgregando problemas en sus partes componentes. Es capaz de comunicar frecuentemente sus conclusiones. Elabora nuevos procedimientos orientados al detalle y la minuciosidad.", "Realiza análisis complejos, organizando, secuenciando, y analizando sistemas interdependientes de alta complejidad, disgregando problemas en sus partes componentes. Es capaz de comunicar claramente sus conclusiones y hacerlas comprensibles a otros. Elabora nuevos procedimientos orientados a la mejora continua y a la productividad."],
    ["Por medio de sus actitudes, alienta al buen desarrollo de las tareas de todos. Tiene sólida reputación profesional y genera confianza en los demás sin descuidar sus obligaciones específicas. Promueve el trabajo en equipo con otras áreas de la organización.", "Promueve el trabajo colaborativo como base para el logro de objetivos compartidos. Se interesa por establecer puentes de comunicación y colaboración con otros departamentos.  Tiene sólida reputación profesional y genera confianza en los demás sin descuidar sus obligaciones específicas. Comprende la necesidad de un buen clima de trabajo interdepartamental.", "Cumple con sus obligaciones sin desatender por ello los intereses de otros miembros del equipo y es un referente confiable de todos los que deben relacionarse con su departamento. Impulsa el trabajo en equipo. Promueve un buen clima de trabajo interdepartamental. Trata las necesidades de otras áreas con interés y celeridad.", "Cumple con sus obligaciones y las de su equipo sin desatender por ello los intereses de otras áreas y es un referente confiable de todos los que deben relacionarse con su departamento. Promueve el trabajo en equipo a nivel organizacional. Crea un buen clima de trabajo, comprende la dinámica del funcionamiento grupal e interviene resolviendo situaciones de conflicto. Trata las necesidades de otras áreas con la misma celeridad y dedicación con que trata las de su área."]
];



function Evaluacion() {
    const [pageEje1, setPageEje1] = useState(1);
    const [pageEje3, setPageEje3] = useState(1);
    const [pageEje4, setPageEje4] = useState(1);
    const [show, setShow] = useState(false);
    const [sliderVal1, setSliderVal1] = useState(0);
    const navigate = useNavigate();
    let preguntas;
    const [results, setResults] = useState({
        pregunta6: 0,
        pregunta7: 0,
        pregunta8: 0,
        pregunta9: 0,
        pregunta10: 0,
    });
    const location = useLocation();

    const nivelActual = location.state.nivel;
    switch (nivelActual) {
        case "Estratégico":
            preguntas = preguntasEstrategico;
            break;
        case "Táctico":
            preguntas = preguntasTactico;
            break;
        default:
            preguntas = preguntasOperativo;
            break;
    }


    function handleSubmit() {
        const form = document.getElementById("form");
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        if (Object.keys(formJson).length !== 10) {
            Swal.fire("La evaluación no esta completa");
            setShow(false);
            return;
        }
        const respuestas = {};
        respuestas.respuesta1 = preguntas[0][(formJson.pregunta1 / 1.875) - 1];
        respuestas.respuesta2 = preguntas[1][(formJson.pregunta2 / 1.875) - 1];
        respuestas.respuesta3 = preguntas[2][(formJson.pregunta3 / 1.875) - 1];
        respuestas.respuesta4 = preguntas[3][(formJson.pregunta4 / 1.875) - 1];
        respuestas.respuesta5 = document.getElementById("tabla1").rows[1 + rowPicker(formJson.pregunta5)].getElementsByTagName("td")[1].innerHTML;
        respuestas.respuesta6 = document.getElementById("tabla2").rows[1 + rowPicker(formJson.pregunta6)].getElementsByTagName("td")[1].innerHTML;
        respuestas.respuesta7 = document.getElementById("tabla3").rows[1 + rowPicker(formJson.pregunta7)].getElementsByTagName("td")[1].innerHTML;
        respuestas.respuesta8 = document.getElementById("tabla4").rows[1 + rowPicker(formJson.pregunta8)].getElementsByTagName("td")[1].innerHTML;
        respuestas.respuesta9 = document.getElementById("tabla5").rows[1 + rowPicker(formJson.pregunta9)].getElementsByTagName("td")[1].innerHTML;
        respuestas.respuesta10 = document.getElementById("tabla6").rows[1 + rowPicker(formJson.pregunta10)].getElementsByTagName("td")[1].innerHTML;
        formJson.pregunta5 = (formJson.pregunta5 / 100) * 40;
        formJson.pregunta6 = (formJson.pregunta6 / 100) * 6.66;
        formJson.pregunta7 = (formJson.pregunta7 / 100) * 6.66;
        formJson.pregunta8 = (formJson.pregunta8 / 100) * 6.66;
        formJson.pregunta9 = (formJson.pregunta9 / 100) * 5;
        formJson.pregunta10 = (formJson.pregunta10 / 100) * 5;
        respuestas.total = Object.values(formJson).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        respuestas.total = respuestas.total.toFixed(2);
        respuestas.evaluado = location.state.id;
        respuestas.evaluador = sessionStorage.getItem("user");
        respuestas.fecha = new Date().toISOString().split('T')[0];
        fetch("http://localhost:8000/enviar_evaluacion",
            {
                method: "POST",
                body: JSON.stringify(respuestas),
                headers: { "Content-Type": "application/json" }
            }).then((res) => res.json());
        navigate("/datos", { state: { email: location.state.id } })
    }

    function rowPicker(x) {
        if (x <= 25) return 0;
        else if (x <= 49) return 1;
        else if (x <= 74) return 2;
        else if (x <= 91) return 3;
        else if (x <= 100) return 4;
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
            <Pagination.Item key={number} onClick={() => {
                setPageEje3(number)
            }} active={number === pageEje3}>
                {number}
            </Pagination.Item>,
        );
    }

    let eje4 = [];
    for (let number = 1; number <= 2; number++) {
        eje4.push(
            <Pagination.Item key={number} onClick={() => {
                setPageEje4(number)
            }} active={number === pageEje4}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <Navigation user={sessionStorage.getItem("rol")} />
            <Form onSubmit={handleSubmit} id="form">
                <Container className="pregunta" fluid="md">
                    <h2>Eje I</h2>
                    <h2>Competencias claves</h2>
                    <h2>(30% de la evaluación)</h2>
                    <Table striped hidden={pageEje1 - 1 !== 0}>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntas[0].map((item, index) =>
                                <tr><td><Form.Check required type="radio" label={item} name="pregunta1" value={1.875 * (index + 1)} /></td></tr>)}
                        </tbody>
                    </Table>
                    <Table striped hidden={pageEje1 - 1 !== 1}>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntas[1].map((item, index) =>
                                <tr><td><Form.Check required type="radio" label={item} name="pregunta2" value={1.875 * (index + 1)} /></td></tr>)}
                        </tbody>
                    </Table>

                    <Table striped hidden={pageEje1 - 1 !== 2}>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntas[2].map((item, index) =>
                                <tr><td><Form.Check required type="radio" label={item} name="pregunta3" value={1.875 * (index + 1)} /></td></tr>)}
                        </tbody>
                    </Table>

                    <Table striped hidden={pageEje1 - 1 !== 3}>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntas[3].map((item, index) =>
                                <tr><td><Form.Check required type="radio" label={item} name="pregunta4" value={1.875 * (index + 1)} /></td></tr>)}
                        </tbody>
                    </Table>
                    <Pagination>{eje1}</Pagination>
                </Container>
                <Container fluid="md" className="pregunta">
                    <h2>Eje II</h2>
                    <h2>Desempeño de funciones clave</h2>
                    <h2>(40% de la evaluación)</h2>
                    <Form.Group>
                        <Form.Label>
                            <Table striped id="tabla1">
                                <thead>
                                    <tr>
                                        <th>Puntuación</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1% - 25%</td>
                                        <td>El colaborador tiene un cumplimiento de entregables muy por debajo de lo esperado. </td>
                                    </tr>
                                    <tr>
                                        <td>26% - 49%</td>
                                        <td>El colaborador cumple sus entregables por debajo de lo esperado.</td>
                                    </tr>
                                    <tr>
                                        <td>50% - 74%</td>
                                        <td>El colaborador cumple con sus entregables dentro de lo esperado.</td>
                                    </tr>
                                    <tr>
                                        <td>75% - 91%</td>
                                        <td>El colaborador cumple con sus entregables por encima de lo esperado con frecuencia.</td>
                                    </tr>
                                    <tr>
                                        <td>92% - 100%</td>
                                        <td>El colaborador cumple con sus entregables con excelencia siempre.</td>
                                    </tr>
                                </tbody>
                            </Table>
                            {sliderVal1}%</Form.Label>
                        <Form.Range name="pregunta5" onChange={(e) => {
                            setSliderVal1(e.target.value);
                        }} defaultValue={sliderVal1} />
                    </Form.Group>
                </Container>
                <Container fluid="md" className="pregunta">
                    <h2>Eje III</h2>
                    <h2>Perfil de adherencia a la Seguridad y Calidad</h2>
                    <h2>(20% de la evaluación)</h2>
                    <Form.Group hidden={pageEje3 - 1 !== 0}>
                        <Form.Label><Table striped id="tabla2">
                            <thead>
                                <tr>
                                    <th>Puntuación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1% - 25%</td>
                                    <td>El colaborador tiene un historial anual cumplimiento de los protocolos de HSE-Q igual o menor al 70% del cumplimiento.</td>
                                </tr>
                                <tr>
                                    <td>26% - 49%</td>
                                    <td>El colaborador tiene un historial anual cumplimiento de los protocolos de HSE-Q entre el 71% al 80% del cumplimiento.</td>
                                </tr>
                                <tr>
                                    <td>50% - 74%</td>
                                    <td>El colaborador cumple sus protocolos de HSE-Q en un 90%.</td>
                                </tr>
                                <tr>
                                    <td>75% - 91%</td>
                                    <td>El colaborador cumple con sus protocolos de HSE-Q en un 100%.</td>
                                </tr>
                                <tr>
                                    <td>92% - 100%</td>
                                    <td>El colaborador excede el cumplimiento de sus protocolos de HSEQ por encima de un 10% de lo establecido. </td>
                                </tr>
                            </tbody>
                        </Table>{results.pregunta6}%</Form.Label>
                        <Form.Range name="pregunta6" onChange={(e) => {
                            setResults({
                                ...results,
                                pregunta6: e.target.value
                            })
                        }} defaultValue={0}>
                        </Form.Range>
                    </Form.Group>

                    <Form.Group hidden={pageEje3 - 1 !== 1}>
                        <Form.Label><Table striped id="tabla3">
                            <thead>
                                <tr>
                                    <th>Puntuación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1% - 25%</td>
                                    <td>El colaborador solo participa en las actividades de HSE-Q bajo exigencia de la organización.</td>
                                </tr>
                                <tr>
                                    <td>26% - 49%</td>
                                    <td>El colaborador participa de forma voluntaria ocasionalmente en las actividades de HSE-Q. </td>
                                </tr>
                                <tr>
                                    <td>50% - 74%</td>
                                    <td>El colaborador participa de forma voluntaria frecuentemente en las actividades de HSE-Q. </td>
                                </tr>
                                <tr>
                                    <td>75% - 91%</td>
                                    <td>El colaborador participa de forma voluntaria frecuentemente en actividades de HSE-Q. Genera valor agregado (propone sugerencias, iniciativas) en materia de seguridad y calidad.</td>
                                </tr>
                                <tr>
                                    <td>92% - 100%</td>
                                    <td>El colaborador participa activamente y siempre en las actividades de HSE-Q. Genera valor agregado (propone sugerencias, iniciativas) en materia de seguridad y calidad.</td>
                                </tr>
                            </tbody>
                        </Table>{results.pregunta7}%</Form.Label>
                        <Form.Range name="pregunta7" onChange={(e) => {
                            setResults({
                                ...results,
                                pregunta7: e.target.value
                            })
                        }} defaultValue={0}>
                        </Form.Range>
                    </Form.Group>

                    <Form.Group hidden={pageEje3 - 1 !== 2}>
                        <Form.Label><Table striped id="tabla4">
                            <thead>
                                <tr>
                                    <th>Puntuación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1% - 25%</td>
                                    <td>El colaborador ha estado involucrado por lo menos en un (1) incidente de seguridad y/o calidad de gravedad leve, con llamados de atención y/o amonestaciones por escrito, ha requerido participación en el Programa de Reforzamiento en HSE-Q.</td>
                                </tr>
                                <tr>
                                    <td>26% - 49%</td>
                                    <td>El colaborador ha recibido por lo menos una (1) amonestación escrita por desvíos de la norma, ha necesitado participar en el Programa de Reforzamiento en HSE-Q.</td>
                                </tr>
                                <tr>
                                    <td>50% - 74%</td>
                                    <td>El colaborador ha recibido por lo menos un (1) llamado de atención verbal por desvíos de la norma, ha necesitado participar en el Programa de Reforzamiento en HSE-Q.</td>
                                </tr>
                                <tr>
                                    <td>75% - 91%</td>
                                    <td>El colaborador nunca ha estado involucrado en incidentes de seguridad y/o calidad, tampoco ha necesitado participar en el Programa de Reforzamiento en HSE-Q.</td>
                                </tr>
                                <tr>
                                    <td>92% - 100%</td>
                                    <td>El colaborador nunca ha estado involucrado en incidentes de seguridad y/o calidad, ayuda en su prevención, tampoco ha necesitado participar en el Programa de Reforzamiento en HSE-Q. sirve de mentor en materia de HSE-Q</td>
                                </tr>
                            </tbody>
                        </Table>{results.pregunta8}%</Form.Label>
                        <Form.Range name="pregunta8" onChange={(e) => {
                            setResults({
                                ...results,
                                pregunta8: e.target.value
                            })
                        }} defaultValue={0}>
                        </Form.Range>
                    </Form.Group>
                    <Pagination>{eje3}</Pagination>
                </Container>
                <Container fluid="md" className="pregunta">
                    <h2>Eje IV</h2>
                    <h2>Credibilidad Técnica</h2>
                    <h2>(10% de la evaluación)</h2>
                    <Form.Group hidden={pageEje4 - 1 !== 0}>
                        <Form.Label><Table striped id="tabla5">
                            <thead>
                                <tr>
                                    <th>Puntuación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1% - 25%</td>
                                    <td>El colaborador tiene educación y/o experiencia muy por debajo de lo esperado para la posición que ocupa.</td>
                                </tr>
                                <tr>
                                    <td>26% - 49%</td>
                                    <td>El colaborador tiene educación y/o experiencia por debajo de lo esperado para la posición que ocupa.</td>
                                </tr>
                                <tr>
                                    <td>50% - 74%</td>
                                    <td>El colaborador tiene educación y/o experiencia dentro de lo esperado para la posición que ocupa.</td>
                                </tr>
                                <tr>
                                    <td>75% - 91%</td>
                                    <td>El colaborador tiene educación y/o experiencia por encima de lo esperado para la posición que ocupa.</td>
                                </tr>
                                <tr>
                                    <td>92% - 100%</td>
                                    <td>El colaborador tiene educación y/o experiencia muy por encima de lo esperado para la posición que ocupa.</td>
                                </tr>
                            </tbody>
                        </Table>{results.pregunta9}%</Form.Label>
                        <Form.Range name="pregunta9" onChange={(e) => {
                            setResults({
                                ...results,
                                pregunta9: e.target.value
                            })
                        }} defaultValue={0}>
                        </Form.Range>
                    </Form.Group>
                    <Form.Group hidden={pageEje4 - 1 !== 1}>
                        <Form.Label><Table striped id="tabla6">
                            <thead>
                                <tr>
                                    <th>Puntuación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1% - 25%</td>
                                    <td>El colaborador tiene poco conocimiento del trabajo que realiza.</td>
                                </tr>
                                <tr>
                                    <td>26% - 49%</td>
                                    <td>El colaborador tiene conocimiento básico del trabajo que realiza.</td>
                                </tr>
                                <tr>
                                    <td>50% - 74%</td>
                                    <td>El colaborador tiene conocimiento adecuado del trabajo que realiza.</td>
                                </tr>
                                <tr>
                                    <td>75% - 91%</td>
                                    <td>El colaborador tiene amplio conocimiento del trabajo que realiza.</td>
                                </tr>
                                <tr>
                                    <td>92% - 100%</td>
                                    <td>El colaborador tiene profundo y excelente conocimiento del trabajo que realiza.</td>
                                </tr>
                            </tbody>
                        </Table>{results.pregunta10}%</Form.Label>
                        <Form.Range name="pregunta10" onChange={(e) => {
                            setResults({
                                ...results,
                                pregunta10: e.target.value
                            })
                        }} defaultValue={0} >
                        </Form.Range>
                    </Form.Group>
                    <Pagination>{eje4}</Pagination>
                </Container>
                <Button onClick={() => setShow(true)} className="mt-3">Enviar</Button>
            </Form >

            <Modal
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>¿Enviar evaluación?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Los resultados no se pueden cambiar una vez enviados.
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit}>Enviar</Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )

}

export default Evaluacion;