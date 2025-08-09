import React from 'react';

export default function Pregunta({ pregunta, onRespuesta }) {
    return (
        <div>
            <p>{pregunta.texto}</p>
            {pregunta.opciones.map(op => (
                <label key={op}>
                    <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        value={op}
                        onChange={() => onRespuesta(pregunta.id, op)}
                    />
                    {op}
                </label>
            ))}
        </div>
    );
}
