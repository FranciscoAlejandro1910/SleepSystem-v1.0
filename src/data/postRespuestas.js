export async function postPreguntas(usuarioId, respuestas) {
	try {
		const res = await fetch('http://localhost:5019/api/respuestas/lote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ usuarioId, respuestas })
		});
		if (!res.ok) {
			const errorText = await res.text();
			console.error('Error en postPreguntas:', res.status, errorText);
			throw new Error(`Error en postPreguntas: ${res.status} - ${errorText}`);
		}
		const data = await res.json();
		console.log('Respuesta de la API postPreguntas:', data);
		return data;
	} catch (error) {
		console.error('Excepción en postPreguntas:', error);
		throw error;
	}
}