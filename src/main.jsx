import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '939502417469-ttarb27jvgodepjflucpne9dco4q13t2.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
);
