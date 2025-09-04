const navigations = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },

  { label: "CADASTRAR", type: "label" },
  { name: "Cadastros Gerais", path: "/cadastro/listar-cadastrados", icon: "person" },
  { name: "Diretor", path: "/cadastro/listar-diretor", icon: "person" },
  { name: "Coprodutor", path: "/cadastro/listar-coprodutor", icon: "person" },
  { name: "Centro de Custo", path: "/cadastro/listar-centro-custo", icon: "add" },

  { label: "PROJETOS", type: "label" },
  { name: "Criar Projeto", path: "/projetos/listar-projetos", icon: "add" },
  { name: "Criar Orçamento", path: "/projetos/orcamento/listar-orcamento", icon: "add" },
  { name: "Projetos (JOBs)", path: "/projetos/jobs/listar-jobs", icon: "visibility" }

  // { label: "PAGES", type: "label" },
  // {
  //   name: "Session/Auth",
  //   icon: "security",
  //   children: [
  //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
  //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
  //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
  //     { name: "Error", iconText: "404", path: "/session/404" }
  //   ]
  // },
  // { label: "Components", type: "label" },
  // {
  //   name: "Components",
  //   icon: "favorite",
  //   badge: { value: "30+", color: "secondary" },
  //   children: [
  //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
  //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
  //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
  //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
  //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
  //     { name: "Form", path: "/material/form", iconText: "F" },
  //     { name: "Icons", path: "/material/icons", iconText: "I" },
  //     { name: "Menu", path: "/material/menu", iconText: "M" },
  //     { name: "Progress", path: "/material/progress", iconText: "P" },
  //     { name: "Radio", path: "/material/radio", iconText: "R" },
  //     { name: "Switch", path: "/material/switch", iconText: "S" },
  //     { name: "Slider", path: "/material/slider", iconText: "S" },
  //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
  //     { name: "Table", path: "/material/table", iconText: "T" }
  //   ]
  // }
  // {
  //   name: "Charts",
  //   icon: "trending_up",
  //   children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  // }
];

export default navigations;
