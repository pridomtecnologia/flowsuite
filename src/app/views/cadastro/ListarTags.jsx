import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { SimpleCard } from "app/components";
import TabelaTags from "./TabelaTags";

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

export default function ListarTags() {
  const navigate = useNavigate();

  const handleCadastrarTags = async () => {
    try {
      navigate("/cadastro/tags");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <StyledButton variant="contained" color="primary" onClick={handleCadastrarTags}>
          + Cadastrar Tags
        </StyledButton>
      </Box>

      <SimpleCard title="Tags cadastradas">
        <TabelaTags />
      </SimpleCard>
    </Container>
  );
}
