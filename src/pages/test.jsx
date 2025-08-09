import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import preguntas from '../data/preguntas';
import './Test.css';

export default function Test() {
    const [indice, setIndice] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();
    const actual = preguntas[indice];

    useEffect(() => {
        setFade(true);
    }, [indice]);

    const selectOption = valor =>
        setRespuestas({ ...respuestas, [actual.id]: valor });

    const next = () => {
        setFade(false);
        setTimeout(() => {
            if (indice < preguntas.length - 1) {
                setIndice(indice + 1);
            } else {
                localStorage.setItem('respuestas', JSON.stringify(respuestas));
                navigate('/resultado');
            }
        }, 300);
    };

    const isVertical = !['p1', 'p3'].includes(actual.id);

    return (
        <div className="test-container">
            <div className={`test-card ${fade ? 'fade-in' : 'fade-out'}`}>
                <h2 className="pregunta-titulo">{actual.texto}</h2>
                <div className={`opciones-container ${isVertical ? 'vertical' : 'grid'}`}>
                    {actual.opciones.map(op => (
                        <button
                            key={op}
                            className={`btn-opcion ${respuestas[actual.id] === op ? 'selected' : ''}`}
                            onClick={() => selectOption(op)}
                        >
                            {op}
                        </button>
                    ))}
                </div>
                <button
                    className="btn-siguiente"
                    disabled={!respuestas[actual.id]}
                    onClick={next}
                >
                    {indice < preguntas.length - 1 ? 'Siguiente' : 'Enviar'}
                </button>
                <div className="progreso">Pregunta {indice + 1} de {preguntas.length}</div>
            </div>
        </div>
    );
}
