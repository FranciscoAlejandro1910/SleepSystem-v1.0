import React, { useState } from 'react';
import './MapaClinicas.css';


const estadosMunicipios = {
    "Nuevo León": ["Monterrey", "San Nicolás", "Guadalupe"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque"],
    "CDMX": ["Coyoacán", "Benito Juárez", "Iztapalapa"],
    // Agrega más Estados y Municipios según necesites
};

export default function MapaClinicas() {
    const [estado, setEstado] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [url, setUrl] = useState('');

    const actualizarMapa = () => {
        if (estado && municipio) {
            const query = `Clínicas del sueño en ${municipio}, ${estado}, México`;
            const urlConQuery = `https://www.google.com/maps/embed/v1/search?key=AIzaSyArrXxH-SeHWDRjeUs6A5Lpi7mM6dljg9U&q=${encodeURIComponent(query)}`;
            setUrl(urlConQuery);
        }
    };

    return (
        <div className="mapa-container fade-in">
            <h2>Ubica tu clínica del sueño más cercana</h2>

            <div className="selectores">
                <select value={estado} onChange={(e) => {
                    setEstado(e.target.value);
                    setMunicipio('');
                }}>
                    <option value="">Selecciona un Estado</option>
                    {Object.keys(estadosMunicipios).map((e) => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>

                <select
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    disabled={!estado}
                >
                    <option value="">Selecciona un Municipio</option>
                    {estado && estadosMunicipios[estado].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                <button onClick={actualizarMapa}>Buscar Clínicas</button>
            </div>

            {url && (
                <div className="mapa-iframe">
                    <iframe
                        title="Mapa Clínicas"
                        width="100%"
                        height="400"
                        style={{ border: 0, marginTop: '1rem' }}
                        loading="lazy"
                        allowFullScreen
                        src={url}
                    ></iframe>
                </div>
            )}
        </div>
    );
}
