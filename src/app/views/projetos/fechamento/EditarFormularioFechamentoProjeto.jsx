import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import Icon from "@mui/material/Icon";
import axios from "axios";
import useAuth from "app/hooks/useAuth";
import Swal from "sweetalert2";
import { Span } from "app/components/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const EditarFormularioFechamentoProjeto = () => {
  const { id_fechamento_projeto, id_editar_visualizar } = useParams();

  const [arquivos, setArquivos] = useState([]);

  const [listaCadastro, setListaFornecedor] = useState([]);
  const [listagemJob, setListagemJob] = useState([]);
  const [listaCentroCusto, setListaCentroCusto] = useState([]);
  const [listaDescricaoPlanilha, setListaDescricaoPlanilha] = useState([]);
  const [listaStatusPagamento, setListaStatusPagamento] = useState([]);

  const [jobSelecionado, setJobSelecionado] = useState(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [valor, setValor] = useState("");
  const [nomeServico, setNomeServico] = useState("");
  const [dataFaturamento, setDataFaturamento] = useState(null);
  const [previsaoPagamento, setPrevisaoPagamento] = useState(null);
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null);
  const [descricaoPlanilhaSelecionada, setDescricaoPlanilhaSelecionada] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [statusPagamentoSelecionado, setStatusPagamentoSelecionado] = useState(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(null);

  const [dadosFechamento, setDadosFechamento] = useState(null);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_FLOWSUITE;
  const { user } = useAuth();

  useEffect(() => {
    const listFechamentoProjeto = async () => {
      try {
        const res = await axios.get(
          `${api}projetos/listar-fechamento-projeto/${id_fechamento_projeto}`,
          {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("accessToken")
            }
          }
        );

        const data = res.data;
        console.log(data);
        setDadosFechamento(data);

        setValor(
          data.valor != null
            ? new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(Number(data.valor))
            : ""
        );

        setNomeServico(data.nome_servico ?? "");

        setNumeroNotaFiscal(data.numero_nota_fiscal ?? "");

        setObservacao(data.observacao ?? "");

        setDataFaturamento(
          data.data_faturamento ? dayjs(data.data_faturamento, "DD-MM-YYYY") : null
        );

        setPrevisaoPagamento(
          data.previsao_pagamento ? dayjs(data.previsao_pagamento, "DD-MM-YYYY") : null
        );

        setJobSelecionado({
          label: `${data.numero_orcamento} - ${data.titulo}`,
          id: data.id_projeto
        });

        setFornecedorSelecionado({ label: data.fornecedor, id: data.id_fornecedor });
        setCentroCustoSelecionado({ label: data.centro_custo, id: data.id_centro_custo });
        setDescricaoPlanilhaSelecionada({
          label: data.descricao_planilha_custo_projeto ?? "",
          id: data.id_planilha_custo_projeto ?? null
        });

        setStatusPagamentoSelecionado({ label: data.status_job, id: data.status_pagamento_id });
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error(error);
        Swal.fire({
          title: "Atenção",
          text: "Erro ao buscar dados do fechamento do projeto. Por favor, tente novamente.",
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    };

    const listarArquivosNotaFiscais = async () => {
      try {
        const response_arquivo_nota_fiscais = await axios.get(
          `${api}projetos/listar-arquivos-notas-fiscais/${id_fechamento_projeto}`,
          {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("accessToken")
            }
          }
        );

        setArquivos(response_arquivo_nota_fiscais.data);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) return;
      }
    };

    listFechamentoProjeto();
    listarArquivosNotaFiscais();
  }, [id_fechamento_projeto, api]);

  useEffect(() => {
    const listarfornecedor = async () => {
      try {
        const response_fornecedor = await axios.get(`${api}cadastro/list-fornecedor`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        const listaFormatada = response_fornecedor.data.map((item) => ({
          label: item.razao_social,
          id: item.id_cadastro,
          original: item
        }));

        setListaFornecedor(listaFormatada);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Erro na requisição fornecedores:", error.response?.data || error.message);
      }
    };

    const listarJobsProjetos = async () => {
      try {
        const response_list_job = await axios.get(`${api}projetos/listar-job-fechamento`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        console.log(response_list_job.data);

        const listaJobFormatada = response_list_job.data.map((item) => ({
          label: `${item.numero_orcamento} - ${item.titulo}`,
          id: item.id_projeto_job,
          original: item
        }));

        setListagemJob(listaJobFormatada);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Erro na requisição jobs:", error.response?.data || error.message);
      }
    };

    const centro_custo = async () => {
      try {
        const response_centro_custo = await axios.get(`${api}centro-de-custo`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        const listaCentroCusto = response_centro_custo.data.map((item) => ({
          label: item.centro_custo,
          id: item.id_centro_custo,
          original: item
        }));

        setListaCentroCusto(listaCentroCusto);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Erro na requisição centro de custo:", error.response?.data || error.message);
      }
    };

    const listarStatusJobsProjetos = async () => {
      try {
        const response_list_job = await axios.get(`${api}projetos/listar-status-job-fechamento`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        const listaStatusJobsProjetoFormatada = response_list_job.data.map((item) => ({
          label: item.status_job,
          id: item.id_status_job,
          original: item
        }));

        setListaStatusPagamento(listaStatusJobsProjetoFormatada);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Erro na requisição jobs:", error.response?.data || error.message);
      }
    };

    listarfornecedor();
    listarJobsProjetos();
    centro_custo();
    listarStatusJobsProjetos();
  }, [api]);

  const handleJobChange = async (event, newVal) => {
    setJobSelecionado(newVal);

    if (!newVal) {
      setListaDescricaoPlanilha([]);
      setDescricaoPlanilhaSelecionada(null);
      return;
    }

    try {
      const response_descricao_planilha = await axios.get(
        `${api}projetos/listar-descricao-job-fechamento/${newVal.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      const listarDescricaoProjetoJob = response_descricao_planilha.data.map((item) => ({
        label: item.descricao,
        id: item.id_planilha_custo_projeto,
        original: item
      }));

      setListaDescricaoPlanilha(listarDescricaoProjetoJob);
    } catch (error) {
      if (error.response?.status === 401) return;
      console.error("Erro ao buscar descrições:", error.response?.data || error.message);
    }
  };

  const handleDescricaoPlanilhaChange = (event, newVal) => {
    setDescricaoPlanilhaSelecionada(newVal || null);
  };

  const handleFornecedorChange = (event, newVal) => {
    setFornecedorSelecionado(newVal || null);
  };

  const handleStatusFechamentoProjetoChange = (event, newVal) => {
    setStatusPagamentoSelecionado(newVal || null);
  };

  const handleCentroCustoChange = (event, newVal) => {
    setCentroCustoSelecionado(newVal || null);
  };

  useEffect(() => {
    if (!dadosFechamento || !listagemJob.length) return;

    setJobSelecionado((prev) => {
      // se o usuário já escolheu manualmente algo diferente, não mexe
      if (prev && prev.id && prev.id !== dadosFechamento.id_projeto_job) return prev;

      const found = listagemJob.find(
        (j) => j.id === dadosFechamento.id_projeto_job || j.id === dadosFechamento.id_projeto_job
      );

      if (found) return found;

      return {
        id: dadosFechamento.id_projeto_job,
        label: `${dadosFechamento.numero_orcamento} - ${dadosFechamento.titulo}`
      };
    });

    if (listaCadastro.length > 0) {
      const f = listaCadastro.find((c) => c.id === dadosFechamento.id_fornecedor);
      if (f) setFornecedorSelecionado(f);
    }

    if (listaCentroCusto.length > 0) {
      const c = listaCentroCusto.find((cc) => cc.id === dadosFechamento.id_centro_custo);
      if (c) setCentroCustoSelecionado(c);
    }

    if (listaDescricaoPlanilha.length > 0 && dadosFechamento.id_planilha_custo_projeto) {
      const d = listaDescricaoPlanilha.find(
        (dp) => dp.id === dadosFechamento.id_planilha_custo_projeto
      );
      if (d) setDescricaoPlanilhaSelecionada(d);
    }

    if (listaStatusPagamento.length > 0 && dadosFechamento.status_pagamento_id) {
      const d = listaStatusPagamento.find((dp) => dp.id === dadosFechamento.status_pagamento_id);

      if (d) setStatusPagamentoSelecionado(d);
    }
  }, [
    dadosFechamento,
    listagemJob,
    listaCadastro,
    listaCentroCusto,
    listaDescricaoPlanilha,
    listaStatusPagamento
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        projeto_job_id: jobSelecionado?.id ?? null,
        fornecedor_id: fornecedorSelecionado?.id ?? null,
        nome_servico: nomeServico,
        descricao_planilha_custo_projeto_id: descricaoPlanilhaSelecionada?.id ?? null,
        valor: formatarValorNumero(valor),
        data_faturamento: dataFaturamento ? dayjs(dataFaturamento).format("YYYY-MM-DD") : null,
        previsao_pagamento: previsaoPagamento
          ? dayjs(previsaoPagamento).format("YYYY-MM-DD")
          : null,
        centro_custo_id: centroCustoSelecionado?.id ?? null,
        observacao: observacao,
        status_pagamento: statusPagamentoSelecionado?.id ?? null,
        numero_nota_fiscal: numeroNotaFiscal
      };

      const response_projeto_atualizado = await axios.put(
        `${api}projetos/atualizar-fechamento-projeto/${id_fechamento_projeto}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      const formData = new FormData();

      arquivos.forEach((file) => {
        if (file instanceof File) {
          formData.append("nota_fiscal", file);
        }
      });

      await axios.post(
        `${api}projetos/create/arquivo-fechamento-projeto/${id_fechamento_projeto}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      Swal.fire({
        title: "",
        text: "Fechamento do projeto salvo com sucesso",
        icon: "success"
      });

      setTimeout(() => {
        navigate("/projetos/fechamento/listar-fechamento-orcamento");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 401) return;
      console.error(error);
      Swal.fire({
        title: "",
        text: "Erro ao atualizar o fechamento do projeto",
        icon: "error"
      });
    }
  };

  const handleUpload = (event) => {
    if (event.target.files) {
      const novosArquivos = Array.from(event.target.files);
      const arquivosFiltrados = novosArquivos.filter((novo) => {
        return !arquivos.some((existente) => existente.name === novo.name);
      });

      setArquivos([...arquivos, ...arquivosFiltrados]);
    }
  };

  const handleRemoveArquivo = async (arquivo, index) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (arquivo.id_arquivo) {
        const url = `${api}projetos/delete-nota-fiscal/${arquivo.id_arquivo}`;

        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setArquivos(arquivos.filter((_, i) => i !== index));

      Swal.fire({
        title: "Atenção",
        text: "Arquivo excluído com sucesso",
        icon: "success",
        confirmButtonText: "Fechar"
      });
    } catch (error) {
      if (error.response?.status === 401) return;
      console.error("Erro ao excluir arquivo:", error);
      Swal.fire({
        title: "Atenção",
        text: "Erro ao excluir arquivo",
        icon: "error",
        confirmButtonText: "Fechar"
      });
    }
  };

  const handleVisualizar = async (arquivo) => {
    if (arquivo.id_arquivo) {
      try {
        const token = localStorage.getItem("accessToken");
        const url = `${api}projetos/visualizar-nota-fiscal/${arquivo.id_arquivo}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: "blob"
        });

        const fileName = arquivo.nome_arquivo || arquivo.name || "";
        const fileExtension = fileName.split(".").pop().toLowerCase();

        const mimeTypes = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          bmp: "image/bmp",
          webp: "image/webp",
          txt: "text/plain",
          html: "text/html",
          htm: "text/html",
          xml: "application/xml",
          json: "application/json",
          csv: "text/csv"
        };

        const mimeType =
          mimeTypes[fileExtension] ||
          response.headers["content-type"] ||
          "application/octet-stream";

        const blob = new Blob([response.data], { type: mimeType });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      } catch (error) {
        if (error.response?.status === 401) return;

        Swal.fire({
          title: "Atenção",
          text: "Erro ao visualizar arquivo",
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    }
  };

  const handleVoltar = async () => {
    navigate("/projetos/fechamento/listar-fechamento-orcamento");
  };

  const formatarValorNumero = (brazilianFormat) => {
    if (!brazilianFormat && brazilianFormat !== 0) return "";
    const str = String(brazilianFormat).trim();
    // aceita tanto "1.234,56" quanto "1234.56"
    return str.replace(/\./g, "").replace(",", ".");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              {/* Projeto (JOB) */}
              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listagemJob}
                value={jobSelecionado || null}
                onChange={handleJobChange}
                getOptionLabel={(option) => (option?.label ? option.label : "")}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option.id === value.id;
                }}
                renderInput={(params) => <TextField {...params} label="Projeto (JOB) *" />}
                disabled={id_editar_visualizar == 0}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="valor"
                value={valor}
                disabled={id_editar_visualizar == 0}
                onChange={(e) => {
                  let value = e.target.value;

                  // remove tudo que não for número
                  value = value.replace(/\D/g, "");

                  // garante pelo menos duas casas decimais
                  const numericValue = (Number(value) / 100).toFixed(2);

                  // formata no padrão brasileiro
                  const formatted = new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(numericValue);

                  setValor(formatted);
                }}
                label="Valor"
                inputMode="decimal"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data de Faturamento *"
                  value={dataFaturamento}
                  onChange={(newValue) => setDataFaturamento(newValue)}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                  disabled={id_editar_visualizar == 0}
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCentroCusto}
                value={centroCustoSelecionado}
                onChange={handleCentroCustoChange}
                getOptionLabel={(option) => (option ? option.label : "")}
                renderInput={(params) => <TextField {...params} label="Centro de Custo" />}
                disabled={id_editar_visualizar == 0}
              />

              <TextField
                rows={3}
                sx={{ width: 474 }}
                type="text"
                name="observacao"
                label="Observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                multiline
                disabled={id_editar_visualizar == 0}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCadastro}
                value={fornecedorSelecionado}
                onChange={handleFornecedorChange}
                getOptionLabel={(option) => (option ? option.label : "")}
                renderInput={(params) => <TextField {...params} label="Fornecedor *" />}
                disabled={id_editar_visualizar == 0}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="nomeServico"
                value={nomeServico}
                onChange={(e) => setNomeServico(e.target.value)}
                label="Nome do Serviço"
                disabled={id_editar_visualizar == 0}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Previsão de Pagamento *"
                  value={previsaoPagamento}
                  onChange={(newValue) => setPrevisaoPagamento(newValue)}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                  disabled={id_editar_visualizar == 0}
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaDescricaoPlanilha}
                value={descricaoPlanilhaSelecionada}
                onChange={handleDescricaoPlanilhaChange}
                getOptionLabel={(option) => (option ? option.label : "")}
                renderInput={(params) => <TextField {...params} label="Descrição planilha *" />}
                disabled={id_editar_visualizar == 0}
              />

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaStatusPagamento}
                value={statusPagamentoSelecionado}
                onChange={handleStatusFechamentoProjetoChange}
                getOptionLabel={(option) => (option ? option.label : "")}
                renderInput={(params) => (
                  <TextField {...params} label="Status fechamento do projeto" />
                )}
                disabled={id_editar_visualizar == 0}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="numeroNotaFiscal"
                value={numeroNotaFiscal}
                onChange={(e) => setNumeroNotaFiscal(e.target.value)}
                label="Nº Nota Fiscal"
                disabled={id_editar_visualizar == 0}
                InputLabelProps={{
                  shrink: Boolean(numeroNotaFiscal)
                }}
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ mb: 2 }}
                  disabled={id_editar_visualizar == 0}
                >
                  Selecionar nota fiscal
                  <input hidden type="file" multiple onChange={handleUpload} />
                </Button>

                <List>
                  {arquivos.map((file, index) => (
                    <ListItem
                      key={index}
                      sx={{ border: "0.5px solid #6c721681", borderRadius: 2, mb: 1 }}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            color="primary"
                            sx={{
                              display: file.id_arquivo ? "inline-flex" : "none"
                            }}
                            onClick={() => handleVisualizar(file)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleRemoveArquivo(file, index)}
                            disabled={id_editar_visualizar == 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={file.nome_arquivo || file.name}
                        secondary={
                          file.size
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : file.created_at
                            ? new Date(file.created_at).toLocaleString()
                            : ""
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box>
            <Button color="error" variant="contained" sx={{ mt: 2 }} onClick={handleVoltar}>
              <Icon>arrow_back</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Voltar</Span>
            </Button>
          </Box>

          <Box>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ mt: 2, display: id_editar_visualizar == 0 ? "none" : "inline-flex" }}
            >
              <Icon>save</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Atualizar</Span>
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default EditarFormularioFechamentoProjeto;
