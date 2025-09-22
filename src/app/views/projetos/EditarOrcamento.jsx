import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Tab, Tabs, styled, Button, IconButton, Icon } from "@mui/material";
import { Breadcrumb } from "app/components";
import axios from "axios";
import FormCadastroProjetoUpdate from "./FormCadastroProjetoUpdate";
import EditarPlanilhaCustosOrcamento from "./EditarPlanilhaCustosOrcamento";
import EditarUploaDocumentosPlanilha from "./EditarUploaDocumentosPlanilha";
import dayjs from "dayjs";

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
  const { id, job, id_job } = useParams();
  const [tab, setTab] = useState(0);
  const [statusProjeto, setStatusProjeto] = useState(0);
  const [transformarJob, seTransformarJob] = useState(0);

  // Estados globais
  const [formCadastro, setFormCadastro] = useState({});

  const [planilhaCustos, setPlanilhaCustos] = useState({
    itensPorCategoria: categorias.reduce((acc, cat) => {
      acc[cat.id] = [{ descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "un", obs: "" }];
      return acc;
    }, {}),
    totais: { taxaImplantacao: 0.0, condicaoComercial: 0.0, impostos: 0.0 }
  });

  const [documentos, setDocumentos] = useState([]);

  const [planilha, setPlanilha] = useState([]);

  const [formValues, setFormValues] = useState({
    titulo: "",
    centro_custo_id: "",
    empresa_id: "",
    cliente_id: "",
    agencia_id: "",
    coprodutor_id: "",
    diretor_id: "",
    tipo_job_id: "",
    validadeOrcamento: null,
    imposto: "",
    taxa_impulsionamento: "",
    comissao_comercial: "",
    total_geral: "",
    total_planilha: ""
  });

  const handleChangeValues = (newValues) => {
    setFormValues(newValues);
  };

  const navigate = useNavigate();

  const handleChange = (event, newValue) => setTab(newValue);

  // Função para montar JSON no formato do backend
  const montarPayload = () => {
    const itens = [];
    Object.entries(planilhaCustos.itensPorCategoria).forEach(([catId, lista]) => {
      lista.forEach((item) => {
        if (item.descricao) {
          itens.push({
            nome_custo_orcamento_id: parseInt(catId, 10),
            descricao: item.descricao,
            quantidade: item.qtd,
            valor_unitario: item.valorUnit,
            dias: item.dias,
            unidade: item.unid,
            total: item.qtd * item.valorUnit * item.dias,
            observacao: item.obs
          });
        }
      });
    });

    const totalPlanilha = itens.reduce((acc, i) => acc + i.total, 0);
    const valorTaxa = (totalPlanilha * planilhaCustos.totais.taxaImplantacao) / 100;
    const valorImpostos = (totalPlanilha * planilhaCustos.totais.impostos) / 100;
    const totalGeral =
      totalPlanilha + valorTaxa + valorImpostos + Number(planilhaCustos.totais.condicaoComercial);

    return {
      ...formCadastro,
      planilha_custo: itens,
      imposto: planilhaCustos.totais.impostos,
      taxa_impulsionamento: planilhaCustos.totais.taxaImplantacao,
      comissao_comercial: planilhaCustos.totais.condicaoComercial,
      total_geral: totalGeral,
      total_planilha: totalPlanilha
    };
  };

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const handleSalvar = async () => {
    try {
      const safeNumber = (val) => {
        const n = Number(val);
        return isNaN(n) ? null : n;
      };

      const payload = {
        titulo: formValues.titulo,
        centro_custo_id: safeNumber(formValues.centro_custo_id),
        empresa_id: safeNumber(formValues.empresa_id),
        cliente_id: safeNumber(formValues.cliente_id),
        agencia_id: safeNumber(formValues.agencia_id),
        coprodutor_id: formValues.coprodutor_id ? safeNumber(formValues.coprodutor_id) : null,
        diretor_id: formValues.diretor_id ? safeNumber(formValues.diretor_id) : null,
        tipo_job_id: formValues.tipo_job_id ? safeNumber(formValues.tipo_job_id) : null,
        validade_orcamento:
          formValues.validadeOrcamento && dayjs(formValues.validadeOrcamento).isValid()
            ? dayjs(formValues.validadeOrcamento).format("YYYY-MM-DD")
            : null,

        planilha_custo: planilha.map((item) => ({
          nome_custo_orcamento_id: safeNumber(item.nome_custo_orcamento_id),
          descricao: item.descricao || null,
          quantidade: safeNumber(item.quantidade),
          valor_unitario: safeNumber(item.valor_unitario),
          dias: safeNumber(item.dias),
          unidade: item.unidade || null,
          total: safeNumber(item.total),
          observacao: item.observacao || null
        })),
        imposto: safeNumber(formValues.imposto),
        taxa_impulsionamento: safeNumber(formValues.taxa_impulsionamento),
        comissao_comercial: safeNumber(formValues.comissao_comercial),
        total_geral: safeNumber(formValues.total_geral),
        total_planilha: safeNumber(formValues.total_planilha)
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

      // ✅ limpa os campos após salvar
      setFormValues({
        titulo: "",
        centro_custo_id: "",
        empresa_id: "",
        cliente_id: "",
        agencia_id: "",
        coprodutor_id: "",
        diretor_id: "",
        tipo_job_id: "",
        validadeOrcamento: null,
        imposto: "",
        taxa_impulsionamento: "",
        comissao_comercial: "",
        total_geral: "",
        total_planilha: ""
      });
      setPlanilha([]);
      setDocumentos([]);

      alert("Orçamento criado com sucesso!");
    } catch (error) {
      console.error("❌ Erro no envio:", error);
    }
  };

  const handleVoltar = async () => {
    if (job == 1) {
      navigate("/projetos/listar-projetos");
    } else {
      navigate("/projetos/jobs/listar-jobs");
    }

    setFormCadastro({});
    setPlanilhaCustos({
      itensPorCategoria: categorias.reduce((acc, cat) => {
        acc[cat.id] = [{ descricao: "", qtd: 1, valorUnit: 0, dias: 1, unid: "un", obs: "" }];
        return acc;
      }, {}),
      totais: { taxaImplantacao: 0.0, condicaoComercial: 0.0, impostos: 0.0 }
    });
    setDocumentos([]);
  };

  useEffect(() => {
    const listProjetoOrcamento = async () => {
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
        setFormValues((prev) => ({
          ...prev,
          titulo: data.titulo,
          centro_custo_id: data.centro_custo_id,
          empresa_id: data.empresa_id,
          cliente_id: data.cliente_id,
          agencia_id: data.agencia_id,
          coprodutor_id: data.coprodutor_id,
          diretor_id: data.diretor_id,
          tipo_job_id: data.tipo_job_id,
          validadeOrcamento: data.validade_orcamento,
          imposto: data.imposto,
          taxa_impulsionamento: data.taxa_impulsionamento,
          comissao_comercial: data.comissao_comercial,
          total_geral: data.total_geral,
          total_planilha: data.total_planilha
        }));
        setStatusProjeto(data.id_status_projeto);
        seTransformarJob(data.id_projeto);
      } catch (error) {
        // console.error("Erro ao buscar orçamento:", error);
        // alert(error);
      }
    };

    listProjetoOrcamento();
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

      {/* Botão de salvar */}
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
            onClick={handleSalvar}
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
        {tab === 0 && <FormCadastroProjetoUpdate values={formValues} onChange={setFormValues} />}

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
