export async function postEvaluacion(usuarioId,respuestas ){
    try{
        const res = await fetch('http://localhost:5019/api/Evaluaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId, respuestas })
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error en postEvaluacion:', res.status, errorText);
            throw new Error(`Error en postEvaluacion: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        console.log(data.puntajeTotal);
        localStorage.setItem('puntajeTotal', data.puntajeTotal);
    } catch (error) {
        console.error('Error en postEvaluacion:', error);
        throw error;
    }
 }