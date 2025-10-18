import { useState } from "react";
import { FaAlignJustify, FaTimes, FaUser } from "react-icons/fa";
import { FaRightToBracket } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { routes } from "../../router/routes";
import { useAuthStore } from "../../hooks/useAuthStore";

export const Navbar = () => {
  const { startLogout } = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="topbar">
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <FaAlignJustify />
        </button>
        <h1 className="title">EGC Admin</h1>
      </div>

      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <img src="/egc.jpeg" alt="Logo" className="logo" />
          <h2>EGC Admin</h2>
        </div>

        <div className="sidebar-content">
          <hr className="separator" />
          {isOpen ? (
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes /> <span className="text">Ocultar menú</span>
            </button>
          ) : (
            <button className="hamburger" onClick={() => setIsOpen(true)}>
              <FaAlignJustify className="icon" />
            </button>
          )}
          <hr className="separator" />

          <p>Sistema de Administración</p>

          <div className="menu-continer-instructor">
            <FaUser className="icon" />
            <div className="menu-instructor-info">
              <span>Erick Osoy</span>
              <p>Administrador</p>
            </div>
          </div>

          <nav className="menu-items">
            {routes.map((route) => (
              <NavLink
                key={route.name}
                to={route.to}
                className="menu-link"
                onClick={() => setIsOpen(false)}
              >
                {route.icon}
                <span className="text">{route.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout fijo abajo */}
        <div className="logout">
          <button type="button" className="logout-btn" onClick={startLogout}>
            <FaRightToBracket className="icon" />
            <span className="text">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
