import React, { lazy, LazyExoticComponent } from "react";
import { FaTools } from "react-icons/fa";
import { FaBiohazard, FaChartSimple, FaUserGroup } from "react-icons/fa6";

type JSXComponent = () => JSX.Element;

interface Route {
  to: string;
  path: string;
  component: LazyExoticComponent<JSXComponent> | JSXComponent;
  name: string;
  icon: React.JSX.Element;
  roles: number[];
}

const memberPage = lazy(() => import("../pages/members/MemberPage"));
const dashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const profilePage = lazy(() => import("../pages/profile/ProfilePage"));
const instructorsPage = lazy(() => import("../pages/instructors/InstructorsPage"));

export const routes: Route[] = [
  {
    to: "/dashboard",
    path: "dashboard",
    component: dashboardPage,
    name: "Dashboard",
    icon: <FaChartSimple className="icon" />,
    roles: [1]
  },
  {
    to: "/usuarios",
    path: "usuarios",
    component: memberPage,
    name: "Usuarios",
    icon: <FaUserGroup className="icon" />,
    roles: [1, 2, 3]
  },
  {
    to: "/instructors",
    path: "instructors",
    component: instructorsPage,
    name: "Instructores",
    icon: <FaBiohazard className="icon" />,
    roles: [1, 2, 3]
  },
  {
    to: "/profile",
    path: "profile",
    component: profilePage,
    name: "Mi Perfil",
    icon: <FaTools className="icon" />,
    roles: [1, 2, 3]
  },
];
