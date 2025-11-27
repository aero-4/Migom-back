import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.tsx';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContext>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthContext>

    </React.StrictMode>
);
