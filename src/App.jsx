import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio.jsx';
import Test from './pages/test.jsx'; 
import Resultado from './pages/resultado.jsx';
import AnimalSueno from "./pages/AnimalSueno.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/test" element={<Test />} />
            <Route path="/resultado" element={<Resultado />} />
            <Route path="/animal-sueno" element={<AnimalSueno />} />
        </Routes>
    );
}
