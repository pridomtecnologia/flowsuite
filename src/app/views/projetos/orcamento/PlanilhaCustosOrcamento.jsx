import { useEffect, useMemo } from "react";
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
import React from "react";

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
const defaultItem = { qtd: 1, valorUnit: 0, dias: 1, unid: "0", obs: "" };

// Itens fixos por categoria
const itensFixosPorCategoria = {
  1: [
    "Pesquisa",
    "Roteirista",
    "Shooting Board",
    "Tradução",
    "Impressão / Xerox",
    "Estudo Parte Teste de VT 1",
    "Estudo Parte Teste de VT 2",
    "Operador de câmera Teste VT 1",
    "Operador de câmera Teste VT 2",
    "Câmera Teste de VT",
    "Luz para Teste de VT",
    "Maquiador",
    "Camareira de Teste - VT",
    "Direção TVT",
    "Editor",
    "Ajudante para TVT 1",
    "Ajudante para TVT 2",
    "Cache Presença",
    "HD para TVT",
    "Verba Alimentação",
    "Verba Pre Produção",
    "Telefones",
    "Xerox",
    "Outros",
    "Transf. Borderô"
  ],
  2: [
    "Taxa de Locações - PJ 1",
    "Taxa de Locações - PF 2",
    "Impostos / Locações - PF",
    "Base para filmagem 1",
    "Base para filmagem 2",
    "Gratificações",
    "Policiamento",
    "Verba Objeto 1",
    "Verba Objeto 2",
    "Verba Figurino1",
    "Verba Figurino2",
    "Lavanderia",
    "Compra de produto para Filmagem",
    "Aluguel de Veículos para a Cena",
    "Envelopamento do carro dourado",
    "Seguro de carros",
    "Animais",
    "Alimentos p filmagem",
    "Teleprompter",
    "Banheiro Químico",
    "Camarim",
    "Play Back",
    "Caixa de Produção 1",
    "Caixa de Produção 2",
    "Mapas Meteorologicos",
    "Caminhão Pipa",
    "Ambulancia",
    "Verba de Produção",
    "Outros",
    "Transf. Borderô"
  ],
  3: [
    "Estúdio - Diárias Filmagens",
    "Estúdio - Diárias Preparação e pré light",
    "Material Construção",
    "Aderecista",
    "Cenotecnico",
    "Pintor",
    "Tinta",
    "Ar Condicionado",
    "Bombeiro para montagem de cenário",
    "Outros Gastos com Cenografia",
    "Transf. Borderô"
  ],
  4: [
    "Carros de de Pre Produção",
    "Carros de de Produção",
    "Carros de de Prod. Figurino",
    "Carros de Pre Prod. de Figurino",
    "Carros de Pre Prod de Objetos",
    "Carros de Prod de Objetos",
    "Carros de Prod de Locação",
    "Carros Alimentação",
    "Carros de Filmagem",
    "Carros de Camera",
    "Carro de Agencia / Cliente",
    "Carro de Diretor",
    "Onibus",
    "Pick-up",
    "Caminhão",
    "Taxi Estacionamento Pedagio",
    "Guincho",
    "Aluguel de Carros",
    "Motoboy",
    "Combustível",
    "Currier",
    "Outros",
    "Transf. Borderô"
  ],
  5: [
    "Diretor de Fotografia",
    "Operador de Steady",
    "1º Asst. Câmera 1",
    "2º Asst. Câmera 1",
    "Vídeo Assist 1",
    "Logger 1",
    "Assistente de Elétrica",
    "Diretor de Produção 1",
    "Luz de Estúdio Produção 1",
    "2º Assist. Produção",
    "Rádio",
    "Produtor de Arte",
    "Assistente de Arte",
    "Produtor de Elétrica",
    "Produtor de Maquinária",
    "Gaffer",
    "Maquinista",
    "Assistente de Maquinista",
    "Dir. Maquiador",
    "Cabelereiro",
    "Maquiador",
    "Especialista em Maquiagem",
    "Técnico de Efeitos Especiais",
    "Eletricista",
    "Assistente de Elétrica 2",
    "Assistente de Produção 2",
    "Motorista",
    "Assistente de Motorista",
    "Produtor de Locação",
    "Assistente de Locação",
    "Coordenador de Produção",
    "Assistente de Coordenação",
    "Auxiliar de Produção",
    "Auxiliar de Serviços Gerais",
    "Segurança"
  ],
  6: [
    "Ator Principal 1",
    "Ator Principal 2",
    "Atores Coadjuvantes 1",
    "Modelo 1",
    "Modelo 2",
    "Crianças 1",
    "Figuração Especial",
    "Outros Gastos com Elenco",
    "Transf. Borderô"
  ],
  7: [
    "Alimentação de Pre / Pós Prod.",
    "Alimentação de Filmagem 1",
    "Alimentação de Filmagem 2",
    "Verba de Manutenção Filmagem",
    "Cache de Manutenção",
    "Transf. Borderô"
  ],
  8: [
    "Hotel Pré-pesquisa",
    "Hotel Equipe",
    "Hotel Cliente",
    "Hotel Agencia",
    "Hotel Celebridade",
    "Pernoitem Equipe",
    "Transf. Borderô"
  ],
  9: [
    "Agencia",
    "Cliente",
    "Equipe - Filmagem",
    "Excesso de Bagagem",
    "Outras despesas de passagens",
    "Transf. Borderô"
  ],
  10: [
    "Câmera 1",
    "Acessórios de Camera",
    "Lentes 1",
    "Motion Control",
    "Travelling",
    "Rádios",
    "Transf. Borderô"
  ],
  11: ["Luz 1", "Gerador Grande", "Gerador Pq", "Estrutura de Iluminação", "Transf. Borderô"],
  12: ["Trilha Sonora", "Locução", "Estúdio de Som", "Transf. Borderô"],
  13: [
    "Edição",
    "Motion",
    "Correção de Cor",
    "Montador",
    "Stock Shot",
    "Cópia de Trabalho",
    "Transf. Borderô"
  ],
  14: ["Condecine", "Sindicine", "Seguro", "Sated", "Assessoria Jurídica", "Testagem COVID-19"],
  15: ["Fora Taxa 1", "Fora Taxa 2", "Fora Taxa 3"]
};

