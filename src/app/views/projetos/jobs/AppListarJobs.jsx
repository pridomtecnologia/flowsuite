import { Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaProjeto from "./TabelaJobs";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

export default function AppListarJobs() {
  return (
    <Container>
      <SimpleCard title="Projetos cadastrados">
        <TabelaProjeto />
      </SimpleCard>
    </Container>
  );
}
