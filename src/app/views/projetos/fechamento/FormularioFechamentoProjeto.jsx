import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const FormularioFechamentoProjeto = ({ values, onChange }) => {
  const [arquivos, setArquivos] = useState([]);

  const [listaCadastro, setListaFornecedor] = useState([]);
  const [listagemJob, setListagemJob] = useState([]);
  const [listaCentroCusto, setListaCentroCusto] = useState([]);
  const [listaDescricaoPlanilha, setListaDescricaoPlanilha] = useState([]);

  const [jobSelecionado, setJobSelecionado] = useState(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [valor, setValor] = useState(null);
  const [nomeServico, setNomeServico] = useState(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(null);
  const [dataFaturamento, setDataFaturamento] = useState(null);
  const [previsaoPagamento, setPrevisaoPagamento] = useState(null);
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null);
  const [descricaoPlanilhaSelecionada, setDescricaoPlanilhaSelecionada] = useState(null);
  const [observacao, setObservacao] = useState(null);

  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const { user } = useAuth();

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
        console.error("Erro na requisição:", error.response?.data || error.message);
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

        const listaJobFormatada = response_list_job.data.map((item) => ({
          label: `${item.numero_orcamento} - ${item.titulo}`,
          id: item.id_projeto_job,
          original: item
        }));

        setListagemJob(listaJobFormatada);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Erro na requisição:", error.response?.data || error.message);
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
        console.error("Erro na requisição:", error.response?.data || error.message);
      }
    };

    listarfornecedor();
    listarJobsProjetos();
    centro_custo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        projeto_job_id: jobSelecionado,
        fornecedor_id: fornecedorSelecionado.fornecedorId.id,
        nome_servico: nomeServico.nomeServico,
        descricao_planilha_custo_projeto_id: descricaoPlanilhaSelecionada,
        valor: formatarValorNumero(valor),
        data_faturamento: dayjs(dataFaturamento).format("YYYY-MM-DD"),
        previsao_pagamento: dayjs(previsaoPagamento).format("YYYY-MM-DD"),
        centro_custo_id: centroCustoSelecionado.centroCustoId.id,
        observacao: observacao.observacao,
        numero_nota_fiscal: numeroNotaFiscal.numeroNotaFiscal
      };

      const formData = new FormData();
      formData.append("orcamento_json", JSON.stringify(payload));

      arquivos.forEach((file) => {
        formData.append("nota_fiscal", file);
      });

      const response_cadastro_fechamento_job = await axios.post(
        `${api}projetos/fechamento-orcamento`,
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
        text: response_cadastro_fechamento_job.data.message,
        icon: "success"
      });

      setTimeout(() => {
        navigate("/projetos/fechamento/listar-fechamento-orcamento");
      }, 1500);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "",
        text: "Erro ao cadastrar o fechamento",
        icon: "error"
      });
    }
  };

  const handleUpload = (event) => {
    if (event.target.files) {
      const novosArquivos = Array.from(event.target.files);
      const arquivosFiltrados = novosArquivos.filter((novo) => {
        return !arquivos.some((existente) => existente.nome_arquivo == novo.name);
      });

      setArquivos([...arquivos, ...arquivosFiltrados]);
    }
  };

  const handleRemove = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  const handleVoltar = async () => {
    navigate("/projetos/fechamento/listar-fechamento-orcamento");
  };

  const handleHandleJobSelecionado = async (jobSelecionado) => {
    setJobSelecionado(jobSelecionado.projetoJob.id);

    try {
      const response_descricao_planilha = await axios.get(
        `${api}projetos/listar-descricao-job-fechamento/${jobSelecionado.projetoJob.id}`,
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
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  const handleHandleDescricaoPlanilhaSelecionado = async (descricaoSelecionada) => {
    setDescricaoPlanilhaSelecionada(descricaoSelecionada.descricaoPlanilha.id);
  };

  const formatarValorNumero = (brazilianFormat) => {
    return brazilianFormat.replace(/\./g, "").replace(",", ".");
  };

  return (
    <div>
      <form>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              {/* Projeto (JOB) */}
              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listagemJob}
                onChange={(e, newVal) =>
                  handleHandleJobSelecionado({ ...values, projetoJob: newVal })
                }
                renderInput={(params) => <TextField {...params} label="Projeto (JOB) *" />}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="number"
                name="valor"
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
                inputMode="decimal" // Teclado numérico em dispositivos móveis
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data de Faturamento *"
                  onChange={(newValue) => setDataFaturamento(newValue)}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCentroCusto}
                onChange={(e, newVal) =>
                  setCentroCustoSelecionado({ ...values, centroCustoId: newVal })
                }
                renderInput={(params) => <TextField {...params} label="Centro de Custo" />}
              />

              <TextField
                rows={3}
                sx={{ width: 474 }}
                type="text"
                name="observacao"
                label="Observação"
                onChange={(e) => setObservacao({ ...values, observacao: e.target.value })}
                multiline
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCadastro}
                onChange={(e, newVal) =>
                  setFornecedorSelecionado({ ...values, fornecedorId: newVal })
                }
                renderInput={(params) => <TextField {...params} label="Fornecedor *" />}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="nomeServico"
                onChange={(e) => setNomeServico({ ...values, nomeServico: e.target.value })}
                label="Nome do Serviço"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Previsão de Pagamento *"
                  onChange={(newValue) => setPrevisaoPagamento(newValue)}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaDescricaoPlanilha}
                onChange={(e, newVal) =>
                  handleHandleDescricaoPlanilhaSelecionado({ ...values, descricaoPlanilha: newVal })
                }
                renderInput={(params) => <TextField {...params} label="Descrição planilha *" />}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="numeroNotaFiscal"
                onChange={(e) =>
                  setNumeroNotaFiscal({ ...values, numeroNotaFiscal: e.target.value })
                }
                label="Nº Nota Fiscal"
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ mb: 2 }}
                >
                  Selecionar nota fiscal
                  <input hidden type="file" multiple onChange={handleUpload} />
                </Button>

                <List>
                  {arquivos.map((file, index) => (
                    <ListItem
                      sx={{ border: "0.5px solid #6c721681", borderRadius: 2, mb: 1 }}
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" color="error" onClick={() => handleRemove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
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
            <Button
              color="error"
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              onClick={handleVoltar}
            >
              <Icon>arrow_back</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Voltar</Span>
            </Button>
          </Box>

          <Box>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              <Icon>save</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar</Span>
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default FormularioFechamentoProjeto;
