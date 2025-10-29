import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './resultado.css';
import MapaClinicas from '../components/MapaClinicas.jsx';
import { useGoogleLogin } from '@react-oauth/google';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { fakeDataNormal, fakeDataApnea, fakeDataPerfecto } from '../data/fakeSleepData';
import imagenGoogleFit from '../assets/googlefit.png'; 
import { evaluacionPuntaje } from '../../scripts/evaluacionPuntaje';

export default function Resultado() {
    const navigate = useNavigate();
    const [edad, setEdad] = useState('');
    const [ocupacion, setOcupacion] = useState('');
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [sleepData, setSleepData] = useState(null);
    const [loadingSleep, setLoadingSleep] = useState(false);
    const [modoPrueba, setModoPrueba] = useState("real"); // "real" = Google Fit

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
                let segmentos;
                if (modoPrueba === "normal") {
                    segmentos = fakeDataNormal;
                } else if (modoPrueba === "apnea") {
                    segmentos = fakeDataApnea;
                } else if (modoPrueba === "perfecto") {
                    segmentos = fakeDataPerfecto;
                } else {
                    segmentos = await obtenerSesionesSueno(tokenResponse.access_token, 7);
                }

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
    const volverInicio = () => {
        navigate('/');
    };


    const sleepStats = Array.isArray(sleepData) ? getSleepStats(sleepData) : null;

    const puntajeTotal = localStorage.getItem('puntajeTotal');

    const nivel = 'Pre-Diagnóstico';

    const diagnostico = evaluacionPuntaje(Number(puntajeTotal));

    return (
        <div className="resultado-container">
                <div className="resultado-tarjeta fade-in">
                    <h2>Resultado del Test</h2>
                    <p className="puntuacion">Puntuación total: <strong>{puntajeTotal}</strong></p>
                    <p className="nivel">{nivel}</p>
                    <p className="descripcion">{diagnostico}</p>
                    <p className="extra">Edad: {edad} años | Ocupación: {ocupacion}</p>
                    <button className="btn-volver" onClick={volverInicio}>Volver al inicio</button>

                    {puntajeTotal >= 6 && (
                        <div className="mapa-sugerido fade-in">
                            <h3 style={{ marginTop: "2rem" }}>Ubica tu clínica del sueño más cercana</h3>
                            <MapaClinicas />
                        </div>
                    )}

                    <div className="googlefit-opcional fade-in" style={{ marginTop: "3rem" }}>
                        <h3>¿Quieres complementar tu resultado con datos reales de Google Fit?</h3>
                        <p>Este paso es opcional y ayuda a validar tu calidad de sueño real.</p>

                        {/* Selector de modo de prueba */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Modo de prueba: </label>
                            <select value={modoPrueba} onChange={e => setModoPrueba(e.target.value)}>
                                <option value="real">Datos Reales Google Fit</option>
                                <option value="normal">Dataset Normal</option>
                                <option value="apnea">Dataset Apnea</option>
                                <option value="perfecto">Dataset Perfecto</option>
                            </select>
                        </div>


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
                                <h5>Consejos personalizados basados en guías clínicas:</h5>
                                <ul>
                                    {parseFloat(sleepStats.promedio) < 7 && (
                                        <li>
                                            Según la <strong>Clínica de Trastornos del Sueño de la UNAM</strong>,
                                            los adultos deben dormir entre 7 y 9 horas. Considera ajustar tus horarios.
                                        </li>
                                    )}
                                    {sleepStats.horasPorDia.some(d => d.horas < 5) && (
                                        <li>
                                            Dormir menos de 5 horas por noche, como advierte el <strong>IMMIS</strong>,
                                            aumenta riesgo de hipertensión, diabetes y accidentes laborales.
                                        </li>
                                    )}
                                    {sleepStats.mejor.horas - sleepStats.peor.horas > 2 && (
                                        <li>
                                            Tus horarios de sueño son muy variables. La <strong>Clínica del Sueño del CMNO IMSS</strong>
                                            recomienda mantener horarios fijos para mejorar la calidad del descanso.
                                        </li>
                                    )}
                                    {sleepStats.horasPorDia.length >= 5 && sleepStats.horasPorDia.filter(d => d.horas < 6).length >= 3 && (
                                        <li>
                                            Dormir menos de 6 horas de manera frecuente puede ser signo de insomnio crónico.
                                            El <strong>Centro Médico Nacional de Occidente</strong> recomienda evaluación clínica si persiste más de 3 meses.
                                        </li>
                                    )}
                                    <li>
                                        Evita pantallas y cafeína antes de dormir (recomendación general de la
                                        <strong> Sociedad Mexicana de Medicina del Sueño</strong>).
                                    </li>
                                    <li>
                                        Mantén tu habitación oscura, silenciosa y fresca — higiene del sueño validada por
                                        <strong> clínicas certificadas en México</strong>.
                                    </li>
                                </ul>
                            </div>

                            {sleepStats && (
                                <div className="alerta-apnea fade-in">
                                    {parseFloat(sleepStats.promedio) < 6 && sleepStats.horasPorDia.filter(d => d.horas < 5).length >= 2 && (
                                        <div className="apnea-box">
                                            <h5>⚠️ Posible riesgo de apnea del sueño</h5>
                                            <p>
                                                Detectamos que tu promedio de sueño es bajo y presentas varios días con
                                                menos de 5 horas de descanso.
                                                Según la <strong>Clínica del Sueño de la UNAM</strong> y el
                                                <strong> Centro Médico Nacional de Occidente (IMSS)</strong>,
                                                estos son indicadores comunes de <em>trastornos respiratorios del sueño</em> como la apnea.
                                            </p>
                                            <p>
                                                Te recomendamos agendar una evaluación en una clínica certificada
                                                si presentas además síntomas como ronquidos fuertes, pausas respiratorias
                                                o somnolencia excesiva durante el día.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

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
        </div>
    );
}
