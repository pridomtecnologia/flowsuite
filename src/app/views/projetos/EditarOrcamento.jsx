import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Tab, Tabs, styled, Button, IconButton, Icon } from "@mui/material";
import { Breadcrumb } from "app/components";
import axios from "axios";
import FormCadastroProjetoUpdate from "./FormCadastroProjetoUpdate";
import EditarPlanilhaCustosOrcamento from "./EditarPlanilhaCustosOrcamento";
import EditarUploaDocumentosPlanilha from "./EditarUploaDocumentosPlanilha";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import itensFixosPorCategoria from "../../data/itensFixosPorCategoria.json";

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
  const { id, id_job, job } = useParams();

  const [tab, setTab] = useState(0);
  const [statusProjeto, setStatusProjeto] = useState(0);
  const [transformarJob, seTransformarJob] = useState(0);
  const [totalGeralPlanilha, seTotalGeralPlanilha] = useState(0);
  // Estados globais
  const [formCadastro, setFormCadastro] = useState({});
  const [idFormCadastro, setIdFormCadastro] = useState({});

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
      const projetoId = id || id_job;

      if (!projetoId) {
        Swal.fire({
          title: "Erro",
          text: "ID do projeto não encontrado para atualização",
          icon: "error",
          confirmButtonText: "Fechar"
        });
        return;
      }

      const safeNumber = (val) => {
        if (val === null || val === undefined || val === "") return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
      };

      const itens = Object.entries(planilhaCustos.itensPorCategoria).flatMap(([categoriaId, arr]) =>
        arr.map((item) => ({
          nome_custo_orcamento_id: safeNumber(categoriaId),
          descricao: item.descricao || "",
          quantidade: safeNumber(item.qtd),
          valor_unitario: safeNumber(item.valorUnit),
          dias: safeNumber(item.dias),
          unidade: item.unid || "0",
          total: safeNumber(item.qtd) * safeNumber(item.valorUnit) * safeNumber(item.dias) || 0,
          observacao: item.obs || ""
        }))
      );

      const normalizarNumero = (valor) => {
        if (valor === null || valor === undefined || valor === "") return null;

        if (typeof valor === "string") {
          // remove separadores de milhar e converte vírgula decimal para ponto
          valor = valor.replace(/\./g, "").replace(",", ".");
        }

        const n = Number(valor);
        return isNaN(n) ? null : n;
      };

      const payload = {
        titulo: formCadastro.titulo,
        centro_custo_id: safeNumber(idFormCadastro.centro_custo_id),
        empresa_id: safeNumber(idFormCadastro.empresa_id),
        cliente_id: safeNumber(idFormCadastro.cliente_id),
        agencia_id: safeNumber(idFormCadastro.agencia_id),
        coprodutor_id: idFormCadastro.coprodutor_id,
        diretor_id: idFormCadastro.diretor_id,
        tipo_job_id: idFormCadastro.tipo_job_id,
        validade_orcamento:
          formCadastro.validadeOrcamento && dayjs(formCadastro.validadeOrcamento).isValid()
            ? dayjs(formCadastro.validadeOrcamento).format("YYYY-MM-DD")
            : null,
        planilha_custo: itens,
        imposto: safeNumber(planilhaCustos.totais.impostos),
        taxa_impulsionamento: safeNumber(planilhaCustos.totais.taxaImplantacao),
        comissao_comercial: safeNumber(planilhaCustos.totais.condicaoComercial),
        custo_com_honorarios: safeNumber(planilhaCustos.totais.custoProducaoComHonorarios),
        custo_sem_honorarios: safeNumber(planilhaCustos.totais.custoProducaoSemHonorarios),
        taxa_producao: safeNumber(planilhaCustos.totais.taxaProducao),
        taxa_liquidez: safeNumber(planilhaCustos.totais.taxaLiquidez),
        total_geral: normalizarNumero(planilhaCustos.totais.total_geral),
        total_planilha: normalizarNumero(planilhaCustos.totais.total_planilha)
      };

      await axios.put(`${api}projetos/atualizar/${projetoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      const formData = new FormData();

      documentos.forEach((file) => {
        if (file instanceof File) {
          formData.append("arquivos", file);
        }
      });

      await axios.post(`${api}projetos/create/arquivo/${projetoId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      Swal.fire({
        title: "Sucesso",
        text: "Orçamento atualizado com sucesso!",
        icon: "success",
        confirmButtonText: "Fechar"
      });

      navigate("/projetos/listar-projetos");
    } catch (error) {
      let errorMessage = "Erro ao atualizar o Orçamento!";
      if (error.response?.data?.detail) {
        errorMessage = JSON.stringify(error.response.data.detail);
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Erro",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Fechar"
      });
    }
  };

  const handleVoltar = async () => {
    if (job == 1) {
      navigate("/projetos/listar-projetos");
    } else {
      navigate("/projetos/jobs/listar-jobs");
    }

    setFormCadastro({});
    setPlanilhaCustos([]);
    setDocumentos([]);
  };

  const initialValues = {
    itensPorCategoria: categorias.reduce((acc, cat) => {
      acc[cat.id] = itensFixosPorCategoria[cat.id]
        ? itensFixosPorCategoria[cat.id].map((descricao) => ({
            descricao: descricao,
            qtd: 1,
            valorUnit: 0,
            dias: 1,
            unid: "0",
            obs: "",
            total: 0
          }))
        : [];
      return acc;
    }, {}),
    totais: {
      custoProducaoComHonorarios: 0,
      custoProducaoSemHonorarios: 0,
      taxaImplantacao: 0,
      condicaoComercial: 0,
      impostos: 0,
      taxaProducao: 0,
      taxaLiquidez: 0,
      total_planilha: 0,
      total_geral: 0
    }
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
        const dataValidade = data.validade_orcamento_projeto
          ? dayjs(data.validade_orcamento_projeto, "DD-MM-YYYY")
          : null;

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
          validadeOrcamento: dataValidade
        });

        setIdFormCadastro({
          centro_custo_id: data.id_centro_custo,
          empresa_id: data.id_empresa,
          cliente_id: data.id_cliente,
          agencia_id: data.id_agencia,
          coprodutor_id: data.id_coprodutor,
          diretor_id: data.id_diretor,
          tipo_job_id: data.id_tipo_job,
          validadeOrcamento: dataValidade
        });

        if (data.planilha_custos && data.planilha_custos.length > 0) {
          const itensOrganizados = organizarItensPorCategoria(data.planilha_custos);

          setPlanilhaCustos((prev) => ({
            itensPorCategoria: itensOrganizados,
            totais: {
              taxaImplantacao: data.taxa_impulsionamento || 0,
              condicaoComercial: data.comissao_comercial || 0,
              custoProducaoComHonorarios: data.custo_com_honorarios || 0,
              custoProducaoSemHonorarios: data.custo_sem_honorarios || 0,
              taxaProducao: data.taxa_producao || 0,
              taxaLiquidez: data.taxa_liquidez || 0,
              impostos: data.imposto || 0,
              total_geral: data.total_geral || 0,
              total_planilha: data.total_planilha || 0
            }
          }));
        } else {
          // Se não houver dados, usar a estrutura inicial como no cadastro
          setPlanilhaCustos(initialValues);
        }

        seTotalGeralPlanilha(data.total_geral);
        setStatusProjeto(data.id_status_projeto);
        seTransformarJob(data.id_projeto);
      } catch (error) {
        console.error("Erro ao buscar orçamento:", error);
      }
    };

    const listArquivos = async () => {
      const responseArquivos = await axios.get(`${api}projetos/${id}/arquivos`, {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });
      setDocumentos(responseArquivos.data);
    };

    listProjetOrcamento();
    listArquivos();
  }, [id, id_job, api]);

  const organizarItensPorCategoria = (planilhaCustos) => {
    const itensOrganizados = categorias.reduce((acc, cat) => {
      acc[cat.id] = [];
      return acc;
    }, {});

    planilhaCustos.forEach((item) => {
      const categoriaId = item.nome_custo_orcamento_id.toString();

      if (itensOrganizados[categoriaId]) {
        itensOrganizados[categoriaId].push({
          descricao: item.descricao || "",
          qtd: item.quantidade || 1,
          valorUnit: item.valor_unitario || 0,
          dias: item.dias || 1,
          unid: item.unidade || "0",
          obs: item.observacao || "",
          total: item.total || 0
        });
      }
    });

    categorias.forEach((cat) => {
      if (itensOrganizados[cat.id].length === 0 && itensFixosPorCategoria[cat.id]) {
        itensOrganizados[cat.id] = itensFixosPorCategoria[cat.id].map((descricao) => ({
          descricao: descricao,
          qtd: 1,
          valorUnit: 0,
          dias: 1,
          unid: "0",
          obs: "",
          total: 0
        }));
      }
    });

    return itensOrganizados;
  };

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
        <Breadcrumb routeSegments={[{ name: "Atualizar Projeto" }]} />
      </Box>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: "5px",
          background: "#FFFFFF",
          borderRadius: 1,
          boxShadow: "0px 0px 5px 0px #0000001f",
          padding: "5px"
        }}
      >
        <Box>
          <Button sx={{ color: "red" }} onClick={handleVoltar}>
            <IconButton sx={{ color: "red" }}>
              <Icon color="white">arrow_back</Icon>
            </IconButton>
            Voltar
          </Button>
        </Box>

        {/* transformar em job */}
        <Box>
          <Button
            title="Transformar em JOB"
            sx={{
              display: statusProjeto == 2 || statusProjeto == 3 ? "none" : "flex",
              color: "green"
            }}
            onClick={handleTransformaJob}
          >
            {" "}
            <IconButton sx={{ color: "green" }}>
              {" "}
              <Icon color="white">swap_horiz</Icon>{" "}
            </IconButton>{" "}
            Transformar em JOB{" "}
          </Button>
        </Box>

        {/* Atualizar projeto */}
        <Box>
          <Button
            onClick={handleAtualizarOrcamento}
            sx={{
              display: statusProjeto == 2 || statusProjeto == 3 ? "none" : "flex",
              color: "blue"
            }}
          >
            <IconButton sx={{ color: "blue" }}>
              {" "}
              <Icon sx={{ color: "blue" }}>save</Icon>{" "}
            </IconButton>
            Atualizar Projeto
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          background: "#FFFFFF",
          borderRadius: 1,
          boxShadow: "0px 0px 5px 0px #0000001f",
          padding: 3
        }}
      >
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Identificação" />
          <Tab label="Planilha de Custos" />
          <Tab label="Pasta de Documentos" />
        </Tabs>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}></Box>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && (
            <FormCadastroProjetoUpdate
              values={formCadastro}
              onChange={setFormCadastro}
              idForm={idFormCadastro}
              onIdChange={setIdFormCadastro}
              statusProjeto={statusProjeto}
            />
          )}

          {tab === 1 && (
            <EditarPlanilhaCustosOrcamento
              values={planilhaCustos}
              onChange={setPlanilhaCustos}
              statusProjeto={statusProjeto}
            />
          )}

          {tab === 2 && (
            <EditarUploaDocumentosPlanilha
              arquivos={documentos}
              setArquivos={setDocumentos}
              id={id}
              statusProjeto={statusProjeto}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}
