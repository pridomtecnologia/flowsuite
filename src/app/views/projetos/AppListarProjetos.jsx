import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaProjeto from "./TabelaProjeto";

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

export default function AppListarProjetos() {
  const navigate = useNavigate();

  const handleCadastrarGeral = async (values) => {
    try {
      navigate("/projeto/cadastrar");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleCadastrarGeral}>
          + Cadastrar Projeto
        </StyledButton>
      </Box>

      <SimpleCard title="Projetos cadastrados">
        <TabelaProjeto />
      </SimpleCard>
    </Container>
  );
}
