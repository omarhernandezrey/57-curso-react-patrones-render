import React from 'react';
import '../styles/footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="material-symbols-rounded">task_alt</span>
            <span className="footer-logo-text">TaskFlow</span>
          </div>
          <p className="footer-tagline">
            Organiza tu vida, una tarea a la vez. Productividad simple y elegante.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="GitHub">
              <span className="material-symbols-rounded">code</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="material-symbols-rounded">tag</span>
            </a>
            <a href="#" className="social-link" aria-label="Email">
              <span className="material-symbols-rounded">mail</span>
            </a>
          </div>
        </div>

        {/* Links Sections */}
        <div className="footer-links-group">
          <div className="footer-links">
            <h4 className="footer-links-title">Producto</h4>
            <a href="#" className="footer-link">Funcionalidades</a>
            <a href="#" className="footer-link">Integraciones</a>
            <a href="#" className="footer-link">Precios</a>
            <a href="#" className="footer-link">Changelog</a>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">Recursos</h4>
            <a href="#" className="footer-link">Documentación</a>
            <a href="#" className="footer-link">Guías</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Comunidad</a>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">Empresa</h4>
            <a href="#" className="footer-link">Acerca de</a>
            <a href="#" className="footer-link">Contacto</a>
            <a href="#" className="footer-link">Privacidad</a>
            <a href="#" className="footer-link">Términos</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; {currentYear} TaskFlow. Todos los derechos reservados.
          </p>
          <div className="footer-built">
            <span>Hecho con</span>
            <span className="material-symbols-rounded footer-heart">favorite</span>
            <span>usando React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
