import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  IconButton,
  Icon,
  Link
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

// importações do DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const categorias = [
  { id: "001", nome: "PRÉ-PRODUÇÃO" },
  { id: "002", nome: "PRODUÇÃO" },
  { id: "003", nome: "CENOGRAFIA" },
  { id: "004", nome: "TRANSPORTES" },
  { id: "005", nome: "EQUIPE DE FILMAGEM" },
  { id: "006", nome: "ELENCO" },
  { id: "007", nome: "ALIMENTAÇÃO" },
  { id: "008", nome: "HOTEL" },
  { id: "009", nome: "PASSAGENS AÉREAS" },
  { id: "010", nome: "EQUIPAMENTO DE FILMAGEM" },
  { id: "011", nome: "ILUMINAÇÃO" },
  { id: "012", nome: "PRODUÇÃO DE SOM" },
  { id: "013", nome: "FINALIZAÇÃO" },
  { id: "014", nome: "OUTROS" },
  { id: "015", nome: "OUTROS FORA DA TAXA" }
];

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" }
];

export default function PlanilhaCustosOrcamento() {
  const [itensPorCategoria, setItensPorCategoria] = useState(
    categorias.reduce((acc, cat) => {
      acc[cat.id] = [{ descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "un", obs: "" }];
      return acc;
    }, {})
  );

  const [totais, setTotais] = useState({
    taxaImplantacao: 0,
    condicaoComercial: 0,
    impostos: 0
  });

  const [validadeOrcamento, setValidadeOrcamento] = useState(null);

  const handleAddItem = (catId) => {
    setItensPorCategoria((prev) => ({
      ...prev,
      [catId]: [
        ...prev[catId],
        { descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "un", obs: "" }
      ]
    }));
  };

  const navigate = useNavigate();

  const handleCloseOrcamento = (event) => {
    event.preventDefault();
    navigate("/projetos/orcamento/listar-orcamento");
  };

  return (
    <Grid container spacing={2}>
      {/* Parte da esquerda (Accordion com categorias e itens) */}
      <Grid item xs={9}>
        {categorias.map((cat) => (
          <Accordion key={cat.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${cat.id} - ${cat.nome}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={2}>
                  <Typography>Descrição</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Qtd</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Vr. Unit</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Dias</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Unid.</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Total</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Obs.</Typography>
                </Grid>
              </Grid>

              {itensPorCategoria[cat.id].map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={2}>
                    <TextField fullWidth size="small" placeholder="Nova Descrição" />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField fullWidth size="small" />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth size="small" />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField fullWidth size="small" />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField fullWidth size="small" />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      disabled
                      backgroundColor="#727272ff"
                      sx={{ bgcolor: "#e0e0e06b" }}
                      value={`R$ ${(item.qtd * item.valorUnit * item.dias).toFixed(2)}`}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth size="small" />
                  </Grid>
                </Grid>
              ))}

              {/* Botão de adicionar item */}
              <Link
                component="button"
                variant="body2"
                onClick={() => handleAddItem(cat.id)}
                sx={{ mt: 1, textDecoration: "none", cursor: "pointer" }}
              >
                + Adicionar Item
              </Link>
            </AccordionDetails>
          </Accordion>
        ))}

        <Paper sx={{ p: 2, mt: 2, mb: 2, bgcolor: "primary.dark", color: "white" }}>
          <Typography variant="h6">TOTAL PLANILHA: R$ 0,00</Typography>
        </Paper>
      </Grid>

      {/* Parte da direita (Resumo) */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Valores</Typography>

          <TextField
            fullWidth
            size="small"
            label="Taxa de Impulsionamento"
            value={totais.taxaImplantacao}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Comissão Comercial"
            value={totais.condicaoComercial}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Impostos"
            value={totais.impostos}
            sx={{ mt: 2 }}
          />

          <Paper sx={{ mt: 3, p: 1, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="p">TOTAL GERAL: R$ 0,00</Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}
