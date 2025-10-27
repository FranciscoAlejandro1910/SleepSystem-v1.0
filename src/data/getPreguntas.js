export async function getPreguntas(){
    const res = await fetch('https://sleepsystemapi-aqfzbeaza8c7grax.canadacentral-01.azurewebsites.net/api/Preguntas');
    const preguntas = await res.json();
    return preguntas;
}