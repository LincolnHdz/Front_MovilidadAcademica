import React, { useState } from 'react';
import logo from '../Img/logoUni.png';
import './Header.css';
import LanguageSwitcher from '../components/Language/LanguageSwitcher';

export default function Header() {
    const [isMovilidadOpen, setIsMovilidadOpen] = useState(false);
    const [isBecasOpen, setIsBecasOpen] = useState(false);

    const toggleMovilidadDropdown = () => {
        setIsMovilidadOpen(!isMovilidadOpen);
        setIsBecasOpen(false); // Cierra el otro dropdown
    };

    const toggleBecasDropdown = () => {
        setIsBecasOpen(!isBecasOpen);
        setIsMovilidadOpen(false); // Cierra el otro dropdown
    };

    const closeAllDropdowns = () => {
        setIsMovilidadOpen(false);
        setIsBecasOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <a href="/" className="nav-logo">
                        <img src={logo} alt="UASLP" />
                    </a>
                </div>
                <nav>
                    <LanguageSwitcher />
                    <a href="/" className="nav-link">Inicio</a>
                    
                    {/* Menú desplegable para Movilidad */}
                    <div className="dropdown" onMouseLeave={closeAllDropdowns}>
                        <button 
                            className="nav-link dropdown-toggle" 
                            onClick={toggleMovilidadDropdown}
                            onMouseEnter={() => setIsMovilidadOpen(true)}
                        >
                            Movilidad
                            <span className={`arrow ${isMovilidadOpen ? 'up' : 'down'}`}>▼</span>
                        </button>
                        
                        {isMovilidadOpen && (
                            <div className="dropdown-menu">
                                <a href="/movilidad-presencial" className="dropdown-item">
                                    Movilidad Presencial
                                </a>
                                <a href="/movilidad-virtual" className="dropdown-item">
                                    Movilidad Virtual
                                </a>
                            </div>
                        )}
                    </div>
                    
                    <a href="/doble-titulacion" className="nav-link">Doble Titulación</a>
                    
                    {/* Menú desplegable para Becas */}
                    <div className="dropdown" onMouseLeave={closeAllDropdowns}>
                        <button 
                            className="nav-link dropdown-toggle" 
                            onClick={toggleBecasDropdown}
                            onMouseEnter={() => setIsBecasOpen(true)}
                        >
                            Becas
                            <span className={`arrow ${isBecasOpen ? 'up' : 'down'}`}>▼</span>
                        </button>
                        
                        {isBecasOpen && (
                            <div className="dropdown-menu">
                                <a href="/becas-Francia" className="dropdown-item">
                                    Becas Francia
                                </a>
                                <a href="/becas-internacionales" className="dropdown-item">
                                    Becas X...
                                </a>
                                <a href="/becas-posgrado" className="dropdown-item">
                                    Becas de X---
                                </a>
                            </div>
                        )}
                    </div>
                    
                    <a href="/convocatorias-lista" className="nav-link">Convocatorias</a>
                </nav>
                <div className="auth-section">
                    <a href="/login" className="login-btn">
                        <span className="login-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </span>
                        Iniciar Sesión
                    </a>
                </div>
            </div>
            <div className="header-line"></div>
        </header>
    );
}