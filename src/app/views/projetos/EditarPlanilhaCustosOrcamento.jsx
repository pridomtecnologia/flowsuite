// EditarPlanilhaCustosOrcamento.jsx - código corrigido
import React, { useEffect, useMemo, useCallback } from "react";
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

const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.23)",
  boxSizing: "border-box",
  fontSize: 14,
  background: "white"
};

// Componente de linha otimizado
const ItemRow = React.memo(function ItemRow({ catId, index, item, handleItemChange }) {
  const total = (item.qtd || 0) * (item.valorUnit || 0) * (item.dias || 1);

  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={3.5}>
        <input
          style={inputStyle}
          value={item.descricao || ""}
          onChange={(e) => handleItemChange(catId, index, "descricao", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={inputStyle}
          type="number"
          value={item.qtd || 1}
          onChange={(e) => handleItemChange(catId, index, "qtd", Number(e.target.value))}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={inputStyle}
          type="number"
          step="0.01"
          value={item.valorUnit || 0}
          onChange={(e) => handleItemChange(catId, index, "valorUnit", Number(e.target.value))}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={inputStyle}
          type="number"
          value={item.dias || 1}
          onChange={(e) => handleItemChange(catId, index, "dias", Number(e.target.value))}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={inputStyle}
          value={item.unid || "0"}
          onChange={(e) => handleItemChange(catId, index, "unid", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.6}>
        <input
          style={{ ...inputStyle, background: "#e0e0e06b" }}
          readOnly
          value={`R$ ${total.toFixed(2)}`}
        />
      </Grid>

      <Grid item xs={2.1}>
        <input
          style={inputStyle}
          value={item.obs || ""}
          onChange={(e) => handleItemChange(catId, index, "obs", e.target.value)}
        />
      </Grid>
    </Grid>
  );
});

export default function EditarPlanilhaCustosOrcamento({ values, onChange }) {
  const { itensPorCategoria, totais } = values;

  useEffect(() => {
    const categoriasIds = categorias.map((cat) => cat.id);
    const missingCategories = categoriasIds.filter((id) => !itensPorCategoria[id]);

    if (missingCategories.length > 0) {
      onChange((prev) => {
        const updatedItens = { ...prev.itensPorCategoria };
        missingCategories.forEach((id) => {
          // 🔥 Use os itens fixos para categorias faltantes
          if (itensFixosPorCategoria[id]) {
            updatedItens[id] = itensFixosPorCategoria[id].map((descricao) => ({
              descricao: descricao,
              qtd: 1,
              valorUnit: 0,
              dias: 1,
              unid: "0",
              obs: "",
              total: 0
            }));
          } else {
            updatedItens[id] = [];
          }
        });
        return {
          ...prev,
          itensPorCategoria: updatedItens
        };
      });
    }
  }, [itensPorCategoria, onChange]);

  const handleAddItem = useCallback(
    (catId) => {
      onChange((prev) => ({
        ...prev,
        itensPorCategoria: {
          ...prev.itensPorCategoria,
          [catId]: [
            ...(prev.itensPorCategoria[catId] || []),
            { descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "0", obs: "" }
          ]
        }
      }));
    },
    [onChange]
  );

  const handleItemChange = useCallback(
    (catId, index, field, value) => {
      onChange((prev) => {
        const novosItens = [...(prev.itensPorCategoria[catId] || [])];
        if (!novosItens[index]) {
          novosItens[index] = { descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "0", obs: "" };
        }

        novosItens[index] = {
          ...novosItens[index],
          [field]: value
        };

        return {
          ...prev,
          itensPorCategoria: {
            ...prev.itensPorCategoria,
            [catId]: novosItens
          }
        };
      });
    },
    [onChange]
  );

  const handleTotaisChange = useCallback(
    (field, value) => {
      onChange((prev) => ({
        ...prev,
        totais: {
          ...prev.totais,
          [field]: value === "" ? 0 : parseFloat(value)
        }
      }));
    },
    [onChange]
  );

  const totalPlanilha = useMemo(() => {
    return Object.values(itensPorCategoria).reduce((accCat, itens) => {
      if (!Array.isArray(itens)) return accCat;

      return (
        accCat +
        itens.reduce((accItem, item) => {
          const qtd = Number(item?.qtd || 0);
          const valorUnit = Number(item?.valorUnit || 0);
          const dias = Number(item?.dias || 0);
          return accItem + qtd * valorUnit * dias;
        }, 0)
      );
    }, 0);
  }, [itensPorCategoria]);

  const totalGeral = useMemo(() => {
    const percImpulsionamento = parseFloat(totais.taxaImplantacao) || 0;
    const percComissao = parseFloat(totais.condicaoComercial) || 0;
    const percImpostos = parseFloat(totais.impostos) || 0;

    const valorImpulsionamento = totalPlanilha * (percImpulsionamento / 100);
    const valorComissao = totalPlanilha * (percComissao / 100);

    const subtotal = totalPlanilha + valorImpulsionamento + valorComissao;
    const valorImpostos = subtotal * (percImpostos / 100);

    return subtotal + valorImpostos;
  }, [totalPlanilha, totais]);

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      totais: {
        ...prev.totais,
        total_planilha: totalPlanilha,
        total_geral: totalGeral
      }
    }));
  }, [totalPlanilha, totalGeral, onChange]);

  const formatCurrency = (value) =>
    `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <Grid container spacing={2}>
      {/* Esquerda - Lista de categorias e itens */}
      <Grid item xs={9}>
        {categorias.map((cat) => (
          <Accordion key={cat.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ mt: 1, color: "#6c7216ff", border: "0.5px solid #6c721681", borderRadius: 2 }}
            >
              <Typography>{`${cat.id} - ${cat.nome}`}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              {/* Cabeçalho */}
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={3.5}>
                  <Typography>Descrição</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography>Qtd</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography>Vr. Unit</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography>Dias</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography>Unid.</Typography>
                </Grid>
                <Grid item xs={1.6}>
                  <Typography>Total</Typography>
                </Grid>
                <Grid item xs={2.1}>
                  <Typography>Obs.</Typography>
                </Grid>
              </Grid>

              {/* Itens da categoria */}
              {(itensPorCategoria[cat.id] || []).map((item, index) => (
                <ItemRow
                  key={index}
                  catId={cat.id}
                  index={index}
                  item={item}
                  handleItemChange={handleItemChange}
                />
              ))}

              <Link
                component="button"
                variant="body2"
                onClick={() => handleAddItem(cat.id)}
                sx={{ mt: 1, display: "block" }}
              >
                + Adicionar Item
              </Link>
            </AccordionDetails>
          </Accordion>
        ))}

        <Paper sx={{ p: 2, mt: 2, bgcolor: "primary.dark", color: "white" }}>
          <Typography variant="h6">
            TOTAL PLANILHA: R$ {totalPlanilha.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
        </Paper>
      </Grid>

      {/* Direita - Totais e percentuais */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Valores
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Taxa de Impulsionamento (%)"
            type="number"
            value={totais.taxaImplantacao || 0}
            onChange={(e) => handleTotaisChange("taxaImplantacao", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Comissão Comercial (%)"
            type="number"
            value={totais.condicaoComercial || 0}
            onChange={(e) => handleTotaisChange("condicaoComercial", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Impostos (%)"
            type="number"
            value={totais.impostos || 0}
            onChange={(e) => handleTotaisChange("impostos", e.target.value)}
            sx={{ mb: 2 }}
          />

          <Paper sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="body1">TOTAL GERAL: R$ {formatCurrency(totalGeral)}</Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}
