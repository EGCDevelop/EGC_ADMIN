import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./styles/menu.css";

export const Menu = () => {
  return (
    <>
      <div className="layout">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  );
};
