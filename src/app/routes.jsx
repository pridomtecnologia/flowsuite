import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
// cadastro
const AppListarUsuarios = Loadable(lazy(() => import("app/views/cadastro/AppListarUsuarios")));
const Cadastrar = Loadable(lazy(() => import("app/views/cadastro/Cadastrar")));

const routes = [
  { path: "/", element: <Navigate to="dashboard" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard", element: <Analytics />, auth: authRoles.admin },

      // cadastro
      {
        path: "/cadastro/listar-cadastrados",
        element: <AppListarUsuarios />,
        auth: authRoles.admin
      },
      { path: "/cadastro", element: <Cadastrar />, auth: authRoles.admin }

      // // e-chart route
      // { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
