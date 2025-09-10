import { useState } from "react";
import { Box, Tab, Tabs, styled, Grid, Paper, IconButton, Icon, Button } from "@mui/material";
import { Breadcrumb } from "app/components";
import PlanilhaCustosOrcamento from "./orcamento/PlanilhaCustosOrcamento";
import FormCadastroProjeto from "./FormCadastroProjeto";

// Container estilizado
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function Adaptacao() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Cadastrar Projeto" }]} />
      </Box>

      <Box>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "primary.white",
            color: "white"
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" title="Voltar a listagem dos orçamentos">
                <IconButton color="white">
                  <Icon color="white">arrow_back</Icon>
                </IconButton>
                Voltar
              </Button>
            </Grid>

            {/* <Grid item>
              <Button variant="contained" title="Transformar em JOB">
                <IconButton color="white">
                  <Icon color="white">swap_horiz</Icon>
                </IconButton>
                Transformar em JOB
              </Button>
            </Grid> */}

            <Grid item>
              <Button variant="contained" title="Salvar projeto">
                <IconButton color="white">
                  <Icon color="white">save</Icon>
                </IconButton>
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Abas */}
      <Tabs
        value={tab}
        onChange={handleChange}
        sx={{
          mb: 2,
          borderBottom: 1,
          borderColor: "divider"
        }}
      >
        <Tab label="Identificação" />
        <Tab label="Planilha de Custos" />
        <Tab label="Pasta de Documentos" />
      </Tabs>

      {/* Conteúdo da aba */}
      <Box>
        {tab === 0 && (
          <Box sx={{ mt: 2 }}>
            <FormCadastroProjeto />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ mt: 2 }}>
            <PlanilhaCustosOrcamento />
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ mt: 2 }}>
            <h3>Envie o documento</h3>
          </Box>
        )}
      </Box>
    </Container>
  );
}
