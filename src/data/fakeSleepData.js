function crearSegmentoFake(horas, diasAtras = 0) {
    const fin = Date.now() - (diasAtras * 24 * 60 * 60 * 1000);
    const inicio = fin - (horas * 60 * 60 * 1000);

    return {
        name: "Sueño",
        startTimeMillis: inicio,
        endTimeMillis: fin,
        from: new Date(inicio).toLocaleString(),
        to: new Date(fin).toLocaleString()
    };
}

// Escenarios de prueba
export const fakeDataNormal = [
    crearSegmentoFake(7, 0),
    crearSegmentoFake(8, 1),
    crearSegmentoFake(6, 2),
    crearSegmentoFake(4, 3),
    crearSegmentoFake(8, 4),
];

export const fakeDataApnea = [
    crearSegmentoFake(4, 0),
    crearSegmentoFake(6, 1),
    crearSegmentoFake(4.5, 2),
    crearSegmentoFake(5, 3),
    crearSegmentoFake(4, 4),
];

export const fakeDataPerfecto = [
    crearSegmentoFake(8, 0),
    crearSegmentoFake(8, 1),
    crearSegmentoFake(8, 2),
    crearSegmentoFake(8, 3),
    crearSegmentoFake(8, 4),
];