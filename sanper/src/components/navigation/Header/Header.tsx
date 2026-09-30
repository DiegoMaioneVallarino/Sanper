import { Link, NavLink } from "react-router-dom";

import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link
          className="header__brand"
          to="/"
        >
          SanPer
        </Link>

        <nav className="header__nav">
          <NavLink to="/global">
            Global
          </NavLink>

          <NavLink to="/mercados">
            Mercados
          </NavLink>

          <NavLink to="/economia">
            Economía
          </NavLink>

          <NavLink to="/tecnologia">
            Tecnología
          </NavLink>

          <NavLink to="/energia">
            Energía
          </NavLink>

          <NavLink to="/geopolitica">
            Geopolítica
          </NavLink>

          <NavLink to="/analisis">
            Análisis
          </NavLink>

          <NavLink to="/comunidad">
            Comunidad
          </NavLink>
        </nav>

        <div className="header__actions">
          <button type="button">
            Buscar
          </button>
        </div>
      </div>
    </header>
  );
}