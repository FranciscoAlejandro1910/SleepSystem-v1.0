import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Test from './pages/Test'; 
import Resultado from './pages/Resultado';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/test" element={<Test />} />
            <Route path="/resultado" element={<Resultado />} />
        </Routes>
    );
}
