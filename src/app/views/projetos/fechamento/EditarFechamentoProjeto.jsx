import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import EditarFormularioFechamentoProjeto from "./EditarFormularioFechamentoProjeto";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function EditarFechamentoProjeto() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Fechamento de Projetos" },
            { name: "Editar fechamento projeto" }
          ]}
        />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="">
          <EditarFormularioFechamentoProjeto />
        </SimpleCard>
      </Stack>
    </Container>
  );
}
