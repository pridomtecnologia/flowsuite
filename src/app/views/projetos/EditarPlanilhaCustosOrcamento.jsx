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
import itensFixosPorCategoria from "../../data/itensFixosPorCategoria.json";

const categorias = [
  { id: "1", nome: "PRÉ-PRODUÇÃO" },
  { id: "2", nome: "PRODUÇÃO" },
  { id: "3", nome: "CENOGRAFIA" },
  { id: "4", nome: "TRANSPORTES" },
  { id: "5", nome: "EQUIPE DE FILMAGEM" },
  { id: "6", nome: "ELENCO" },
  { id: "7", nome: "ALIMENTAÇÃO" },
  { id: "8", nome: "HOSPEDAGENS" },
  { id: "9", nome: "PASSAGENS AÉREAS" },
  { id: "10", nome: "EQUIPAMENTO DE CÂMERA" },
  { id: "11", nome: "EQUIPAMENTOS DE LUZ" },
  { id: "12", nome: "FINALIZAÇÃO DE SOM/OUTROS" },
  { id: "13", nome: "NEGATIVOS/FITAS" },
  { id: "14", nome: "OUTROS" },
  { id: "15", nome: "PÓS-PRODUÇÃO" },
  { id: "16", nome: "ESTÚDIO E LOCAÇÕES" },
  { id: "17", nome: "COMP.GRÁFICA/STOCK SHOT" },
  { id: "18", nome: "ALUGUÉIS" }
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
const ItemRow = React.memo(function ItemRow({
  catId,
  index,
  item,
  handleItemChange,
  statusProjeto,
  formatCurrency
}) {
  const total = (item.qtd || 0) * (item.valorUnit || 0) * (item.dias || 1);

  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={3.5}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          value={item.descricao || ""}
          onChange={(e) => handleItemChange(catId, index, "descricao", e.target.value)}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          type="number"
          value={item.qtd || 1}
          onChange={(e) => handleItemChange(catId, index, "qtd", Number(e.target.value))}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          type="number"
          step="0.01"
          value={item.valorUnit || 0}
          onChange={(e) => handleItemChange(catId, index, "valorUnit", Number(e.target.value))}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          type="number"
          value={item.dias || 1}
          onChange={(e) => handleItemChange(catId, index, "dias", Number(e.target.value))}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={1.2}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          type="number"
          value={item.unid || 0}
          onChange={(e) => handleItemChange(catId, index, "unid", Number(e.target.value))}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={1.6}>
        <input
          style={{ ...inputStyle, background: "#e0e0e06b" }}
          readOnly
          value={`R$ ${formatCurrency(item.total)}`}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>

      <Grid item xs={2.1}>
        <input
          style={{
            ...inputStyle,
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "white"
          }}
          value={item.obs || ""}
          onChange={(e) => handleItemChange(catId, index, "obs", e.target.value)}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Grid>
    </Grid>
  );
});

