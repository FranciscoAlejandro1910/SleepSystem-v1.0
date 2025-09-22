export function evaluacionPuntaje(puntajeTotal){

    let diagnostico = "";

    if (puntajeTotal <= 5) {
        diagnostico = `Buena calidad de sueño:\nSe sugiere que la persona presenta un patrón de sueño generalmente adecuado, sin alteraciones significativas.\nPre-diagnóstico: Calidad de sueño normal.`;
    } else if (puntajeTotal <= 10) {
        diagnostico = `Calidad de sueño levemente deteriorada:\nIndica la presencia de algunas dificultades en la calidad del sueño, como problemas ocasionales para conciliar o mantener el sueño, o la sensación de sueño no completamente reparador.\nPre-diagnóstico: Alteración leve de la calidad del sueño; se recomienda evaluar hábitos y posibles factores externos.`;
    } else if (puntajeTotal <= 15) {
        diagnostico = `Calidad de sueño moderadamente a severamente afectada:\nSugiere que existen problemas notables en la consolidación del sueño o en la calidad del descanso, lo que puede afectar el funcionamiento diario.\nPre-diagnóstico: Alteración significativa de la calidad del sueño; aconsejable una revisión clínica más detallada.`;
    } else {
        diagnostico = `Calidad de sueño gravemente deteriorada:\nEste rango apunta a una alteración muy marcada del patrón de sueño, lo que podría estar asociado a trastornos del sueño o condiciones médicas subyacentes.\nPre-diagnóstico: Alta probabilidad de un trastorno del sueño; es importante buscar atención médica especializada para una evaluación completa.`;
    }

    return diagnostico;

} 
