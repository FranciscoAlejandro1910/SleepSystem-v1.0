import { useEffect, useState } from "react";
import {
  BarChart,
    Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend
} from "recharts";


export default function GraficaMujeres() {
  const [evaluacionesFemenino, setEvaluacionesFemenino] = useState([]);
  // Ya no se necesita el estado de género seleccionado

  useEffect(() => {
    fetch("https://sleepsystemapi-aqfzbeaza8c7grax.canadacentral-01.azurewebsites.net/api/Dashboard/puntaje-mujeres")
      .then((res) => res.json())
      .then((data) => setEvaluacionesFemenino(data))
      .catch((err) => console.error(err));
  }, []);

  // Categorizar puntajeTotal
  function getCategoria(puntajeTotal) {
    if (puntajeTotal <= 5) {
      return "Buena";
    } else if (puntajeTotal <= 10) {
      return "Regular";
    } else if (puntajeTotal <= 15) {
      return "Mala";
    } else {
      return "Pesima";
    }
  }

  // Categorías fijas
  const categoriasFijas = ["Buena", "Regular", "Mala", "Pesima"];

  // Agrupar por categoría y contar cuántos hay en cada una
  const conteoPorCategoria = categoriasFijas.map((cat) => ({
    categoria: cat,
    cantidad: evaluacionesFemenino.filter(e => getCategoria(e.puntajeTotal) === cat).length
  }));

  return (
  <div className="p-7" style={{ minHeight: 300, minWidth: 700, background: '#fff', color: '#222', borderRadius: 12, boxShadow: '0 2px 12px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h1 className="font-bold mb-4" style={{ fontSize: '2.2em', textAlign: 'center' }}>Calidad del Sueño en Mujeres</h1>

      {/* Gráfica de barras por categoría fija */}
      <ResponsiveContainer width={800} height={200}>
        <BarChart data={conteoPorCategoria}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="categoria"
            interval={0}
            tick={{ fontSize: 16 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#7b37a5ff" name="Cantidad" />
        </BarChart>
      </ResponsiveContainer>
      
    </div>
  );
}
