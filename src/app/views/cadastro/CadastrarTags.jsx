import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import FormCadastroTags from "./FormCadastroTags";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function CadastrarTags() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Cadastrar Tags" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="">
          <FormCadastroTags />
        </SimpleCard>
      </Stack>
    </Container>
  );
}
