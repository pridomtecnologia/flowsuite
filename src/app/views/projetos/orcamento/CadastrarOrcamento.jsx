import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import PlanilhaCustosOrcamento from "./PlanilhaCustosOrcamento";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function CadastrarOrcamento() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Cadastrar Orçamento" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="">
          <PlanilhaCustosOrcamento />
        </SimpleCard>
      </Stack>
    </Container>
  );
}
