export async function postPreguntas(usuarioId, respuestas) {
	try {
		const res = await fetch('https://sleepsystemapi-aqfzbeaza8c7grax.canadacentral-01.azurewebsites.net/api/respuestas/lote', {
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