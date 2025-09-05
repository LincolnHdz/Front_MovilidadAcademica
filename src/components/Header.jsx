import React from 'react';
import logo from '../Img/logoUni.png';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <img src={logo} alt="UASLP" />
                </div>
                <nav>
                    <a href="#facultad">Facultad</a>
                    <a href="#programas">Programas</a>
                    <a href="#convocatorias">Convocatorias</a>
                    <a href="#experiencias">Experiencias</a>
                    <a href="#contacto">Contacto</a>
                </nav>
            </div>
            <div className="header-line"></div>
        </header>
    );
}