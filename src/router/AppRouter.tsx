import { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { Menu } from "../pages/layout/Menu";
import { CustomLoader } from "../pages/components/CustomLoader";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MemberPage from "../pages/members/MemberPage";
import ProfilePage from "../pages/profile/ProfilePage";

export const AppRouter = () => {
  const { status, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  if (status === 'checking') return <CustomLoader />

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/auth/*" element={<Login />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Menu />}>
            {/* LÓGICA PARA ROL 1 (Admin) */}
            {user?.rol === 1 && (
              <>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="usuarios" element={<MemberPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="/*" element={<Navigate to="/dashboard" />} />
              </>
            )}

            {/* LÓGICA PARA ROL 2 (Usuario/Estandar) */}
            {user?.rol === 2 && (
              <>
                <Route index element={<Navigate to="/profile" />} />
                <Route path="usuarios" element={<MemberPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="/*" element={<Navigate to="/profile" />} />
              </>
            )}

            {user?.rol === 3 && (
              <>
                <Route index element={<Navigate to="/profile" />} />
                <Route path="usuarios" element={<MemberPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="/*" element={<Navigate to="/profile" />} />
              </>
            )}

            {/* Fallback por si el rol no coincide con ninguno (Seguridad extra) */}
            <Route path="*" element={<Navigate to="/profile" />} />
          </Route>
        </>
      )}
    </Routes>
  );
};
