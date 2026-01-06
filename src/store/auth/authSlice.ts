import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Auth from "../../interfaces/Auth";

interface AuthState {
  isLoadingAuth: boolean;
  status: "checking" | "authenticated" | "not-authenticated";
  user?: Auth;
  errorAuthMessage?: string;
}

const initialState: AuthState = {
  isLoadingAuth: false,
  status: "checking", // estado inicial
  user: {
    id: 0,
    nombre: "",
    apellido: "",
    telefono: undefined,
    correo: undefined,
    idPuesto: 0,
    token: "",
    username: "",
    area: "",
    rol: 0,
    squadIdList: []
  },
  errorAuthMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onLoadingAuth: (state) => {
      state.isLoadingAuth = true;
      state.user = undefined;
      state.status = "not-authenticated";
      state.errorAuthMessage = undefined;
    },

    onLogin: (state, action: PayloadAction<Auth>) => {
      state.isLoadingAuth = false;
      state.status = "authenticated";
      state.user = action.payload;
      state.errorAuthMessage = undefined;
    },

    onLogout: (state) => {
      state.isLoadingAuth = false;
      state.status = "not-authenticated";
      state.user = undefined;
      state.errorAuthMessage = undefined;
    },

    onSetErrorAuthMessage: (state, action: PayloadAction<string>) => {
      state.isLoadingAuth = false;
      state.errorAuthMessage = action.payload;
      state.status = "not-authenticated";
    },
  },
});

export const { onLoadingAuth, onLogin, onLogout, onSetErrorAuthMessage } =
  authSlice.actions;

export default authSlice.reducer;
