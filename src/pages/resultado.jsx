import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import calcularPuntuacionPorItems from '../utils/calcularPuntuacionPorItems';
import './Resultado.css';
import MapaClinicas from '../components/MapaClinicas';
import { useGoogleLogin } from '@react-oauth/google';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import imagenGoogleFit from '../assets/googlefit.png'; 

export default function Resultado() {
    const navigate = useNavigate();
    const [resultado, setResultado] = useState(null);
    const [edad, setEdad] = useState('');
    const [ocupacion, setOcupacion] = useState('');
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [sleepData, setSleepData] = useState(null);
    const [loadingSleep, setLoadingSleep] = useState(false);

    useEffect(() => {
        const respuestas = JSON.parse(localStorage.getItem('respuestas'));
        if (!respuestas) {
            navigate('/');
        } else {
            const { total, diagnostico } = calcularPuntuacionPorItems(respuestas);
            setResultado({ puntuacion: total, nivel: 'Pre-diagnóstico', descripcion: diagnostico });
        }
    }, [navigate]);

    const enviar = () => {
        if (edad && ocupacion) {
            setMostrarResultado(true);
        }
    };

    const volverInicio = () => {
        navigate('/');
    };

    // Consulta sesiones de sueño usando el endpoint /sessions
    async function obtenerSesionesSueno(accessToken, dias = 7) {
        const now = Date.now();
        const desde = now - dias * 24 * 60 * 60 * 1000;

        const response = await fetch(
            `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(desde).toISOString()}&endTime=${new Date(now).toISOString()}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const json = await response.json();
        console.log("Sesiones Google Fit:", json);

        const segmentos = [];
        if (json.session) {
            json.session.forEach(session => {
                if (session.activityType === 72) { // 72 = dormir
                    segmentos.push({
                        name: session.name || "Sueño",
                        startTimeMillis: session.startTimeMillis,
                        endTimeMillis: session.endTimeMillis,
                        from: new Date(Number(session.startTimeMillis)).toLocaleString(),
                        to: new Date(Number(session.endTimeMillis)).toLocaleString()
                    });
                }
            });
        }
        return segmentos;
    }

    const googleFitLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/fitness.sleep.read',
        onSuccess: async tokenResponse => {
            setLoadingSleep(true);
            setSleepData(null);
            try {
                const segmentos = await obtenerSesionesSueno(tokenResponse.access_token, 7);
                if (segmentos.length > 0) {
                    setSleepData(segmentos);
                } else {
                    setSleepData("No se encontraron sesiones de sueño en la última semana.");
                }
            } catch (error) {
                console.error(error);
                setSleepData("Error al obtener sesiones de sueño. Verifica permisos o conexión.");
            } finally {
                setLoadingSleep(false);
            }
        },
        onError: error => {
            console.error(error);
            setSleepData("No se pudo conectar con Google Fit.");
        }
    });

    function getSleepStats(sleepData) {
        if (!Array.isArray(sleepData) || sleepData.length === 0) return null;

        const horasPorDia = sleepData.map(seg => {
            const inicio = new Date(Number(seg.startTimeMillis));
            const fin = new Date(Number(seg.endTimeMillis));
            const fecha = inicio.toLocaleDateString();
            const horas = (fin - inicio) / (1000 * 60 * 60);
            return { fecha, horas };
        }).filter(d => d.horas > 0);

        if (horasPorDia.length === 0) return null;

        const promedio = (horasPorDia.reduce((acc, d) => acc + d.horas, 0) / horasPorDia.length).toFixed(2);
        const mejor = horasPorDia.reduce((a, b) => (a.horas > b.horas ? a : b));
        const peor = horasPorDia.reduce((a, b) => (a.horas < b.horas ? a : b));

        // Marca mejor y peor día
        const horasMarcadas = horasPorDia.map(d => ({
            ...d,
            tipo: d.fecha === mejor.fecha ? "mejor" : d.fecha === peor.fecha ? "peor" : "normal"
        }));

        return { horasPorDia: horasMarcadas, promedio, mejor, peor };
    }

    const sleepStats = Array.isArray(sleepData) ? getSleepStats(sleepData) : null;

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

                        {!sleepData && !loadingSleep ? (
                                <button onClick={googleFitLogin} className="btn-googlefit">
                                    <img
                                        src={imagenGoogleFit}
                                        alt="Google Fit"
                                        className="icono-fit"
                                    />
                                    Sincronizar Sueño con Google Fit
                                </button>
                        ) : loadingSleep ? (
                            <p>Cargando sesiones de sueño...</p>
                        ) : (
                            <div className="datos-sueno">
                                <h4>Sesiones de sueño en la última semana:</h4>
                                {Array.isArray(sleepData) ? (
                                    <ul>
                                        {sleepData.map((segmento, index) => (
                                            <li key={index}>
                                                {segmento.name}:<br />
                                                Desde: {segmento.from} <br />
                                                Hasta: {segmento.to}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{sleepData}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {sleepStats && (
                        <div className="feedback-sueno">
                            <h4>Resumen de tu semana de sueño:</h4>
                            <p>
                                Promedio de horas dormidas: <strong>{sleepStats.promedio} h</strong>
                            </p>
                            <p>
                                Mejor descanso: <strong>{sleepStats.mejor.fecha}</strong> ({sleepStats.mejor.horas.toFixed(2)} h)<br />
                                Peor descanso: <strong>{sleepStats.peor.fecha}</strong> ({sleepStats.peor.horas.toFixed(2)} h)
                            </p>

                            {sleepStats.horasPorDia.some(d => d.horas < 6) && (
                                <div className="alerta-sueno">
                                    <strong>¡Alerta!</strong> Dormiste menos de 6 horas en al menos un día.
                                </div>
                            )}

                            <div className="consejos-sueno">
                                <h5>Consejos para mejorar tu descanso:</h5>
                                <ul>
                                    {parseFloat(sleepStats.promedio) < 7 && (
                                        <li>Intenta dormir al menos 7 horas cada noche.</li>
                                    )}
                                    {sleepStats.mejor.horas - sleepStats.peor.horas > 2 && (
                                        <li>Mantén horarios más regulares, tus descansos son muy variables.</li>
                                    )}
                                    <li>Evita pantallas y cafeína antes de dormir.</li>
                                    <li>Mantén tu habitación oscura y fresca.</li>
                                    <li>Haz una rutina relajante antes de acostarte.</li>
                                </ul>
                            </div>

                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={sleepStats.horasPorDia}>
                                        <XAxis dataKey="fecha" />
                                        <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Bar dataKey="horas">
                                            {sleepStats.horasPorDia.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        entry.tipo === "mejor" ? "green" :
                                                            entry.tipo === "peor" ? "red" : "#8884d8"
                                                    }
                                                />
                                            ))}
                                            <LabelList dataKey="horas" position="top" formatter={v => v.toFixed(1)} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
