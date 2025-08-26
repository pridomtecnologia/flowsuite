import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaUsuarios from "./TabelaUsuarios";

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

export default function ListarUsuarios() {
  const navigate = useNavigate();

  const handleCadastrarGeral = async (values) => {
    try {
      navigate("/cadastro");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleCadastrarGeral}>
          + Cadastrar Usuário
        </StyledButton>
      </Box>

      <SimpleCard title="Usuários cadastrado">
        <TabelaUsuarios />
      </SimpleCard>
    </Container>
  );
}
