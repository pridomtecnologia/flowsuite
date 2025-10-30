import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import FormularioFechamentoProjeto from "./FormularioFechamentoProjeto";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function IncluirFechamentoProjeto() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Fechamento de Projetos" },
            { name: "Cadastro fechamento projeto" }
          ]}
        />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="">
          <FormularioFechamentoProjeto />
        </SimpleCard>
      </Stack>
    </Container>
  );
}
