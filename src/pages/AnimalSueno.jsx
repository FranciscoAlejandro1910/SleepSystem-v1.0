import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import './AnimalSueno.css';

export default function AnimalSueno() {
    const [animalDetectado, setAnimalDetectado] = useState(null);
    const [sleepData, setSleepData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de animales
    const animales = [
        {
            nombre: "Koala",
            icono: "🐨",
            corta: "Duermes mucho y profundamente, como un koala.",
            larga: "El Koala es símbolo de descanso prolongado y profundo. Si este es tu animal, significa que tu cuerpo busca constantemente recuperación y desconexión. Pasas mucho tiempo en cama, y aunque puede parecer bueno, también debes vigilar que este exceso no sea síntoma de fatiga crónica o falta de energía. Como un Koala, eres tranquilo, relajado y disfrutas de la calma, pero procura balancear el descanso con actividad física moderada para mantener un equilibrio saludable."
        },
        {
            nombre: "Tiburón",
            icono: "🦈",
            corta: "Duermes poco y siempre en alerta, como un tiburón.",
            larga: "El Tiburón nunca duerme por completo, siempre se mantiene en movimiento. Si este es tu animal, significa que tu descanso suele ser insuficiente y que tu mente rara vez se desconecta por completo. Esto refleja un estilo de vida agitado, con estrés o preocupaciones que interrumpen tu sueño. Como un tiburón, estás en alerta, siempre productivo, pero tu cuerpo te pide más horas de calma. Dormir poco a la larga puede afectar tu memoria, concentración y salud general."
        },
        {
            nombre: "Búho",
            icono: "🦉",
            corta: "Te acuestas muy tarde, eres nocturno como un búho.",
            larga: "El Búho representa a quienes tienen un cronotipo nocturno. Si este es tu animal, probablemente te acuestas tarde y eres más productivo en las noches. Esta característica puede ser positiva si tu estilo de vida lo permite, pero puede traer problemas si debes levantarte temprano para trabajar o estudiar. Como un búho, eres creativo, reflexivo y aprovechas la calma nocturna, pero tu cuerpo necesita encontrar un balance para no acumular déficit de sueño."
        },
        {
            nombre: "Pingüino",
            icono: "🐧",
            corta: "Tu sueño es inestable, como el andar de un pingüino.",
            larga: "El Pingüino refleja un descanso irregular. A veces duermes mucho, a veces muy poco, y eso genera inestabilidad en tu energía diaria. Como un pingüino, puedes adaptarte a diferentes entornos, pero tu cuerpo sufre con los cambios drásticos de horarios. Este patrón puede estar relacionado con turnos laborales, cambios de rutina o malos hábitos de sueño. Es importante que intentes regular tus horas para lograr un descanso más predecible."
        },
        {
            nombre: "Oso Pardo",
            icono: "🐻",
            corta: "Tienes un sueño estable y reparador, como un oso.",
            larga: "El Oso Pardo representa el equilibrio. Si este es tu animal, significa que duermes lo suficiente, con un descanso estable y reparador. Como los osos que hibernan, sabes recuperarte bien y aprovechar el sueño como herramienta natural de energía. Este es el patrón más saludable, y refleja que tu cuerpo logra un buen balance entre actividad y descanso. Mantener estas rutinas será clave para seguir disfrutando de buena salud física y mental."
        },
        {
            nombre: "Oveja",
            icono: "🐑",
            corta: "Descansas lo justo, como una oveja que sigue su rutina.",
            larga: "La Oveja es símbolo de constancia y sencillez. Si este es tu animal, significa que duermes lo suficiente para funcionar, aunque a veces puede que no sea del todo reparador. Eres disciplinado con tus horarios, pero podrías beneficiarte de pequeñas mejoras en tu rutina nocturna. Como una oveja, sigues patrones regulares, pero necesitas priorizar más calidad en el descanso para alcanzar tu máximo bienestar."
        }
    ];


    // Obtener sesiones de sueño de Google Fit
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
        if (!json.session) return [];

        return json.session
            .filter(s => s.activityType === 72) // 72 = dormir
            .map(s => ({
                start: Number(s.startTimeMillis),
                end: Number(s.endTimeMillis),
            }));
    }

    // Clasificar animal de sueño
    function clasificarAnimal(segmentos) {
        if (segmentos.length === 0) return null;

        const horasPorDia = segmentos.map(s => (s.end - s.start) / (1000 * 60 * 60));
        const promedio = horasPorDia.reduce((a, b) => a + b, 0) / horasPorDia.length;

        // Variabilidad = diferencia entre mejor y peor día
        const max = Math.max(...horasPorDia);
        const min = Math.min(...horasPorDia);
        const variacion = max - min;

        // Hora de inicio promedio
        const startHoras = segmentos.map(s => new Date(s.start).getHours());
        const promedioInicio = startHoras.reduce((a, b) => a + b, 0) / startHoras.length;

        // Reglas simples (puedes ajustarlas a tu gusto)
        if (promedio >= 8) return animales.find(a => a.nombre === "Koala");
        if (promedio < 5.5) return animales.find(a => a.nombre === "Tiburón");
        if (promedioInicio >= 0 && promedioInicio <= 3) return animales.find(a => a.nombre === "Búho");
        if (variacion > 2) return animales.find(a => a.nombre === "Pingüino");
        if (promedio >= 6.5 && promedio <= 8 && variacion <= 1.5) return animales.find(a => a.nombre === "Oso Pardo");
        return animales.find(a => a.nombre === "Oveja");
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
        },
        onError: () => {
            console.error("Error en login con Google Fit");
        }
    });

    return (
        <div className="animal-sueno-container">
            <h2>Descubre tu Animal del Sueño</h2>
            <p><strong>Conecta tu cuenta de Google Fit para analizar tus datos reales de descanso y descubrir tu animal de sueño.</strong></p>

            {!sleepData && !loading && (
                <button onClick={googleFitLogin} className="btn-animal">
                    Conectar con Google Fit 💤
                </button>
            )}

            {loading && <p>Cargando tus datos de sueño...</p>}

            {animalDetectado && (
                <div className="resultado-animal fade-in">
                    <div className="animal-icon">{animalDetectado.icono}</div>
                    <div className="animal-nombre">{animalDetectado.nombre}</div>
                    <p className="animal-desc">{animalDetectado.larga}</p>
                </div>
            )}

            {/* Lista de todos los animales */}
            <div className="animales-lista">
                {animales.map((animal, index) => (
                    <div className="animal-card" key={index}>
                        <div className="icon">{animal.icono}</div>
                        <h4>{animal.nombre}</h4>
                        <p>{animal.corta}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
