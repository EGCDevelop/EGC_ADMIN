import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import Config from "../utils/Config";
import { onLoadingAuth, onLogin, onLogout, onSetErrorAuthMessage } from "../store/auth/authSlice";
import Auth from "../interfaces/Auth";

const apiUrl = Config.apiUrl;
const version = Config.appVersion;

export const useAuthStore = () => {
  const { status, isLoadingAuth, errorAuthMessage, user } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const startLogin = async (username: string, password: string) => {
    dispatch(onLoadingAuth());

    try {
      const payload = {
        username,
        password,
        version: version,
      };


      const response = await fetch(`${apiUrl}/Login/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Se envía como JsonObject
      });

      const data = await response.json();

      // Validamos respuesta del servidor
      if (!response.ok || !data.ok) {
        dispatch(
          onSetErrorAuthMessage(
            data?.message || "Credenciales incorrectas"
          )
        );
        localStorage.clear();
        return;
      }

      const userData: Auth = {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        correo: data.correo,
        idPuesto: data.idPuesto,
        token: data.token,
        username: data.username,
        area: data.area
      };

      localStorage.setItem("data-egc-admin", JSON.stringify(userData));

      dispatch(onLogin(userData));

    } catch (error) {
      localStorage.clear();
      dispatch(
        onSetErrorAuthMessage(
          "No se pudo conectar al servidor. Intenta más tarde."
        )
      );
    }
  };

  const startLogout = () => {
    localStorage.clear();

    // Actualizar el estado global a "not-authenticated"
    dispatch(onLogout());
  };

  const checkAuth = () => {
    dispatch(onLoadingAuth());

    const session = localStorage.getItem("data-egc-admin");
    if (!session) {
      dispatch(onLogout());
      return;
    }

    const data = JSON.parse(session);

    const userData: Auth = {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      correo: data.correo,
      idPuesto: data.idPuesto,
      token: data.token,
      username: data.username,
      area: data.area
    };
    dispatch(onLogin(userData));

  };


  return {
    // properties
    status,
    isLoadingAuth,
    errorAuthMessage,
    user,

    // methods
    startLogin,
    startLogout,
    checkAuth
  };
};
