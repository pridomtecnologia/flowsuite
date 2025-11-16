import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaContasAPagar from "./TabelaContasAPagar";

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

export default function ListarContasAPagar() {
  const navigate = useNavigate();

  const handleIncluirConta = async (values) => {
    try {
      navigate("/financeiro/incluir-contas-a-pagar");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleIncluirConta}>
          + INCLUIR CONTA
        </StyledButton>
      </Box>

      <SimpleCard title="Usuários cadastrado">
        <TabelaContasAPagar />
      </SimpleCard>
    </Container>
  );
}
