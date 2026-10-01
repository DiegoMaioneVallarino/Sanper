import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./ProfileMenu.css";

export function ProfileMenu() {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  function goTo(path: string) {
    setIsOpen(false);
    navigate(path);
  }

  return (
    <div
      ref={containerRef}
      className="profile-menu"
    >
      <button
  className="profile-menu__trigger"
  type="button"
  aria-label="Abrir menú de perfil"
  aria-haspopup="menu"
  aria-expanded={isOpen}
  onClick={() =>
    setIsOpen((current) => !current)
  }
>
  <UserIcon />
</button>

      {isOpen && (
        <div className="profile-menu__dropdown">
          <div className="profile-menu__account">
            <div className="profile-menu__account-avatar">
              D
            </div>

            <div>
              <strong>
                Diego
              </strong>

              <span>
                usuario@sanper.com
              </span>
            </div>
          </div>

          <div className="profile-menu__divider" />

          <div className="profile-menu__section">
            <MenuButton
              icon={<ProfileIcon />}
              label="Mi perfil"
              onClick={() =>
                goTo("/perfil")
              }
            />

            <MenuButton
              icon={<SettingsIcon />}
              label="Ajustes"
              onClick={() =>
                goTo("/ajustes")
              }
            />

            <MenuButton
              icon={<BookmarkIcon />}
              label="Guardados"
              onClick={() =>
                goTo("/guardados")
              }
            />
          </div>

          <div className="profile-menu__divider" />

          <div className="profile-menu__section">
            <MenuButton
              icon={<AdminIcon />}
              label="Administración"
              description="Panel editorial"
              onClick={() =>
                goTo("/admin")
              }
            />
          </div>

          <div className="profile-menu__divider" />

          <div className="profile-menu__section">
            <MenuButton
              icon={<LogoutIcon />}
              label="Cerrar sesión"
              muted
              onClick={() => {
                setIsOpen(false);

                // Después conectamos
                // aquí nuestro auth.
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  muted?: boolean;
  onClick: () => void;
}

function MenuButton({
  icon,
  label,
  description,
  muted,
  onClick,
}: MenuButtonProps) {
  return (
    <button
      type="button"
      className={
        muted
          ? "profile-menu__item profile-menu__item--muted"
          : "profile-menu__item"
      }
      onClick={onClick}
    >
      <span className="profile-menu__icon">
        {icon}
      </span>

      <span className="profile-menu__item-content">
        <strong>{label}</strong>

        {description && (
          <span>
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

function ProfileIcon() {
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

      <path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7 4h10v16l-5-3-5 3V4Z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
      />

      <path d="M8 9h8M8 13h5M8 17h3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
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