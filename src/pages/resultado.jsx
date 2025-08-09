import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import calcularPuntuacionPorItems from '../utils/calcularPuntuacionPorItems';
import './Resultado.css';
import MapaClinicas from '../components/MapaClinicas';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Resultado() {
    const navigate = useNavigate();
    const [resultado, setResultado] = useState(null);
    const [edad, setEdad] = useState('');
    const [ocupacion, setOcupacion] = useState('');
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [sleepData, setSleepData] = useState(null);

    useEffect(() => {
        const respuestas = JSON.parse(localStorage.getItem('respuestas'));
        if (!respuestas) {
            navigate('/');
        } else {
            const { total, diagnostico } = calcularPuntuacionPorItems(respuestas);
            setResultado({ puntuacion: total, nivel: 'Pre-diagnóstico', descripcion: diagnostico });
        }
    }, []);

    const enviar = () => {
        if (edad && ocupacion) {
            setMostrarResultado(true);
        }
    };

    const volverInicio = () => {
        navigate('/');
    };

    const obtenerDatosSueno = async (accessToken) => {
        const now = Date.now();
        const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000;

        const fetchSleepSegment = async () => {
            return axios.post(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    aggregateBy: [{ dataTypeName: "com.google.sleep.segment" }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis: fiveDaysAgo,
                    endTimeMillis: now
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        };

        const fetchActivitySegment = async () => {
            return axios.post(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    aggregateBy: [{ dataTypeName: "com.google.activity.segment" }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis: fiveDaysAgo,
                    endTimeMillis: now
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        };

        try {
            // 1️⃣ Intentar con sleep.segment
            const sleepResp = await fetchSleepSegment();
            let segments = sleepResp.data.bucket.flatMap(bucket =>
                bucket.dataset.flatMap(ds => ds.point)
            );

            // 2️⃣ Si no hay datos, intentar con activity.segment (manual)
            if (segments.length === 0) {
                const activityResp = await fetchActivitySegment();
                segments = activityResp.data.bucket.flatMap(bucket =>
                    bucket.dataset.flatMap(ds => ds.point)
                ).filter(point => point.value?.[0]?.intVal === 72); // 72 = dormir
            }

            // 3️⃣ Mostrar resultados
            if (segments.length > 0) {
                setSleepData(segments);
            } else {
                setSleepData("No se encontraron datos de sueño (manuales o automáticos) en los últimos 5 días.");
            }

        } catch (error) {
            console.error("Error al obtener datos de sueño:", error.response?.data || error.message);
            setSleepData("Error al obtener datos de sueño. Verifica permisos o conexión.");
        }
    };


    const googleFitLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/fitness.sleep.read',
        onSuccess: tokenResponse => {
            console.log("Token de acceso recibido:", tokenResponse);
            obtenerDatosSueno(tokenResponse.access_token);
        },
        onError: error => {
            console.error('Error en login con Google Fit:', error);
            setSleepData("No se pudo conectar con Google Fit.");
        }
    });

    return (
        <div className="resultado-container">
            {!mostrarResultado ? (
                <div className="datos-form">
                    <h2>Antes de ver tu resultado final</h2>
                    <p>Por favor, selecciona tu edad y ocupación:</p>
                    <select value={edad} onChange={e => setEdad(e.target.value)} required>
                        <option value="">Edad</option>
                        {[...Array(64)].map((_, i) => (
                            <option key={i + 17} value={i + 17}>{i + 17}</option>
                        ))}
                    </select>

                    <select value={ocupacion} onChange={e => setOcupacion(e.target.value)} required>
                        <option value="">Ocupación</option>
                        {[
                            'Médico', 'Profesor', 'Empleado en oficina', 'Comerciante', 'Obrero',
                            'Conductor', 'Mecánico', 'Mesero', 'Estudiante', 'Ama de casa', 'Desempleado'
                        ].map((op, i) => (
                            <option key={i} value={op}>{op}</option>
                        ))}
                    </select>

                    <button onClick={enviar} className="btn-enviar">Ver Resultado</button>
                </div>
            ) : (
                <div className="resultado-tarjeta fade-in">
                    <h2>Resultado del Test</h2>
                    <p className="puntuacion">Puntuación total: <strong>{resultado.puntuacion}</strong></p>
                    <p className="nivel">{resultado.nivel}</p>
                    <p className="descripcion">{resultado.descripcion}</p>
                    <p className="extra">Edad: {edad} años | Ocupación: {ocupacion}</p>
                    <button className="btn-volver" onClick={volverInicio}>Volver al inicio</button>

                    {resultado.puntuacion >= 6 && (
                        <div className="mapa-sugerido fade-in">
                            <h3 style={{ marginTop: "2rem" }}>Ubica tu clínica del sueño más cercana</h3>
                            <MapaClinicas />
                        </div>
                    )}

                    <div className="googlefit-opcional fade-in" style={{ marginTop: "3rem" }}>
                        <h3>¿Quieres complementar tu resultado con datos reales de Google Fit?</h3>
                        <p>Este paso es opcional y ayuda a validar tu calidad de sueño real.</p>

                        {!sleepData ? (
                            <button onClick={googleFitLogin} className="google-fit-btn">
                                <img
                                    src="https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfhjBQ5wIqyC1l1ssY1jq2kyZQ=w50-h50"
                                    alt="Google Fit"
                                    style={{ marginRight: "10px", width: "24px" }}
                                />
                                Conectar con Google Fit
                            </button>
                        ) : (
                            <div className="datos-sueno">
                                <h4>Duración de sueño últimos 5 días:</h4>
                                {typeof sleepData === 'string' ? (
                                    <p>{sleepData}</p>
                                ) : (
                                    <ul>
                                        {sleepData.map((dia, i) => (
                                            <li key={i}>
                                                {dia.fecha}: {dia.horas} h
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
