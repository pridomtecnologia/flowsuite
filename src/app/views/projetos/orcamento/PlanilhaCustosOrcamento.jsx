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
import itensFixosPorCategoria from "../../../data/itensFixosPorCategoria.json";

// Categorias fixas
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

// Valores padrão para cada item
const defaultItem = { qtd: 1, valorUnit: 0, dias: 1, unid: "0", obs: "", nome_custo_projeto_id: 0 };

const createDefaultItem = (catId, descricao = "") => ({
  qtd: 1,
  valorUnit: 0,
  dias: 1,
  unid: "0",
  obs: "",
  descricao,
  nome_custo_projeto_id: Number(catId)
});

// Estado inicial de itens por categoria (começa vazio para lazy load)
export const initialItensPorCategoria = categorias.reduce((acc, cat) => {
  acc[cat.id] = itensFixosPorCategoria[cat.id]
    ? itensFixosPorCategoria[cat.id].map((descricao) => createDefaultItem(cat.id, descricao))
    : [];
  return acc;
}, {});

// Estado inicial completo
export const initialValues = {
  itensPorCategoria: initialItensPorCategoria,
  totais: {
    taxaImplantacao: 0,
    condicaoComercial: 0,
    impostos: 0,
    total_planilha: 0,
    total_geral: 0
  }
};

// estilo reutilizável para inputs leves
const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.23)",
  boxSizing: "border-box",
  fontSize: 14,
  background: "white"
};

const parsePercent = (value) => {
  if (!value) return 0;
  const num = Number(String(value).replace(",", "."));
  if (isNaN(num)) return 0;

  // Se for menor que 1, trata como fração (0.05 = 5%)
  // Se for maior ou igual a 1, trata como inteiro normal (5 = 5%)
  return num < 1 ? num * 100 : num;
};

// Linha de item otimizada
const ItemRow = React.memo(function ItemRow({ catId, index, item, handleItemChange }) {
  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={3.5}>
        <input
          aria-label={`descricao-${catId}-${index}`}
          style={inputStyle}
          value={item.descricao}
          onChange={(e) => handleItemChange(catId, index, "descricao", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          aria-label={`qtd-${catId}-${index}`}
          style={inputStyle}
          type="number"
          value={item.qtd}
          onChange={(e) => handleItemChange(catId, index, "qtd", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          aria-label={`valorUnit-${catId}-${index}`}
          style={inputStyle}
          type="number"
          step="0.01"
          value={item.valorUnit}
          onChange={(e) => handleItemChange(catId, index, "valorUnit", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          aria-label={`dias-${catId}-${index}`}
          style={inputStyle}
          type="number"
          value={item.dias}
          onChange={(e) => handleItemChange(catId, index, "dias", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          aria-label={`unid-${catId}-${index}`}
          style={inputStyle}
          type="number"
          value={item.unid}
          onChange={(e) => handleItemChange(catId, index, "unid", e.target.value)}
        />
      </Grid>

      <Grid item xs={1.6}>
        <input
          aria-label={`total-${catId}-${index}`}
          style={{ ...inputStyle, background: "#e0e0e06b" }}
          readOnly
          value={`R$ ${(item.total || 0).toFixed(2)}`}
        />
      </Grid>

      <Grid item xs={2.1}>
        <input
          aria-label={`obs-${catId}-${index}`}
          style={inputStyle}
          value={item.obs}
          onChange={(e) => handleItemChange(catId, index, "obs", e.target.value)}
        />
      </Grid>
    </Grid>
  );
});

export default function PlanilhaCustosOrcamento({ values, onChange }) {
  const { itensPorCategoria, totais } = values;

  const handleAddItem = useCallback(
    (catId) => {
      onChange((prev) => ({
        ...prev,
        itensPorCategoria: {
          ...prev.itensPorCategoria,
          [catId]: [
            ...prev.itensPorCategoria[catId],
            createDefaultItem(catId),
            { ...defaultItem, descricao: "" }
          ]
        }
      }));
    },
    [onChange]
  );

  const handleItemChange = useCallback(
    (catId, index, field, value) => {
      onChange((prev) => {
        const novosItens = [...prev.itensPorCategoria[catId]];
        const item = { ...novosItens[index] };

        if (["descricao", "obs", "unid"].includes(field)) {
          item[field] = value;
        } else {
          item[field] = Number(value === "" ? 0 : value);
        }

        const qtd = Number(item.qtd || 0);
        const valorUnit = Number(item.valorUnit || 0);
        const dias = Number(item.dias || 0);
        item.total = qtd * valorUnit * dias;

        novosItens[index] = item;

        return {
          ...prev,
          itensPorCategoria: { ...prev.itensPorCategoria, [catId]: novosItens }
        };
      });
    },
    [onChange]
  );

  const handleTotaisChange = useCallback(
    (field, rawValue) => {
      const value = String(rawValue).replace(",", ".");
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
      return (
        accCat +
        itens.reduce((accItem, item) => {
          const qtd = Number(item.qtd || 0);
          const v = Number(item.valorUnit || 0);
          const d = Number(item.dias || 0);
          return accItem + qtd * v * d;
        }, 0)
      );
    }, 0);
  }, [itensPorCategoria]);

  const formatCurrency = (value) =>
    `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const totalGeral = useMemo(() => {
    const percImpulsionamento = parseFloat(totais.taxaImplantacao) || 0;
    const percComissao = parseFloat(totais.condicaoComercial) || 0;
    const percImpostos = parseFloat(totais.impostos) || 0;

    const valorImpulsionamento = totalPlanilha * (percImpulsionamento / 100);
    const valorComissao = totalPlanilha * (percComissao / 100);

    const subtotal = totalPlanilha + valorImpulsionamento + valorComissao;
    const valorImpostos = subtotal * (percImpostos / 100);

    const valorTotalGeral = subtotal + valorImpostos;

    return valorTotalGeral;
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

  return (
    <Grid container spacing={2}>
      {/* Esquerda */}
      <Grid item xs={9}>
        {categorias.map((cat) => (
          <Accordion
            key={cat.id}
            onChange={(_, expanded) => {
              if (
                expanded &&
                itensPorCategoria[cat.id].length === 0 &&
                itensFixosPorCategoria[cat.id]
              ) {
                onChange((prev) => ({
                  ...prev,
                  itensPorCategoria: {
                    ...prev.itensPorCategoria,
                    [cat.id]: itensFixosPorCategoria[cat.id].map((descricao) => ({
                      ...defaultItem,
                      descricao
                    }))
                  }
                }));
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ mt: 1, color: "#6c7216ff", border: "0.5px solid #6c721681", borderRadius: 2 }}
            >
              <Typography>{`${cat.id} - ${cat.nome}`}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ borderRadius: 2 }}>
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

              {itensPorCategoria[cat.id].map((item, index) => (
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
            label="Comissão Comercial (%)"
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
            <Typography variant="body1">TOTAL GERAL: R$ {formatCurrency(totalGeral)}</Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}