export default function EditarPlanilhaCustosOrcamento({ values, onChange, statusProjeto }) {
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
        const unid = Number(item.unid || 0);

        if (unid > 0) {
          item.total = qtd * valorUnit * dias * unid;
        } else {
          item.total = qtd * valorUnit * dias;
        }

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
      return (
        accCat +
        itens.reduce((accItem, item) => {
          const qtd = Number(item.qtd || 0);
          const v = Number(item.valorUnit || 0);
          const d = Number(item.dias || 0);
          const u = Number(item.unid || 0);

          let total = qtd * v * d;
          if (u > 0) {
            total = total * u;
          }

          return accItem + total;
        }, 0)
      );
    }, 0);
  }, [itensPorCategoria]);

  const totalGeral = useMemo(() => {
    const valorBase = totalPlanilha;

    const percCustoHonorarios = parseFloat(totais.custoProducaoComHonorarios) || 0;
    const percImpulsionamento = parseFloat(totais.taxaImplantacao) || 0;
    const percComissao = parseFloat(totais.condicaoComercial) || 0;
    const percTaxaProducao = parseFloat(totais.taxaProducao) || 0;
    const percTaxaLiquidez = parseFloat(totais.taxaLiquidez) || 0;
    const percImpostos = parseFloat(totais.impostos) || 0;
    const percCustoSemHonorarios = parseFloat(totais.custoProducaoSemHonorarios) || 0;

    const valorCustoHonorarios = valorBase * (percCustoHonorarios / 100);

    const valorImpulsionamento = valorBase * (percImpulsionamento / 100);

    const valorComissao = valorBase * (percComissao / 100);

    const subtotalParaTaxaProducao =
      valorBase + valorCustoHonorarios + valorImpulsionamento + valorComissao;

    const valorTaxaProducao = subtotalParaTaxaProducao * (percTaxaProducao / 100);

    const valorTaxaLiquidez = subtotalParaTaxaProducao * (percTaxaLiquidez / 100);

    const valorCustoSemHonorarios = valorBase * (percCustoSemHonorarios / 100);

    const baseParaImpostos =
      valorBase +
      valorCustoHonorarios +
      valorImpulsionamento +
      valorComissao +
      valorTaxaProducao +
      valorTaxaLiquidez +
      valorCustoSemHonorarios;

    const totalGeral = baseParaImpostos / (1 - percImpostos / 100);

    return totalGeral;
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

  const totaisPorCategoria = useMemo(() => {
    const result = {};

    Object.entries(itensPorCategoria).forEach(([catId, itens]) => {
      result[catId] = itens.reduce((acc, item) => {
        const qtd = Number(item.qtd || 0);
        const valorUnit = Number(item.valorUnit || 0);
        const dias = Number(item.dias || 0);
        const unid = Number(item.unid || 0);

        let total = qtd * valorUnit * dias;
        if (unid > 0) {
          total = total * unid;
        }

        return acc + total;
      }, 0);
    });
    return result;
  }, [itensPorCategoria]);

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
              sx={{
                mt: 1,
                color: "#6c7216ff",
                border: "0.5px solid #6c721681",
                borderRadius: 2
              }}
            >
              <Typography>{`${cat.id} - ${cat.nome} (R$ ${formatCurrency(
                totaisPorCategoria[cat.id] || 0
              )})`}</Typography>
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
                  statusProjeto={statusProjeto}
                  formatCurrency={formatCurrency}
                />
              ))}

              <Link
                component="button"
                variant="body2"
                onClick={() => handleAddItem(cat.id)}
                sx={{
                  mt: 1,
                  display: "block",
                  color: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "blue"
                }}
                disabled={statusProjeto == 2 || statusProjeto == 3}
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
            label="Custo de Produção com Honorários (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.custoProducaoComHonorarios === 0 ? "" : totais.custoProducaoComHonorarios}
            onChange={(e) => handleTotaisChange("custoProducaoComHonorarios", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <TextField
            fullWidth
            size="small"
            label="Taxa de Impulsionamento (%)"
            type="number"
            value={totais.taxaImplantacao || 0}
            onChange={(e) => handleTotaisChange("taxaImplantacao", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <TextField
            fullWidth
            size="small"
            label="Comissão Comercial (%)"
            type="number"
            value={totais.condicaoComercial || 0}
            onChange={(e) => handleTotaisChange("condicaoComercial", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <TextField
            fullWidth
            size="small"
            label="Taxa de Produção (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.taxaProducao === 0 ? "" : totais.taxaProducao}
            onChange={(e) => handleTotaisChange("taxaProducao", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <TextField
            fullWidth
            size="small"
            label="Taxa de Liquidez (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.taxaLiquidez === 0 ? "" : totais.taxaLiquidez}
            onChange={(e) => handleTotaisChange("taxaLiquidez", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          {/* ja corrigir */}
          <TextField
            fullWidth
            size="small"
            label="Custo de Produção sem Honorários (%)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={totais.custoProducaoSemHonorarios === 0 ? "" : totais.custoProducaoSemHonorarios}
            onChange={(e) => handleTotaisChange("custoProducaoSemHonorarios", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <TextField
            fullWidth
            size="small"
            label="Impostos (%)"
            type="number"
            value={totais.impostos || 0}
            onChange={(e) => handleTotaisChange("impostos", e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
            }}
            disabled={statusProjeto == 2 || statusProjeto == 3}
          />

          <Paper sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="body1">TOTAL GERAL: R$ {formatCurrency(totalGeral)}</Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}
