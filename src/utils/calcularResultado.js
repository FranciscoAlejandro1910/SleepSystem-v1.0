import preguntas from "../data/preguntas";

function calcularResultado(respuestas) {
    let puntaje = 0;

    // Define los valores por índice de respuesta
    const puntajes = {
        p2: ['0', '1', '2', '3'],
        p4: ['3', '2', '1', '0'],
        p5a: ['0', '1', '2', '3'], p5b: ['0', '1', '2', '3'],
        p5c: ['0', '1', '2', '3'], p5d: ['0', '1', '2', '3'],
        p5e: ['0', '1', '2', '3'], p5f: ['0', '1', '2', '3'],
        p5g: ['0', '1', '2', '3'], p5h: ['0', '1', '2', '3'],
        p5i: ['0', '1', '2', '3'],
        p6: ['0', '1', '2', '3'],
        p7: ['0', '1', '2', '3'],
        p8: ['0', '1', '2', '3'],
        p9: ['0', '1', '2', '3']
    };

    // Sumar puntuaciones
    for (let id in respuestas) {
        const val = respuestas[id];
        const pregunta = preguntas.find(p => p.id === id);
        const idx = pregunta?.opciones.indexOf(val);
        if (puntajes[id] && idx !== -1) {
            puntaje += parseInt(puntajes[id][idx]);
        }
    }

    // Determinar diagnóstico según el puntaje
    let diagnostico = "";
    if (puntaje <= 5) {
        diagnostico = `✅ Buena calidad de sueño:
Se sugiere que la persona presenta un patrón de sueño generalmente adecuado, sin alteraciones significativas.
Pre-diagnóstico: Calidad de sueño normal.`;
    } else if (puntaje <= 10) {
        diagnostico = `⚠️ Calidad de sueño levemente deteriorada:
Indica algunas dificultades como problemas ocasionales para dormir o descanso no reparador.
Pre-diagnóstico: Alteración leve; se recomienda evaluar hábitos y posibles factores externos.`;
    } else if (puntaje <= 15) {
        diagnostico = `🔶 Calidad de sueño moderadamente a severamente afectada:
Existen problemas notables que pueden afectar el funcionamiento diario.
Pre-diagnóstico: Alteración significativa; aconsejable una revisión clínica más detallada.`;
    } else {
        diagnostico = `🚨 Calidad de sueño gravemente deteriorada:
Indica alteración muy marcada, posible trastorno del sueño.
Pre-diagnóstico: Alta probabilidad de trastorno; es importante buscar atención médica especializada.`;
    }

    return { puntaje, diagnostico };
}

export default calcularResultado;
