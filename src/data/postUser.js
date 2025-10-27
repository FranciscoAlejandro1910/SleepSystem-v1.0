// src/data/postUser.js
export async function postUser({ genero, edad, oficio }) {
  const res = await fetch('https://sleepsystemapi-aqfzbeaza8c7grax.canadacentral-01.azurewebsites.net/api/Usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ genero, oficio, edad })
  });
  const data = await res.json();
  console.log(data.idUser)
  return data.idUser; // Ajusta según la respuesta real de tu API
}