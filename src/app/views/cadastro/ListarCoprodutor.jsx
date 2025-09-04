import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaCoprodutor from "./TabelaCoprodutor";

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

export default function ListarCoprodutor() {
  const navigate = useNavigate();

  const handleCadastrarCoprodutor = async (values) => {
    try {
      navigate("/cadastro/coprodutor");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleCadastrarCoprodutor}>
          + Cadastrar Coprodutor
        </StyledButton>
      </Box>

      <SimpleCard title="Coprodutores cadastrados">
        <TabelaCoprodutor />
      </SimpleCard>
    </Container>
  );
}
