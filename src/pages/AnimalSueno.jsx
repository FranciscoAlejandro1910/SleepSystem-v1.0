﻿import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './AnimalSueno.css';
import imagenGoogleFit from '../assets/googlefit.png';

export default function AnimalSueno() {
    const [animalDetectado, setAnimalDetectado] = useState(null);
    const [sleepData, setSleepData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualData, setManualData] = useState({ horas: "", regularidad: "", horaDormir: "" });
    const navigate = useNavigate();

    // Lista de animales con slogan
    const animales = [
        { nombre: "Koala", icono: "🐨", slogan: "Dormilón profundo", corta: "Duermes mucho y profundamente, como un koala.", larga: "El Koala es un símbolo de un sueño profundo y prolongado. Aunque suele acostarse tarde, una vez dormido no hay nada que lo despierte. Este animal representa a quienes tienen un descanso sólido, con fases profundas dominantes. Si eres un Koala, tu cuerpo logra una recuperación física efectiva, pero podrías mejorar tu sincronización con el día." },
        { nombre: "Tiburón", icono: "🦈", slogan: "Inquieto nocturno", corta: "Duermes poco y siempre en alerta, como un tiburón.", larga: "El Tiburón representa a quienes duermen tarde y muy poco. Su mente permanece activa incluso durante el sueño, lo que genera un descanso fragmentado y superficial. Este animal simboliza a los durmientes que luchan por desconectarse del estrés diario, con pensamientos que giran sin cesar. Si eres un Tiburón, probablemente te cueste conciliar el sueño y te despiertes varias veces durante la noche." },
        { nombre: "Búho", icono: "🦉", slogan: "Noctámbulo en alerta", corta: "Te acuestas muy tarde, eres nocturno como un búho.", larga: "El Búho encarna a los trasnochadores. Su sueño es ligero y permanece en estado de alerta durante gran parte de la noche. Este animal representa a quienes tiene un ritmo de vida circadiano desplazado, prefieren actividades nocturnas y suelen dormir en horarios irregulares." },
        { nombre: "Pingüino", icono: "🐧", slogan: "Eficiente pero frágil", corta: "Tu sueño es inestable, como el andar de un pingüino.", larga: "El Pingüino duerme rápido y bien, pero su sueño es ligero y se interrumpe fácilmente. Este animal representa a quienes tienen la facilidad para conciliar el sueño, pero cualquier ruido, luz o cambio de temperatura puede despertarlos. Aunque el descanso puede parecer suficiente, la falta de continuidad afecta la recuperación total de energía." },
        { nombre: "Oso Pardo", icono: "🐻", slogan: "Durmiente ideal", corta: "Tienes un sueño estable y reparador, como un oso.", larga: "El Oso Pardo es el arquetipo del sueño saludable. Representa a quienes tienen hábitos constantes, se acuestan y despiertan a horas regulares, y disfrutan de un sueño profundo y reparador. Este animal es símbolo de equilibrio y bienestar. Tu cuerpo y mente están sincronizados para descansar plenamente." },
        { nombre: "Oveja", icono: "🐑", slogan: "Disciplinado pero vulnerable", corta: "Descansas lo justo, como una oveja que sigue su rutina.", larga: "La Oveja se acuesta temprano y sigue buenos hábitos, pero su sueño es breve y se interrumpe con facilidad. Este animal representa a quienes hacer todo 'bien' en teoría, pero aún no logran descansar plenamente. Puede haber factores como ansiedad, estrés o falta de sueño profundo que afectan la calidad del sueño. " }
    ];

    // Obtener sesiones de sueño de Google Fit
    async function obtenerSesionesSueno(accessToken, dias = 7) {
        const now = Date.now();
        const desde = now - dias * 24 * 60 * 60 * 1000;

        const response = await fetch(
            `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(desde).toISOString()}&endTime=${new Date(now).toISOString()}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
            }
        );

        const json = await response.json();
        if (!json.session) return [];

        return json.session
            .filter(s => s.activityType === 72)
            .map(s => ({ start: Number(s.startTimeMillis), end: Number(s.endTimeMillis) }));
    }

    // Clasificar con Google Fit
    function clasificarAnimal(segmentos) {
        if (segmentos.length === 0) return null;
        const horasPorDia = segmentos.map(s => (s.end - s.start) / (1000 * 60 * 60));
        const promedio = horasPorDia.reduce((a, b) => a + b, 0) / horasPorDia.length;
        const max = Math.max(...horasPorDia);
        const min = Math.min(...horasPorDia);
        const variacion = max - min;
        const startHoras = segmentos.map(s => new Date(s.start).getHours());
        const promedioInicio = startHoras.reduce((a, b) => a + b, 0) / startHoras.length;

        if (promedio >= 8) return animales.find(a => a.nombre === "Koala");
        if (promedio < 5.5) return animales.find(a => a.nombre === "Tiburón");
        if (promedioInicio >= 0 && promedioInicio <= 3) return animales.find(a => a.nombre === "Búho");
        if (variacion > 2) return animales.find(a => a.nombre === "Pingüino");
        if (promedio >= 6.5 && promedio <= 8 && variacion <= 1.5) return animales.find(a => a.nombre === "Oso Pardo");
        return animales.find(a => a.nombre === "Oveja");
    }

    // Clasificar con datos manuales
    function clasificarManual() {
        const horas = parseFloat(manualData.horas);
        const horaDormir = parseInt(manualData.horaDormir, 10);
        const regularidad = manualData.regularidad;

        if (isNaN(horas) || isNaN(horaDormir) || !regularidad) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (horas >= 8) setAnimalDetectado(animales.find(a => a.nombre === "Koala"));
        else if (horas < 5.5) setAnimalDetectado(animales.find(a => a.nombre === "Tiburón"));
        else if (horaDormir >= 0 && horaDormir <= 3) setAnimalDetectado(animales.find(a => a.nombre === "Búho"));
        else if (regularidad === "irregular") setAnimalDetectado(animales.find(a => a.nombre === "Pingüino"));
        else if (horas >= 6.5 && horas <= 8 && regularidad === "regular") setAnimalDetectado(animales.find(a => a.nombre === "Oso Pardo"));
        else setAnimalDetectado(animales.find(a => a.nombre === "Oveja"));
    }

    // Login con Google Fit
    const googleFitLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/fitness.sleep.read',
        onSuccess: async tokenResponse => {
            setLoading(true);
            try {
                const segmentos = await obtenerSesionesSueno(tokenResponse.access_token, 7);
                setSleepData(segmentos);
                const animal = clasificarAnimal(segmentos);
                setAnimalDetectado(animal);
            } catch (error) {
                console.error("Error obteniendo datos de Google Fit:", error);
            } finally {
                setLoading(false);
            }
        }
    });

    // Opciones de horas (1–10)
    const opcionesHoras = Array.from({ length: 10 }, (_, i) => i + 1);

    // Opciones de hora dormir (9 p.m. – 3 a.m.)
    const opcionesHoraDormir = [
        { value: 21, label: "9:00 p.m." },
        { value: 22, label: "10:00 p.m." },
        { value: 23, label: "11:00 p.m." },
        { value: 0, label: "12:00 a.m." },
        { value: 1, label: "1:00 a.m." },
        { value: 2, label: "2:00 a.m." },
        { value: 3, label: "3:00 a.m." }
    ];

    return (
        <div className="animal-sueno-container">
            <h2>Descubre tu Animal del Sueño</h2>
            <p><strong>Puedes conectar tu cuenta de Google Fit o responder manualmente.</strong></p>

            {/* Botón Google Fit */}
            {!animalDetectado && !sleepData && !loading && (
                <button onClick={googleFitLogin} className="btn-googlefit">
                    <img src={imagenGoogleFit} alt="Google Fit" className="icono-fit" />
                    Sincronizar Sueño con Google Fit
                </button>
            )}

            {loading && <p>Cargando tus datos de sueño...</p>}

            {/* Formulario manual */}
            {!animalDetectado && (
                <div className="animal-manual-form">
                    <h3>¿No usas Google Fit?</h3>
                    <p style={{ textAlign: "center" }}>Responde estas preguntas rápidas:</p>

                    <label>Horas promedio de sueño:</label>
                    <select
                        value={manualData.horas}
                        onChange={e => setManualData({ ...manualData, horas: e.target.value })}
                    >
                        <option value="">Selecciona</option>
                        {opcionesHoras.map(h => (
                            <option key={h} value={h}>{h} h</option>
                        ))}
                    </select>

                    <label>¿Tu sueño es regular?</label>
                    <select
                        value={manualData.regularidad}
                        onChange={e => setManualData({ ...manualData, regularidad: e.target.value })}
                    >
                        <option value="">Selecciona</option>
                        <option value="regular">Regular</option>
                        <option value="irregular">Irregular</option>
                    </select>

                    <label>¿A qué hora te acuestas normalmente?</label>
                    <select
                        value={manualData.horaDormir}
                        onChange={e => setManualData({ ...manualData, horaDormir: e.target.value })}
                    >
                        <option value="">Selecciona</option>
                        {opcionesHoraDormir.map(op => (
                            <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                    </select>

                    <button className="btn-enviar" onClick={clasificarManual}>
                        Calcula tu animal del sueño
                    </button>
                </div>
            )}

            {/* Catálogo de animales */}
            {!animalDetectado && (
                <div className="animales-lista">
                    {animales.map((animal, index) => (
                        <div className="animal-card" key={index}>
                            <div className="icon">{animal.icono}</div>
                            <h4>{animal.nombre}</h4>
                            <p>{animal.corta}</p>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn-volver" onClick={() => navigate('/')}>
                Volver a la página principal
            </button>

            {/* Resultado */}
            {animalDetectado && (
                <div className="resultado-animal fade-in destacado">
                    <div className="animal-icon">{animalDetectado.icono}</div>
                    <div className="animal-nombre">{animalDetectado.nombre}</div>
                    <div className="animal-slogan">{animalDetectado.slogan}</div>
                    <p className="animal-desc">{animalDetectado.larga}</p>

                    <div className="resultado-botones">
                        <button
                            className="btn-enviar"
                            onClick={() => {
                                setAnimalDetectado(null);
                                setSleepData(null);
                                setManualData({ horas: "", regularidad: "", horaDormir: "" });
                                setLoading(false);
                            }}
                        >
                            Volver a calcular
                        </button>
                        <button className="btn-volver" onClick={() => navigate('/')}>
                            Volver a la página principal
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}