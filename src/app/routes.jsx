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
const ListarCoprodutor = Loadable(lazy(() => import("app/views/cadastro/ListarCoprodutor")));
const ListarDiretor = Loadable(lazy(() => import("app/views/cadastro/ListarDiretor")));
const CadastrarCoprodutor = Loadable(lazy(() => import("app/views/cadastro/CadastrarCoprodutor")));
const CadastrarDiretor = Loadable(lazy(() => import("app/views/cadastro/CadastrarDiretor")));
const EditarCadastro = Loadable(lazy(() => import("app/views/cadastro/EditarCadastro")));
const ListarTags = Loadable(lazy(() => import("app/views/cadastro/ListarTags")));
const CadastrarTags = Loadable(lazy(() => import("app/views/cadastro/CadastrarTags")));

// ´projetos
const AppListarProjetos = Loadable(lazy(() => import("app/views/projetos/AppListarProjetos")));
const CadastrarProjeto = Loadable(lazy(() => import("app/views/projetos/CadastrarProjeto")));
const EditarOrcamento = Loadable(lazy(() => import("app/views/projetos/EditarOrcamento")));
const AppListarOrcamento = Loadable(
  lazy(() => import("app/views/projetos/orcamento/AppListarOrcamento"))
);
const CadastrarOrcamento = Loadable(
  lazy(() => import("app/views/projetos/orcamento/CadastrarOrcamento"))
);
const AppListarJobs = Loadable(lazy(() => import("app/views/projetos/jobs/AppListarJobs")));

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
      { path: "/cadastro", element: <Cadastrar />, auth: authRoles.admin },
      { path: "/cadastro/listar-coprodutor", element: <ListarCoprodutor />, auth: authRoles.admin },
      { path: "/cadastro/listar-diretor", element: <ListarDiretor />, auth: authRoles.admin },
      { path: "/cadastro/coprodutor", element: <CadastrarCoprodutor />, auth: authRoles.admin },
      { path: "/cadastro/diretor", element: <CadastrarDiretor />, auth: authRoles.admin },
      { path: "/cadastro/editar/:id", element: <EditarCadastro />, auth: authRoles.admin },
      { path: "/cadastro/listar-tags", element: <ListarTags />, auth: authRoles.admin },
      { path: "/cadastro/tags", element: <CadastrarTags />, auth: authRoles.admin },
      // projetos
      {
        path: "/projetos/listar-projetos",
        element: <AppListarProjetos />,
        auth: authRoles.admin
      },
      { path: "/projeto/cadastrar", element: <CadastrarProjeto />, auth: authRoles.admin },
      {
        path: "/projetos/orcamento/listar-orcamento",
        element: <AppListarOrcamento />,
        auth: authRoles.admin
      },
      {
        path: "/projeto/orcamento/cadastrar",
        element: <CadastrarOrcamento />,
        auth: authRoles.admin
      },
      { path: "/projetos/jobs/listar-jobs", element: <AppListarJobs />, auth: authRoles.admin },
      { path: "/projeto/:id/:job/:id_job", element: <EditarOrcamento />, auth: authRoles.admin }
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
