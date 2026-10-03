import {
  useState,
} from "react";

import "./SettingsPage.css";

type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "news"
  | "notifications"
  | "privacy";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({
  checked,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      className={
        checked
          ? "settings-toggle is-active"
          : "settings-toggle"
      }
      onClick={onChange}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

export function SettingsPage() {
  const [
    activeSection,
    setActiveSection,
  ] = useState<SettingsSection>(
    "profile",
  );

  const [
    breakingNews,
    setBreakingNews,
  ] = useState(true);

  const [
    storyUpdates,
    setStoryUpdates,
  ] = useState(true);

  const [
    marketAlerts,
    setMarketAlerts,
  ] = useState(false);

  const [
    communityReplies,
    setCommunityReplies,
  ] = useState(true);

  const [
    publicProfile,
    setPublicProfile,
  ] = useState(true);

  const [
    showActivity,
    setShowActivity,
  ] = useState(false);

  const [
    theme,
    setTheme,
  ] = useState<
    "light" | "dark" | "system"
  >("system");

  const [
    density,
    setDensity,
  ] = useState<
    "comfortable" | "compact"
  >("comfortable");

  const sections: {
    id: SettingsSection;
    label: string;
  }[] = [
    {
      id: "profile",
      label: "Perfil",
    },
    {
      id: "account",
      label: "Cuenta",
    },
    {
      id: "appearance",
      label: "Apariencia",
    },
    {
      id: "news",
      label: "Noticias",
    },
    {
      id: "notifications",
      label: "Notificaciones",
    },
    {
      id: "privacy",
      label: "Privacidad",
    },
  ];

  return (
    <main className="settings-page">
      <header className="settings-header">
        <span className="settings-header__eyebrow">
          CUENTA
        </span>

        <h1>Ajustes</h1>

        <p>
          Administra tu perfil,
          preferencias de lectura y
          experiencia en SanPer.
        </p>
      </header>

      <div className="settings-layout">

        <aside className="settings-nav">
          {sections.map(
            (section) => (
              <button
                key={section.id}
                type="button"
                className={
                  activeSection ===
                  section.id
                    ? "settings-nav__item is-active"
                    : "settings-nav__item"
                }
                onClick={() =>
                  setActiveSection(
                    section.id,
                  )
                }
              >
                {section.label}
              </button>
            ),
          )}
        </aside>

        <div className="settings-content">

          {activeSection ===
            "profile" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>Perfil</h2>

                <p>
                  Esta información
                  identifica tu actividad
                  dentro de SanPer.
                </p>
              </div>

              <div className="settings-profile">
                <div className="settings-avatar">
                  D
                </div>

                <div>
                  <strong>
                    Foto de perfil
                  </strong>

                  <span>
                    JPG, PNG o WebP
                  </span>

                  <button type="button">
                    Cambiar imagen
                  </button>
                </div>
              </div>

              <div className="settings-fields">
                <label>
                  <span>Nombre</span>

                  <input
                    type="text"
                    defaultValue="Diego"
                  />
                </label>

                <label>
                  <span>
                    Nombre de usuario
                  </span>

                  <div className="settings-input-prefix">
                    <span>@</span>

                    <input
                      type="text"
                      defaultValue="diego"
                    />
                  </div>
                </label>

                <label>
                  <span>Biografía</span>

                  <textarea
                    defaultValue="Interesado en tecnología, mercados y asuntos globales."
                  />
                </label>
              </div>

              <div className="settings-save">
                <button type="button">
                  Guardar cambios
                </button>
              </div>
            </section>
          )}

          {activeSection ===
            "account" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>Cuenta</h2>

                <p>
                  Administra tus datos de
                  acceso y seguridad.
                </p>
              </div>

              <div className="settings-fields">
                <label>
                  <span>
                    Correo electrónico
                  </span>

                  <input
                    type="email"
                    defaultValue="usuario@sanper.mx"
                  />
                </label>

                <div className="settings-action-row">
                  <div>
                    <strong>
                      Contraseña
                    </strong>

                    <span>
                      Actualiza tu
                      contraseña de acceso.
                    </span>
                  </div>

                  <button type="button">
                    Cambiar
                  </button>
                </div>

                <div className="settings-action-row">
                  <div>
                    <strong>
                      Sesiones activas
                    </strong>

                    <span>
                      Revisa los
                      dispositivos donde
                      has iniciado sesión.
                    </span>
                  </div>

                  <button type="button">
                    Ver sesiones
                  </button>
                </div>
              </div>

              <div className="settings-danger">
                <span>
                  ZONA DE CUENTA
                </span>

                <div>
                  <div>
                    <strong>
                      Eliminar cuenta
                    </strong>

                    <p>
                      Elimina
                      permanentemente tu
                      cuenta y actividad.
                    </p>
                  </div>

                  <button type="button">
                    Eliminar
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection ===
            "appearance" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>Apariencia</h2>

                <p>
                  Personaliza cómo se ve
                  SanPer en este
                  dispositivo.
                </p>
              </div>

              <div className="settings-group">
                <span className="settings-group__label">
                  TEMA
                </span>

                <div className="settings-options">
                  {[
                    {
                      id: "light",
                      label: "Claro",
                    },
                    {
                      id: "dark",
                      label: "Oscuro",
                    },
                    {
                      id: "system",
                      label: "Sistema",
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={
                        theme === option.id
                          ? "settings-option is-active"
                          : "settings-option"
                      }
                      onClick={() =>
                        setTheme(
                          option.id as
                            | "light"
                            | "dark"
                            | "system",
                        )
                      }
                    >
                      <span className={`theme-preview theme-preview--${option.id}`}>
                        <i />
                      </span>

                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-group">
                <span className="settings-group__label">
                  DENSIDAD
                </span>

                <div className="settings-segmented">
                  <button
                    type="button"
                    className={
                      density ===
                      "comfortable"
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setDensity(
                        "comfortable",
                      )
                    }
                  >
                    Cómoda
                  </button>

                  <button
                    type="button"
                    className={
                      density ===
                      "compact"
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setDensity(
                        "compact",
                      )
                    }
                  >
                    Compacta
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection ===
            "news" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>Noticias</h2>

                <p>
                  Define los sectores que
                  quieres seguir con mayor
                  frecuencia.
                </p>
              </div>

              <div className="settings-topics">
                {[
                  "Geopolítica",
                  "Economía",
                  "Mercados",
                  "Tecnología",
                  "Energía",
                  "Ciencia",
                  "Negocios",
                ].map(
                  (
                    topic,
                    index,
                  ) => (
                    <button
                      key={topic}
                      type="button"
                      className={
                        index < 4
                          ? "settings-topic is-active"
                          : "settings-topic"
                      }
                    >
                      {topic}
                    </button>
                  ),
                )}
              </div>

              <div className="settings-note">
                Estas preferencias podrán
                utilizarse para ordenar tu
                portada sin ocultar el
                resto de la cobertura.
              </div>
            </section>
          )}

          {activeSection ===
            "notifications" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>
                  Notificaciones
                </h2>

                <p>
                  Decide qué actividad
                  merece interrumpirte.
                </p>
              </div>

              <div className="settings-switches">
                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Noticias de última
                      hora
                    </strong>

                    <span>
                      Eventos de alta
                      relevancia.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      breakingNews
                    }
                    onChange={() =>
                      setBreakingNews(
                        !breakingNews,
                      )
                    }
                  />
                </div>

                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Historias en
                      seguimiento
                    </strong>

                    <span>
                      Cambios importantes
                      en historias que
                      sigues.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      storyUpdates
                    }
                    onChange={() =>
                      setStoryUpdates(
                        !storyUpdates,
                      )
                    }
                  />
                </div>

                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Mercados
                    </strong>

                    <span>
                      Movimientos y eventos
                      relevantes del
                      mercado.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      marketAlerts
                    }
                    onChange={() =>
                      setMarketAlerts(
                        !marketAlerts,
                      )
                    }
                  />
                </div>

                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Comunidad
                    </strong>

                    <span>
                      Respuestas a tus
                      comentarios y
                      opiniones.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      communityReplies
                    }
                    onChange={() =>
                      setCommunityReplies(
                        !communityReplies,
                      )
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection ===
            "privacy" && (
            <section className="settings-section">
              <div className="settings-section__header">
                <h2>Privacidad</h2>

                <p>
                  Controla qué información
                  de tu actividad puede
                  ver la comunidad.
                </p>
              </div>

              <div className="settings-switches">
                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Perfil público
                    </strong>

                    <span>
                      Permite que otros
                      usuarios consulten
                      tu perfil.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      publicProfile
                    }
                    onChange={() =>
                      setPublicProfile(
                        !publicProfile,
                      )
                    }
                  />
                </div>

                <div className="settings-switch-row">
                  <div>
                    <strong>
                      Mostrar actividad
                    </strong>

                    <span>
                      Muestra públicamente
                      tus comentarios y
                      opiniones.
                    </span>
                  </div>

                  <Toggle
                    checked={
                      showActivity
                    }
                    onChange={() =>
                      setShowActivity(
                        !showActivity,
                      )
                    }
                  />
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}