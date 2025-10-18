import { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { Menu } from "../pages/layout/Menu";
import { MemberPage } from "../pages/members/MemberPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProfilePage } from "../pages/profile/ProfilePage";

export const AppRouter = () => {
  const { status, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

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
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="usuarios" element={<MemberPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/*" element={<Navigate to="/dashboard" />} />
          </Route>
        </>
      )}
    </Routes>
  );
};
