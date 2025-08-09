const preguntas = [
    {
        id: 'p1',
        texto: 'Durante el último mes, ¿cuál ha sido, normalmente, su hora de acostarse?',
        tipo: 'opcion',
        opciones: ['20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00']
    },
    {
        id: 'p2', texto: '¿Cuánto tiempo tarda en dormirse, normalmente, las noches del último mes?', tipo: 'opcion', opciones: [
            'Menos de 15 minutos', 'Entre 16 – 30 minutos', 'Entre 31 – 60 minutos', 'Más de 60 minutos',
        ]
    },
    {
        id: 'p3',
        texto: 'Durante el último mes, ¿a qué hora se ha levantado habitualmente por la mañana?',
        tipo: 'opcion',
        opciones: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00']
    },
    { id: 'p4', texto: '¿Cuántas horas calcula que habrá dormido verdaderamente por cada noche durante el último mes?', tipo: 'opcion', opciones: ['< 5 horas', '5 - 6 horas', '6 - 7 horas', '> 7 horas'] },
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map(letter => ({
        id: `p5${letter}`,
        texto: `Durante el último mes, ¿con qué frecuencia ha tenido problemas para dormir a causa de: ${{
            a: 'No poder conciliar el sueño en la primera media hora?', b: 'Despertarse durante la noche o de madrugada?',
            c: 'Tener que levantarse para ir al baño / tomar agua?', d: 'No poder respirar bien?',
            e: 'Toser o roncar ruidosamente?', f: 'Sentir frío?', g: 'Sentir demasiado calor?',
            h: 'Tener pesadillas o malos sueños?', i: 'Sufrir dolores?'
        }[letter]}`,
        tipo: 'opcion', opciones: ['Ninguna vez', 'Menos de una vez a la semana', 'Una o dos veces a la semana', 'Tres o más veces a la semana'],
    })),
    { id: 'p6', texto: '¿Cómo valoraría en conjunto la calidad de su sueño?', tipo: 'opcion', opciones: ['Muy buena', 'Bastante buena', 'Bastante mala', 'Muy mala'] },
    { id: 'p7', texto: '¿Cuántas veces tomó medicinas para dormir?', tipo: 'opcion', opciones: ['Ninguna vez', 'Menos de una vez a la semana', 'Una o dos veces a la semana', 'Tres o más veces a la semana'] },
    { id: 'p8', texto: '¿Cuántas veces sintió somnolencia durante actividades diurnas?', tipo: 'opcion', opciones: ['Ninguna vez', 'Menos de una vez a la semana', 'Una o dos veces a la semana', 'Tres o más veces a la semana'] },
    { id: 'p9', texto: '¿Le resultó problemático realizar actividades por esa somnolencia?', tipo: 'opcion', opciones: ['Ningún problema', 'Solo un leve problema', 'Un problema', 'Un grave problema'] },
    { id: 'p10', texto: '¿Duerme usted solo o acompañado?', tipo: 'opcion', opciones: ['Solo', 'Con alguien en otra habitación', 'En la misma habitación, pero en otra cama', 'En la misma cama'] }
];

export default preguntas;
