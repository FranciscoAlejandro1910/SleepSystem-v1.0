import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GoogleFitSleep() {
    const [sleepData, setSleepData] = useState(null);
    const [error, setError] = useState(null);

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const accessToken = tokenResponse.access_token;

                const now = new Date();
                const endTime = now.getTime();
                const startTime = new Date(now.setDate(now.getDate() - 5)).getTime(); // Últimos 7 días

                const response = await axios.post(
                    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                    {
                        aggregateBy: [{
                            dataTypeName: "com.google.sleep.segment"
                        }],
                        bucketByTime: { durationMillis: 86400000 }, // cada día
                        startTimeMillis: startTime,
                        endTimeMillis: endTime
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setSleepData(response.data.bucket);
            } catch (err) {
                console.error(err);
                setError("No se pudieron obtener los datos de sueño. Asegúrate de tener datos recientes en Google Fit.");
            }
        },
        onError: () => {
            setError("Error al iniciar sesión con Google.");
        },
        scope: "https://www.googleapis.com/auth/fitness.sleep.read"
    });

    return (
        <div className="googlefit-container">
            <h3>¿Quieres complementar tu resultado con datos reales de Google Fit?</h3>
            <p className="subinfo">Este paso es opcional, pero puede dar una mejor visión de tu sueño.</p>

            <button onClick={() => login()} className="btn-evaluacion">Iniciar sesión con Google</button>

            {error && <p className="error">{error}</p>}

            {sleepData && (
                <div className="sleep-data">
                    <h4>Fragmento de tu actividad de sueño (últimos días):</h4>
                    <ul>
                        {sleepData.map((bucket, index) => (
                            <li key={index}>
                                {new Date(parseInt(bucket.startTimeMillis)).toLocaleDateString()} – segmentos: {bucket.dataset[0].point.length}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
