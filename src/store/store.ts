import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { generalSlice } from "./general/generalSlice";
import { instructorsSlice } from "./instructors/instructorsSlice";
import { memberSlice } from "./member/memberSlice";
import { connectionsSlice } from "./connectionsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    general: generalSlice.reducer,
    instructors: instructorsSlice.reducer,
    member: memberSlice.reducer,
    connections: connectionsSlice.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
