import { Link, NavLink } from "react-router-dom";

import "./Header.css";

const navigation = [
  {
    label: "Global",
    to: "/global",
  },
  {
    label: "Mercados",
    to: "/mercados",
  },
  {
    label: "Economía",
    to: "/economia",
  },
  {
    label: "Tecnología",
    to: "/tecnologia",
  },
  {
    label: "Energía",
    to: "/energia",
  },
  {
    label: "Geopolítica",
    to: "/geopolitica",
  },
  {
    label: "Análisis",
    to: "/analisis",
  },
  {
    label: "Comunidad",
    to: "/comunidad",
  },
];

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">

        <Link
          className="header__brand"
          to="/"
          aria-label="SanPer"
        >
          SanPer
        </Link>

        <nav
          className="header__nav"
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">

          <button
            className="header__action"
            type="button"
            aria-label="Buscar"
          >
            <SearchIcon />
          </button>

          <Link
            className="header__profile"
            to="/perfil"
            aria-label="Perfil"
          >
            <UserIcon />
          </Link>

        </div>

      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" />
    </svg>
  );
}