import { useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Paper,
  Link
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const categorias = [
  { id: "1", nome: "PRÉ-PRODUÇÃO" },
  { id: "2", nome: "PRODUÇÃO" },
  { id: "3", nome: "CENOGRAFIA" },
  { id: "4", nome: "TRANSPORTES" },
  { id: "5", nome: "EQUIPE DE FILMAGEM" },
  { id: "6", nome: "ELENCO" },
  { id: "7", nome: "ALIMENTAÇÃO" },
  { id: "8", nome: "HOTEL" },
  { id: "9", nome: "PASSAGENS AÉREAS" },
  { id: "10", nome: "EQUIPAMENTO DE FILMAGEM" },
  { id: "11", nome: "ILUMINAÇÃO" },
  { id: "12", nome: "PRODUÇÃO DE SOM" },
  { id: "13", nome: "FINALIZAÇÃO" },
  { id: "14", nome: "OUTROS" },
  { id: "15", nome: "OUTROS FORA DA TAXA" }
];

export default function PlanilhaCustosOrcamento({ values, onChange }) {
  const { itensPorCategoria, totais } = values;

  const handleAddItem = (catId) => {
    onChange({
      ...values,
      itensPorCategoria: {
        ...itensPorCategoria,
        [catId]: [
          ...itensPorCategoria[catId],
          { descricao: "", qtd: 0, valorUnit: 0, dias: 0, unid: "0", obs: "" }
        ]
      }
    });
  };

  const handleItemChange = (catId, index, field, value) => {
    const novosItens = [...itensPorCategoria[catId]];
    let item = { ...novosItens[index] };

    item[field] =
      field === "descricao" || field === "obs" || field === "unid" ? value : Number(value);

    // recalcula o total sempre
    item.total = (item.qtd || 0) * (item.valorUnit || 0) * (item.dias || 0);

    novosItens[index] = item;

    onChange({
      ...values,
      itensPorCategoria: { ...itensPorCategoria, [catId]: novosItens }
    });
  };

  const handleTotaisChange = (field, rawValue) => {
    const value = rawValue.replace(",", ".");
    onChange({
      ...values,
      totais: {
        ...totais,
        [field]: value === "" ? 0 : parseFloat(value)
      }
    });
  };

  // soma total da planilha
  const totalPlanilha = Object.values(itensPorCategoria).reduce(
    (accCat, itens) =>
      accCat + itens.reduce((accItem, item) => accItem + item.qtd * item.valorUnit * item.dias, 0),
    0
  );

  const valorTaxa = (totalPlanilha * Number(totais.taxaImplantacao)) / 100;
  const valorImpostos = (totalPlanilha * Number(totais.impostos)) / 100;
  const totalGeral = totalPlanilha + valorTaxa + valorImpostos + Number(totais.condicaoComercial);

  useEffect(() => {
    onChange({
      ...values,
      totais: {
        ...totais,
        total_planilha: totalPlanilha,
        total_geral: totalGeral
      }
    });
  }, [totalPlanilha, totalGeral]);

  return (
    <Grid container spacing={2}>
      {/* Esquerda */}
      <Grid item xs={9}>
        {categorias.map((cat) => (
          <Accordion key={cat.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${cat.id} - ${cat.nome}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Cabeçalho */}
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

              {/* Linhas */}
              {itensPorCategoria[cat.id].map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.descricao}
                      onChange={(e) => handleItemChange(cat.id, index, "descricao", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.qtd}
                      onChange={(e) => handleItemChange(cat.id, index, "qtd", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.valorUnit}
                      onChange={(e) => handleItemChange(cat.id, index, "valorUnit", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.dias}
                      onChange={(e) => handleItemChange(cat.id, index, "dias", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.unid}
                      onChange={(e) => handleItemChange(cat.id, index, "unid", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      disabled
                      sx={{ bgcolor: "#e0e0e06b" }}
                      value={`R$ ${(item.total || 0).toFixed(2)}`}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.obs}
                      onChange={(e) => handleItemChange(cat.id, index, "obs", e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}

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
          <Typography variant="h6">TOTAL PLANILHA: R$ {totalPlanilha.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      {/* Direita */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Valores</Typography>

          <TextField
            fullWidth
            size="small"
            label="Taxa de Impulsionamento (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.taxaImplantacao === 0 ? "" : totais.taxaImplantacao}
            onChange={(e) => handleTotaisChange("taxaImplantacao", e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Comissão Comercial (R$)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.condicaoComercial === 0 ? "" : totais.condicaoComercial}
            onChange={(e) => handleTotaisChange("condicaoComercial", e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Impostos (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.impostos === 0 ? "" : totais.impostos}
            onChange={(e) => handleTotaisChange("impostos", e.target.value)}
            sx={{ mt: 2 }}
          />

          <Paper sx={{ mt: 3, p: 1, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="p">TOTAL GERAL: R$ {totalGeral.toFixed(2)}</Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}
