import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaFechamentOrcamento from "./TabelaFechamentOrcamento";

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

export default function ListarFechamentoOrcamento() {
  const navigate = useNavigate();

  const handleFechamentOrcamento = async (values) => {
    try {
      navigate("/projetos/fechamento/incluir-fechamento-projeto");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleFechamentOrcamento}>
          + Cadastrar Fechamento do Projeto
        </StyledButton>
      </Box>

      <SimpleCard title="Fechamento de projetos cadastrados">
        <TabelaFechamentOrcamento />
      </SimpleCard>
    </Container>
  );
}
