import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Tab, Tabs, styled, Button, IconButton, Icon } from "@mui/material";
import { Breadcrumb } from "app/components";
import axios from "axios";
import PlanilhaCustosOrcamento, { initialValues } from "./orcamento/PlanilhaCustosOrcamento";
import FormCadastroProjeto from "./FormCadastroProjeto";
import UploaDocumentosPlanilha from "./uploaDocumentosPlanilha";
import dayjs from "dayjs";
import Swal from "sweetalert2";

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

export default function Adaptacao() {
  const [tab, setTab] = useState(0);

  // Estados globais
  const [formCadastro, setFormCadastro] = useState({});

  const [planilhaCustos, setPlanilhaCustos] = useState(initialValues);

  const [documentos, setDocumentos] = useState([]);

  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const handleSalvar = async () => {
    try {
      if (
        Object.keys(formCadastro).length == 0 ||
        formCadastro.titulo == undefined ||
        formCadastro.titulo == "" ||
        formCadastro.centroCustoId == null ||
        formCadastro.empresaId == null ||
        formCadastro.clienteId == null ||
        formCadastro.agenciaId == null ||
        formCadastro.coprodutorId == null ||
        formCadastro.diretorId == null ||
        formCadastro.tipoJobId == null ||
        formCadastro.validadeOrcamento == null
      ) {
        Swal.fire({
          title: "Atenção",
          text: "Obrigatório preencher todos os campos da identificação do projeto",
          icon: "warning",
          confirmButtonText: "Fechar"
        });

        return;
      }

      const safeNumber = (val) => {
        const n = Number(val);
        return isNaN(n) ? null : n;
      };

      const itens = Object.values(planilhaCustos.itensPorCategoria).flatMap((arr) =>
        arr
          .map((item) => ({
            nome_custo_orcamento_id: safeNumber(item.nome_custo_projeto_id),
            descricao: item.descricao,
            quantidade: safeNumber(item.qtd),
            valor_unitario: safeNumber(item.valorUnit),
            dias: safeNumber(item.dias),
            unidade: item.unid,
            total: safeNumber(item.qtd) * safeNumber(item.valorUnit) * safeNumber(item.dias) || 0,
            observacao: item.obs
          }))
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
        total_geral: planilhaCustos.totais.total_geral,
        total_planilha: safeNumber(planilhaCustos.totais.total_planilha)
      };

      // console.log(planilhaCustos);
      // return;
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
        text: "Orçamento criado com sucesso!",
        icon: "success"
      });

      navigate("/projetos/listar-projetos");
    } catch (error) {
      Swal.fire({
        title: "",
        text: error.response.data.detail,
        icon: "error"
      });
      console.error("❌ Erro no envio:", error.response.data.detail);
    }
  };

  const handleVoltar = async () => {
    navigate("/projetos/listar-projetos");

    setFormCadastro({});
    setPlanilhaCustos([]);
    setDocumentos([]);
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
        <Box>
          <Button variant="contained" color="primary" onClick={handleSalvar}>
            <IconButton color="white">
              {" "}
              <Icon color="white">save</Icon>{" "}
            </IconButton>
            Salvar Projeto
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Identificação" />
        <Tab label="Planilha de Custos" />
        <Tab label="Pasta de Documentos" />
      </Tabs>

      <Box>
        {tab === 0 && <FormCadastroProjeto values={formCadastro} onChange={setFormCadastro} />}
        {tab === 1 && (
          <PlanilhaCustosOrcamento values={planilhaCustos} onChange={setPlanilhaCustos} />
        )}
        {tab === 2 && <UploaDocumentosPlanilha arquivos={documentos} setArquivos={setDocumentos} />}
      </Box>
    </Container>
  );
}
