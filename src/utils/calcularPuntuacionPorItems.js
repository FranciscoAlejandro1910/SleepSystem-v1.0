export default function calcularPuntuacionPorItems(respuestas) {
    let total = 0;

    const p6 = {
        'Muy buena': 0,
        'Bastante buena': 1,
        'Bastante mala': 2,
        'Muy mala': 3
    };
    total += p6[respuestas.p6] ?? 0;

    const latencia = {
        'Menos de 15 minutos': 0,
        'Entre 16 – 30 minutos': 1,
        'Entre 31 – 60 minutos': 2,
        'Más de 60 minutos': 3
    };
    const frecuencia = {
        'Ninguna vez': 0,
        'Menos de una vez a la semana': 1,
        'Una o dos veces a la semana': 2,
        'Tres o más veces a la semana': 3
    };
    const sumaLatencia = (latencia[respuestas.p2] ?? 0) + (frecuencia[respuestas.p5a] ?? 0);
    total += sumaLatencia === 0 ? 0 : sumaLatencia <= 2 ? 1 : sumaLatencia <= 4 ? 2 : 3;

    const duracion = {
        '> 7 horas': 0,
        '6 - 7 horas': 1,
        '5 - 6 horas': 2,
        '< 5 horas': 3
    };
    total += duracion[respuestas.p4] ?? 0;

    const horaToInt = h => parseInt(h.split(':')[0]);
    let dormir = horaToInt(respuestas.p1);
    let despertar = horaToInt(respuestas.p3);
    if (despertar <= dormir) despertar += 24;

    const horasEnCama = despertar - dormir;
    const horasDormidas = {
        '> 7 horas': 8,
        '6 - 7 horas': 6.5,
        '5 - 6 horas': 5.5,
        '< 5 horas': 4
    }[respuestas.p4] ?? 0;
    const eficiencia = horasEnCama > 0 ? (horasDormidas / horasEnCama) * 100 : 0;
    total += eficiencia >= 85 ? 0 : eficiencia >= 75 ? 1 : eficiencia >= 65 ? 2 : 3;

    const disturbios = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const sumaDisturbios = disturbios.reduce((acc, l) => acc + (frecuencia[respuestas[`p5${l}`]] ?? 0), 0);
    total += sumaDisturbios === 0 ? 0 : sumaDisturbios <= 9 ? 1 : sumaDisturbios <= 18 ? 2 : 3;

    total += frecuencia[respuestas.p7] ?? 0;

    const disfuncionExtra = {
        'Ningún problema': 0,
        'Solo un leve problema': 1,
        'Un problema': 2,
        'Un grave problema': 3
    };
    const sumaDisfuncion = (frecuencia[respuestas.p8] ?? 0) + (disfuncionExtra[respuestas.p9] ?? 0);
    total += sumaDisfuncion === 0 ? 0 : sumaDisfuncion <= 2 ? 1 : sumaDisfuncion <= 4 ? 2 : 3;

    let diagnostico = '';
    if (total <= 5) {
        diagnostico = `Buena calidad de sueño:\nSe sugiere que la persona presenta un patrón de sueño generalmente adecuado, sin alteraciones significativas.\nPre-diagnóstico: Calidad de sueño normal.`;
    } else if (total <= 10) {
        diagnostico = `Calidad de sueño levemente deteriorada:\nIndica la presencia de algunas dificultades en la calidad del sueño, como problemas ocasionales para conciliar o mantener el sueño, o la sensación de sueño no completamente reparador.\nPre-diagnóstico: Alteración leve de la calidad del sueño; se recomienda evaluar hábitos y posibles factores externos.`;
    } else if (total <= 15) {
        diagnostico = `Calidad de sueño moderadamente a severamente afectada:\nSugiere que existen problemas notables en la consolidación del sueño o en la calidad del descanso, lo que puede afectar el funcionamiento diario.\nPre-diagnóstico: Alteración significativa de la calidad del sueño; aconsejable una revisión clínica más detallada.`;
    } else {
        diagnostico = `Calidad de sueño gravemente deteriorada:\nEste rango apunta a una alteración muy marcada del patrón de sueño, lo que podría estar asociado a trastornos del sueño o condiciones médicas subyacentes.\nPre-diagnóstico: Alta probabilidad de un trastorno del sueño; es importante buscar atención médica especializada para una evaluación completa.`;
    }

    return { total, diagnostico };
}
