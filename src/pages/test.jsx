
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Test.css';
import './resultado.css';
import { getPreguntas } from '../data/getPreguntas';
import preguntasOpciones from '../data/preguntas';
import { valoresPreguntas } from '../data/valorRespuestas';
import { postPreguntas } from '../data/postRespuestas';
import { postUser } from '../data/postUser';
import { postEvaluacion } from '../data/postEvaluacion';

 // Duración del fade en ms
export default function Test() {
    const [showForm, setShowForm] = useState(true);
    const [genero, setGenero] = useState("");
    const [oficio, setOficio] = useState("");
    const [edad, setEdad] = useState(""); // Estado para la edad
    const [idUser, setIdUser] = useState(null);
    const [indice, setIndice] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();
    const [preguntas, setPreguntas] = useState([]);
    const actual = preguntas[indice] || {};
    

    useEffect(() => {
        setFade(true);
    }, [indice]);

    useEffect(() => {
        getPreguntas().then(data => {
            // Cruza las preguntas de la API con las opciones locales
            const preguntasConOpciones = data.map((pregunta, idx) => {
                // Busca la pregunta local que coincide por índice
                const local = preguntasOpciones[idx];
                return {
                    ...pregunta,
                    opciones: local ? local.opciones : []
                };
            });
            setPreguntas(preguntasConOpciones);
        });
    }, []);

    const selectOption = valor =>
        setRespuestas({ ...respuestas, [actual.idPregunta]: valor });

    const next = () => {
        setFade(false);
        setTimeout(async () => {
            if (indice < preguntas.length - 1) {
                setIndice(indice + 1);
            } else {
                localStorage.setItem('respuestas', JSON.stringify(respuestas));
                // Construir el array de respuestas para la API incluyendo el texto
                const respuestasArray = Object.entries(respuestas).map(([preguntaId, textoSeleccionado]) => ({
                    preguntaId: Number(preguntaId),
                    valor: valoresPreguntas[preguntaId]?.[textoSeleccionado] ?? 0,
                    texto: textoSeleccionado
                }));
                const usuarioId = Number(localStorage.getItem('iduser')) || idUser;
                try {
                    console.log('Enviando a postPreguntas:', { usuarioId, respuestas: respuestasArray });
                    await postPreguntas(usuarioId, respuestasArray);
                    await postEvaluacion(usuarioId, respuestasArray);
                } catch (error) {
                    console.error('Error al enviar respuestas:', error);
                }
                
                navigate('/resultado');
            }
        }, 300);
    };

    // Si necesitas mantener la lógica de isVertical, ajusta según el idPregunta o tipo
    const isVertical = true;

    // Mostrar formulario antes del test
    // Renderizado condicional en JSX para evitar error de hooks
    return (
        <div className='resultado-container'>
            {showForm ? (
                <div className="datos-form">
                    <h2>Antes de iniciar el test</h2>
                    <form
                        onSubmit={async e => {
                            e.preventDefault();
                            const id = await postUser({ genero, edad, oficio });
                            setIdUser(id);
                            localStorage.setItem('iduser', id);
                            setShowForm(false);
                        }}
                    >
                        <select value={genero} onChange={e => setGenero(e.target.value)} required>
                            <option value="">Género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <select value={edad} onChange={e => setEdad(e.target.value)} required>
                            <option value="">Edad</option>
                            {[...Array(64)].map((_, i) => (
                                <option key={i + 17} value={i + 17}>{i + 17}</option>
                            ))}
                        </select>
                        <select value={oficio} onChange={e => setOficio(e.target.value)} required>
                            <option value="">Ocupación</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Empleado">Empleado</option>
                            <option value="Desempleado">Desempleado</option>
                            <option value="Médico">Médico</option>
                            <option value="Profesor">Profesor</option>
                            <option value="Comerciante">Comerciante</option>
                            <option value="Obrero">Obrero</option>
                            <option value="Conductor">Conductor</option>
                            <option value="Mecánico">Mecánico</option>
                            <option value="Mesero">Mesero</option>
                            <option value="Ama de casa">Ama de casa</option>
                        </select>
                        <button type="submit" className='btn-enviar'>Comenzar test</button>
                    </form>
                </div>
            ) : (
                <div className="test-container">
                    <div className={`test-card ${fade ? 'fade-in' : 'fade-out'}`}>
                        <h2 className="pregunta-titulo">{actual.texto}</h2>
                        <div className={`opciones-container ${isVertical ? 'vertical' : 'grid'}`}>
                            {actual.opciones && actual.opciones.map(op => (
                                <button
                                    key={op}
                                    className={`btn-opcion ${respuestas[actual.idPregunta] === op ? 'selected' : ''}`}
                                    onClick={() => selectOption(op)}
                                >
                                    {op}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn-siguiente"
                            disabled={!respuestas[actual.idPregunta]}
                            onClick={next}
                        >
                            {indice < preguntas.length - 1 ? 'Siguiente' : 'Enviar'}
                        </button>
                        <div className="progreso">Pregunta {indice + 1} de {preguntas.length}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