// Estado inicial de itens por categoria
export const initialItensPorCategoria = categorias.reduce((acc, cat) => {
  if (itensFixosPorCategoria[cat.id]) {
    acc[cat.id] = itensFixosPorCategoria[cat.id].map((descricao) => ({
      ...defaultItem,
      descricao
    }));
  } else {
    acc[cat.id] = [];
  }
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

// Linha de item otimizada
const ItemRow = React.memo(function ItemRow({ catId, index, item, handleItemChange }) {
  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={3.5}>
        <TextField
          fullWidth
          size="small"
          value={item.descricao}
          onChange={(e) => handleItemChange(catId, index, "descricao", e.target.value)}
        />
      </Grid>
      <Grid item xs={1.2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={item.qtd}
          onChange={(e) => handleItemChange(catId, index, "qtd", e.target.value)}
        />
      </Grid>
      <Grid item xs={1.2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={item.valorUnit}
          onChange={(e) => handleItemChange(catId, index, "valorUnit", e.target.value)}
        />
      </Grid>
      <Grid item xs={1.2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={item.dias}
          onChange={(e) => handleItemChange(catId, index, "dias", e.target.value)}
        />
      </Grid>
      <Grid item xs={1.2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={item.unid}
          onChange={(e) => handleItemChange(catId, index, "unid", e.target.value)}
        />
      </Grid>
      <Grid item xs={1.6}>
        <TextField
          fullWidth
          size="small"
          disabled
          sx={{ bgcolor: "#e0e0e06b" }}
          value={`R$ ${(item.total || 0).toFixed(2)}`}
        />
      </Grid>
      <Grid item xs={2.1}>
        <TextField
          fullWidth
          size="small"
          value={item.obs}
          onChange={(e) => handleItemChange(catId, index, "obs", e.target.value)}
        />
      </Grid>
    </Grid>
  );
});

export default function PlanilhaCustosOrcamento({ values, onChange }) {
  const { itensPorCategoria, totais } = values;

  // adicionar item
  const handleAddItem = (catId) => {
    onChange((prev) => ({
      ...prev,
      itensPorCategoria: {
        ...prev.itensPorCategoria,
        [catId]: [...prev.itensPorCategoria[catId], { ...defaultItem, descricao: "" }]
      }
    }));
  };

  // mudar valor de item
  const handleItemChange = (catId, index, field, value) => {
    onChange((prev) => {
      const novosItens = [...prev.itensPorCategoria[catId]];
      let item = { ...novosItens[index] };

      item[field] =
        field === "descricao" || field === "obs" || field === "unid" ? value : Number(value);

      item.total = (item.qtd || 0) * (item.valorUnit || 0) * (item.dias || 0);
      novosItens[index] = item;

      return {
        ...prev,
        itensPorCategoria: { ...prev.itensPorCategoria, [catId]: novosItens }
      };
    });
  };

  // mudar totais
  const handleTotaisChange = (field, rawValue) => {
    const value = rawValue.replace(",", ".");
    onChange((prev) => ({
      ...prev,
      totais: {
        ...prev.totais,
        [field]: value === "" ? 0 : parseFloat(value)
      }
    }));
  };

  // cálculos otimizados
  const totalPlanilha = useMemo(() => {
    return Object.values(itensPorCategoria).reduce(
      (accCat, itens) =>
        accCat +
        itens.reduce((accItem, item) => accItem + item.qtd * item.valorUnit * item.dias, 0),
      0
    );
  }, [itensPorCategoria]);

  const totalGeral = useMemo(() => {
    const valorTaxa = (totalPlanilha * Number(totais.taxaImplantacao)) / 100;
    const valorImpostos = (totalPlanilha * Number(totais.impostos)) / 100;
    return totalPlanilha + valorTaxa + valorImpostos + Number(totais.condicaoComercial);
  }, [totalPlanilha, totais]);

  // atualizar totais sempre que mudar
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
          <Accordion key={cat.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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

              {/* Linhas */}
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
