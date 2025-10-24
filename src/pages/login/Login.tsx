import "../../styles/login.css";
import logo from "../../assets/egc.jpeg";
import { FaLock } from "react-icons/fa";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useAuthStore } from "../../hooks/useAuthStore";
import { CustomLoader } from "../components/CustomLoader";
import { CustomAlert } from "../components/CustomAlert";

interface FormData {
  username: string;
  password: string;
}

export const Login = () => {
  const { isLoadingAuth, errorAuthMessage, startLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { formData, onChange } = useForm<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Ingrese su usuario";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Ingrese su contraseña";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    startLogin(formData.username, formData.password);
  };

  useEffect(() => {
    if (errorAuthMessage) {
      setAlert({
        title: "Error",
        message: errorAuthMessage!,
        status: "error"
      })
    }
  }, [errorAuthMessage])

  return (
    <>
      {
        isLoadingAuth && <CustomLoader />
      }
      {
        alert && <CustomAlert title={alert!.title} message={alert!.message} status={alert!.status} onClose={() => setAlert(null)} />
      }
      <div className="container-main-logo">
        <img src={logo} alt="logo" />
        <div className="login-glass"></div>

        <div className="container-login">
          <div className="login-side">
            <div className="login-circle"></div>
            <div className="login-side-content">
              <div className="login-circle-animate"></div>
              <figure>
                <img src={logo} alt="logo" />
              </figure>
              <h1>EGC</h1>
              <span>Admin</span>
              <p>Sistema de Administración Institucional</p>
            </div>
          </div>
          <div className="login-side">
            <form method="POST" onSubmit={handleLogin}>
              <div className="login-icon">
                <FaLock />
              </div>

              <span>Inicio de sesión</span>
              <div className="form-login-content">
                <label htmlFor="username">Usuario</label>
                <div className="login_custom_input">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg_icon bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                  </svg>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    onChange={onChange}
                    value={formData.username}
                    className="login_input"
                    placeholder="Usuario"
                  />
                </div>
                {errors.username && (
                  <span className="custom-input-error">{errors.username}</span>
                )}

              </div>
              <div className="form-login-content">
                <label htmlFor="password">Contraseña</label>
                <div className="login_custom_input">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg_icon bi-lock-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={onChange}
                    className="login_input"
                    placeholder="Contraseña"
                  />
                </div>
                {errors.password && (
                  <span className="custom-input-error">{errors.password}</span>
                )}

              </div>
              <div className="form-login-content-check">
                <input
                  id="showPass"
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPass">mostrar contraseña</label>
              </div>
              <button type="submit">
                Iniciar sesión
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-login-button bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path>
                </svg>
              </button>
              <div className="login-divider"></div>
              <p className="login-description">
                Instituto Enrique Gómez Carrillo © 2025
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
