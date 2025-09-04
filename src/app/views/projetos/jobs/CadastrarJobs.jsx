import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import FormCadastroProjeto from "./FormJobsProjeto";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function CadastrarJobs() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Cadastrar Jobs" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="">
          <FormCadastroProjeto />
        </SimpleCard>
      </Stack>
    </Container>
  );
}
