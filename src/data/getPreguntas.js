export async function getPreguntas(){
    const res = await fetch('http://localhost:5019/api/Preguntas/');
    const preguntas = await res.json();
    return preguntas;
}