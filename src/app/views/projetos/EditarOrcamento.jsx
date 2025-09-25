import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  styled,
  Button,
  IconButton,
  Icon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Paper,
  Link
} from "@mui/material";
import { Breadcrumb } from "app/components";
import axios from "axios";
import FormCadastroProjetoUpdate from "./FormCadastroProjetoUpdate";
import EditarPlanilhaCustosOrcamento from "./EditarPlanilhaCustosOrcamento";
import EditarUploaDocumentosPlanilha from "./EditarUploaDocumentosPlanilha";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

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

export default function EditarOrcamento() {
  const { id, id_job } = useParams();

  const [tab, setTab] = useState(0);
  const [statusProjeto, setStatusProjeto] = useState(0);
  const [transformarJob, seTransformarJob] = useState(0);
  const [totalGeralPlanilha, seTotalGeralPlanilha] = useState(0);
  // Estados globais
  const [formCadastro, setFormCadastro] = useState({});

  const [planilhaCustos, setPlanilhaCustos] = useState({
    itensPorCategoria: categorias.reduce((acc, cat) => {
      acc[cat.id] = [{ descricao: "", qtd: 0, valorUnit: 0, dias: 0, unid: "0", obs: "" }];
      return acc;
    }, {}),
    totais: {
      taxaImplantacao: 0.0,
      condicaoComercial: 0.0,
      impostos: 0.0,
      total_geral: 0.0,
      total_planilha: 0.0
    }
  });

  const [documentos, setDocumentos] = useState([]);

  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const handleAtualizarOrcamento = async () => {
    try {
      const safeNumber = (val) => {
        const n = Number(val);
        return isNaN(n) ? null : n;
      };

      const itens = Object.entries(planilhaCustos.itensPorCategoria)
        .filter(([_, v]) => Array.isArray(v))
        .flatMap(([categoriaId, arr]) =>
          arr
            .map((item) => ({
              nome_custo_orcamento_id: safeNumber(categoriaId),
              descricao: item.descricao,
              quantidade: safeNumber(item.qtd),
              valor_unitario: safeNumber(item.valorUnit),
              dias: safeNumber(item.dias),
              unidade: item.unid,
              total: safeNumber(item.qtd) * safeNumber(item.valorUnit) * safeNumber(item.dias) || 0,
              observacao: item.obs
            }))
            // 🔥 só entra no payload se tiver valor significativo
            .filter((item) => item.total > 0)
        );

      const payload = {
        titulo: formCadastro.titulo,
        centro_custo_id: safeNumber(formCadastro.centroCustoId?.id),
        empresa_id: safeNumber(formCadastro.empresaId?.id),
        cliente_id: safeNumber(formCadastro.clienteId?.id),
        agencia_id: safeNumber(formCadastro.agenciaId?.id),
        coprodutor_id: formCadastro.coprodutorId ? safeNumber(formCadastro.coprodutorId.id) : null,
        diretor_id: formCadastro.diretorId ? safeNumber(formCadastro.diretorId.id) : null,
        tipo_job_id: formCadastro.tipoJobId ? safeNumber(formCadastro.tipoJobId.id) : null,
        validade_orcamento:
          formCadastro.validadeOrcamento && dayjs(formCadastro.validadeOrcamento).isValid()
            ? dayjs(formCadastro.validadeOrcamento).format("YYYY-MM-DD")
            : null,

        planilha_custo: itens,
        imposto: safeNumber(planilhaCustos.totais.impostos),
        taxa_impulsionamento: safeNumber(planilhaCustos.totais.taxaImplantacao),
        comissao_comercial: safeNumber(planilhaCustos.totais.condicaoComercial),
        total_geral: safeNumber(planilhaCustos.totais.total_geral),
        total_planilha: safeNumber(planilhaCustos.totais.total_planilha)
      };

      const formData = new FormData();
      formData.append("projeto_json", JSON.stringify(payload));

      documentos.forEach((file) => {
        formData.append("arquivos", file);
      });

      await axios.post(`${api}projetos/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setFormCadastro({});
      setPlanilhaCustos([]);
      setDocumentos([]);

      Swal.fire({
        title: "",
        text: "Orçamento atualizado com sucesso!",
        icon: "success"
      });

      navigate("/projetos/listar-projetos");
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao criar o Orçamento!",
        icon: "error"
      });
      console.error("❌ Erro no envio:", error);
    }
  };

  const handleVoltar = async () => {
    navigate("/projetos/listar-projetos");

    setFormCadastro({});
    setPlanilhaCustos([]);
    setDocumentos([]);
  };

  useEffect(() => {
    const listProjetOrcamento = async () => {
      try {
        let urlProjeto = null;

        if (id_job == 0) {
          urlProjeto = `${api}projetos/listar/${id}`;
        } else {
          urlProjeto = `${api}projetos/listar-job/${id_job}`;
        }

        const response = await axios.get(urlProjeto, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        const data = response.data;

        setFormCadastro({
          numerOrcamento: data.numero_orcamento,
          titulo: data.titulo,
          centroCustoId: data.centro_custo,
          empresaId: data.empresa,
          agenciaId: data.agencia,
          clienteId: data.cliente,
          coprodutorId: data.coprodutor,
          diretorId: data.diretor,
          tipoJobId: data.tipo_job,
          validadeOrcamento: data.validade_orcamento_projeto
        });

        setPlanilhaCustos((prev) => ({
          ...prev,
          totais: {
            ...prev.totais,
            impostos: data.imposto,
            taxaImplantacao: data.taxa_impulsionamento,
            condicaoComercial: data.comissao_comercial,
            total_geral: data.total_geral,
            total_planilha: data.total_planilha
          }
        }));

        seTotalGeralPlanilha(data.total_geral);

        setStatusProjeto(data.id_status_projeto);
        seTransformarJob(data.id_projeto);
      } catch (error) {
        // console.error("Erro ao buscar orçamento:", error);
        // alert(error);
      }
    };

    listProjetOrcamento();
  }, [id, api]);

  const handleTransformaJob = async () => {
    try {
      const response_job = await axios.post(`${api}projetos/job/${transformarJob}`, {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      navigate("/projetos/jobs/listar-jobs");
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      alert("Erro ao transformar o projeto em Job");
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Cadastrar Projeto" }]} />
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: "5px" }}>
        <Box>
          <Button variant="contained" color="primary" onClick={handleVoltar}>
            <IconButton color="white">
              {" "}
              <Icon color="white">arrow_back</Icon>{" "}
            </IconButton>
            Voltar
          </Button>
        </Box>

        {/* transformar em job */}
        <Box>
          <Button
            variant="contained"
            title="Transformar em JOB"
            sx={{ display: statusProjeto == 2 || statusProjeto == 3 ? "none" : "flex" }}
            onClick={handleTransformaJob}
          >
            {" "}
            <IconButton color="white">
              {" "}
              <Icon color="white">swap_horiz</Icon>{" "}
            </IconButton>{" "}
            Transformar em JOB{" "}
          </Button>
        </Box>

        {/* Atualizar projeto */}
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAtualizarOrcamento}
            sx={{ display: statusProjeto == 2 || statusProjeto == 3 ? "none" : "flex" }}
          >
            <IconButton color="white">
              {" "}
              <Icon color="white">save</Icon>{" "}
            </IconButton>
            Atualizar Projeto
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Identificação" />
        <Tab label="Planilha de Custos" />
        <Tab label="Pasta de Documentos" />
      </Tabs>

      <Box>
        {tab === 0 && (
          <FormCadastroProjetoUpdate values={formCadastro} onChange={setFormCadastro} />
        )}

        {tab === 1 && (
          <EditarPlanilhaCustosOrcamento values={planilhaCustos} onChange={setPlanilhaCustos} />
        )}
        {tab === 2 && (
          <EditarUploaDocumentosPlanilha arquivos={documentos} setArquivos={setDocumentos} />
        )}
      </Box>
    </Container>
  );
}
