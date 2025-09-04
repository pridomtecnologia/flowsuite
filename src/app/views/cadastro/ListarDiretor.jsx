import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaDiretores from "./TabelaDiretores";

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

export default function ListarDiretor() {
  const navigate = useNavigate();

  const handleCadastrarDiretor = async (values) => {
    try {
      navigate("/cadastro/diretor");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleCadastrarDiretor}>
          + Cadastrar Diretor
        </StyledButton>
      </Box>

      <SimpleCard title="Diretores cadastrados">
        <TabelaDiretores />
      </SimpleCard>
    </Container>
  );
}
