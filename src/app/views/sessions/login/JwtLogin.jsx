import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";

import useAuth from "app/hooks/useAuth";

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#041620", // fundo escuro
  position: "relative",
  overflow: "hidden"
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   width: "600px",
  //   height: "600px",
  //   backgroundColor: "#58BAD4", // verde neon
  //   borderRadius: "50%",
  //   top: "-150px",
  //   left: "-150px",
  //   zIndex: 0
  // },
  // "&::after": {
  //   content: '""',
  //   position: "absolute",
  //   width: "400px",
  //   height: "400px",
  //   backgroundColor: "#00E0FF", // azul ciano
  //   borderRadius: "50%",
  //   bottom: "-100px",
  //   right: "-100px",
  //   zIndex: 0
  // }
}));

const StyledCard = styled(Card)(() => ({
  position: "relative",
  zIndex: 1,
  maxWidth: 400,
  width: "100%",
  borderRadius: "20px",
  padding: "2rem",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
}));

const initialValues = { email: "", password: "", remember: true };

const validationSchema = Yup.object().shape({
  password: Yup.string().min(6, "Mínimo de 6 caracteres").required("Senha é obrigatória"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório")
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch {
      alert("Erro ao efetuar login, verifique suas credenciais.");
    }
  };

  return (
    <StyledRoot>
      <StyledCard>
        <Box display="flex" justifyContent="center" mb={1}>
          <img src="/assets/images/logos/logo_flowsuite.png" width={200} alt="Logo Flowsuite" />
        </Box>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box textAlign="center" fontWeight="bold" mb={2} fontSize="1.1rem">
                ENTRAR NO FLOWSUITE
              </Box>

              <TextField
                fullWidth
                size="medium"
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                variant="outlined"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                helperText={touched.email && errors.email}
                error={Boolean(errors.email && touched.email)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                size="medium"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                variant="outlined"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
                helperText={touched.password && errors.password}
                error={Boolean(errors.password && touched.password)}
                sx={{ mb: 2 }}
              />

              <LoadingButton
                type="submit"
                loading={isSubmitting}
                variant="contained"
                sx={{
                  backgroundColor: "#00E0FF",
                  color: "#000",
                  fontWeight: "bold",
                  py: 1.3,
                  borderRadius: "10px",
                  fontSize: "1rem",
                  width: "100%",
                  mb: 2,
                  "&:hover": { backgroundColor: "#00bcd4" }
                }}
              >
                Acessar
              </LoadingButton>

              {/* <Box textAlign="center" color="#555" mb={2}>
                ou
              </Box>

              <LoadingButton
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.3,
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: "bold"
                }}
              >
                Entrar com o Google
              </LoadingButton> */}
            </form>
          )}
        </Formik>
      </StyledCard>
    </StyledRoot>
  );
}
