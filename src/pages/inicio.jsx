import React from "react";
import "./Inicio.css";
import imagenSueno from "../assets/sueno.png";
import imagenHigiene from "../assets/higiene.png";
import { ArrowUp } from "lucide-react";
import MapaClinicas from '../components/MapaClinicas';


export default function Inicio() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="inicio-container">
            <nav className="navbar">
                <a href="#intro" className="activo">Inicio</a>
                <a href="#que-es">¿Qué es el sueño?</a>
                <a href="#importancia">Importancia</a>
                <a href="#higiene">Higiene</a>
                <a href="#evaluacion">Evaluación</a>
                <a href="#clinicas">Ubica tu clínica del sueño</a>
            </nav>

            <section id="intro" className="intro-background fade-in">
                <h1 className="titulo">¿Cómo duermes realmente?</h1>
                <p className="subtitulo">Descubre si tu descanso está afectando tu vida diaria.</p>
                <img src={imagenSueno} alt="Sueño" className="imagen-principal" />
                <a href="/test">
                    <button className="btn-evaluacion night-hover">Comenzar Evaluación</button>
                </a>
            </section>

            <section id="que-es" className="section blanco fade-in">
                <h2>¿Qué es el sueño?</h2>
                <p>
                    El sueño es un proceso biológico necesario para la recuperación del cuerpo y la mente.
                    Durante el sueño, el organismo lleva a cabo funciones esenciales como la consolidación
                    de la memoria, la regulación hormonal y la reparación de tejidos. Un buen descanso
                    influye directamente en la salud física, emocional y el rendimiento diario.
                </p>
            </section>

            <section id="importancia" className="section blanco fade-in">
                <h2>Importancia del buen dormir</h2>
                <p>
                    Dormir bien permite mejorar el estado de ánimo, la concentración, el sistema inmunológico
                    y reduce el riesgo de enfermedades crónicas. Por el contrario, una mala calidad del sueño
                    puede derivar en problemas de salud mental, accidentes laborales, baja productividad,
                    entre otros efectos negativos en la vida diaria.
                </p>
            </section>

            <section id="higiene" className="section blanco fade-in">
                <h2>Higiene del sueño</h2>
                <div className="centrar-imagen">
                    <img src={imagenHigiene} alt="Higiene del sueño" className="imagen-higiene" />
                </div>
                <div className="contenido-higiene">
                    <ul>
                        <li>Establece horarios regulares para dormir y despertar.</li>
                        <li>Evita el consumo de cafeína o nicotina antes de dormir.</li>
                        <li>Reduce el uso de pantallas al menos 1 hora antes de acostarte.</li>
                        <li>Mantén un ambiente oscuro, tranquilo y fresco en tu habitación.</li>
                        <li>Realiza ejercicio físico regularmente, pero no justo antes de dormir.</li>
                    </ul>
                </div>
            </section>

            <section id="evaluacion" className="section blanco fade-in">
                <h2>¿Listo para saber tu calidad de sueño?</h2>
                <p>Responde el siguiente test para obtener un prediagnóstico basado en tus hábitos actuales.</p>
                <a href="/test">
                    <button className="btn-evaluacion night-hover">Iniciar Evaluación</button>
                </a>
            </section>

            <section id="clinicas">
                <MapaClinicas />
            </section>

            <footer className="footer">
                <p>© 2025 - Evaluación de calidad del sueño en empleados | CUCEI</p>
            </footer>

            <button className="btn-subir" onClick={scrollToTop}>
                <ArrowUp size={20} />
            </button>
        </div>
    );
}
