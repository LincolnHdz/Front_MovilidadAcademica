import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-line"></div>
            <div className="footer-content">
                <div className="social-links">
                    <a href="https://www.facebook.com/IngenieriaUaslp" target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">
                            <g fill="currentColor" fillRule="nonzero"><g transform="scale(8.53333,8.53333)"><path d="M24,4h-18c-1.105,0 -2,0.895 -2,2v18c0,1.105 0.895,2 2,2h10v-9h-3v-3h3v-1.611c0,-3.05 1.486,-4.389 4.021,-4.389c1.214,0 1.856,0.09 2.16,0.131v2.869h-1.729c-1.076,0 -1.452,0.568 -1.452,1.718v1.282h3.154l-0.428,3h-2.726v9h5c1.105,0 2,-0.895 2,-2v-18c0,-1.105 -0.896,-2 -2,-2z"></path></g></g>
                        </svg>
                    </a>
                    
                    <a href="https://x.com/IngenieriaUASLP" target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">
                            <g fill="currentColor" fillRule="nonzero"><g transform="scale(5.12,5.12)"><path d="M11,4c-3.866,0 -7,3.134 -7,7v28c0,3.866 3.134,7 7,7h28c3.866,0 7,-3.134 7,-7v-28c0,-3.866 -3.134,-7 -7,-7zM13.08594,13h7.9375l5.63672,8.00977l6.83984,-8.00977h2.5l-8.21094,9.61328l10.125,14.38672h-7.93555l-6.54102,-9.29297l-7.9375,9.29297h-2.5l9.30859,-10.89648zM16.91406,15l14.10742,20h3.06445l-14.10742,-20z"></path></g></g>
                        </svg>
                    </a>
                    
                    <a href="https://www.youtube.com/c/IngenieríaUASLPoficial" target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">
                            <g fill="currentColor" fillRule="nonzero"><g transform="scale(5.12,5.12)"><path d="M44.89844,14.5c-0.39844,-2.19922 -2.29687,-3.80078 -4.5,-4.30078c-3.29687,-0.69922 -9.39844,-1.19922 -16,-1.19922c-6.59766,0 -12.79687,0.5 -16.09766,1.19922c-2.19922,0.5 -4.10156,2 -4.5,4.30078c-0.40234,2.5 -0.80078,6 -0.80078,10.5c0,4.5 0.39844,8 0.89844,10.5c0.40234,2.19922 2.30078,3.80078 4.5,4.30078c3.5,0.69922 9.5,1.19922 16.10156,1.19922c6.60156,0 12.60156,-0.5 16.10156,-1.19922c2.19922,-0.5 4.09766,-2 4.5,-4.30078c0.39844,-2.5 0.89844,-6.10156 1,-10.5c-0.20312,-4.5 -0.70312,-8 -1.20312,-10.5zM19,32v-14l12.19922,7z"></path></g></g>
                        </svg>
                    </a>
                    
                    <a href="https://www.instagram.com/ingenieriauaslp" target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">
                            <g fill="currentColor" fillRule="nonzero"><g transform="scale(4,4)"><path d="M21.58008,7c-8.039,0 -14.58008,6.54494 -14.58008,14.58594v20.83203c0,8.04 6.54494,14.58203 14.58594,14.58203h20.83203c8.04,0 14.58203,-6.54494 14.58203,-14.58594v-20.83398c0,-8.039 -6.54494,-14.58008 -14.58594,-14.58008zM47,15c1.104,0 2,0.896 2,2c0,1.104 -0.896,2 -2,2c-1.104,0 -2,-0.896 -2,-2c0,-1.104 0.896,-2 2,-2zM32,19c7.17,0 13,5.83 13,13c0,7.17 -5.831,13 -13,13c-7.17,0 -13,-5.831 -13,-13c0,-7.169 5.83,-13 13,-13zM32,23c-4.971,0 -9,4.029 -9,9c0,4.971 4.029,9 9,9c4.971,0 9,-4.029 9,-9c0,-4.971 -4.029,-9 -9,-9z"></path></g></g>
                        </svg>
                    </a>
                </div>
                
                <h3>Facultad de Ingeniería</h3>
                <p>Dr. Manuel Nava No. 8, Zona Universitaria Poniente, C.P. 78290</p>
                <p>San Luis Potosí, San Luis Potosí</p>
                <p>444 826 2330</p>
                <p>©{new Date().getFullYear()} Todos los derechos reservados</p>
            </div>
        </footer>
    );
}