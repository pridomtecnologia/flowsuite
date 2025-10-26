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
  const [state, setState] = useState({
    numerOrcamento: "",
    empresaId: "",
    centroCustoId: "",
    agenciaId: "",
    clienteId: "",
    titulo: "",
    coprodutorId: "",
    diretorId: "",
    tipoJobId: "",
    validadeOrcamento: ""
  });
  const [open, setOpen] = useState(false);
  const [arquivos, setArquivos] = useState([]);
  const [openCentroCusto, setOpenCentroCusto] = useState(false);

  const [listaCadastro, setListaCadastro] = useState([]);
  const [listaCoprodutor, setListaCoprodutor] = useState([]);
  const [listaDiretores, setListaDiretores] = useState([]);
  const [listaCentroCusto, setListaCentroCusto] = useState([]);

  const [nameCentroCusto, setNameCentroCusto] = useState(null);

  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const { user } = useAuth();

  const coprodutores = async () => {
    try {
      const response_coprodutores = await axios.get(`${api}coprodutor`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      const listaCoprodutores = response_coprodutores.data.map((item) => ({
        label: item.nome,
        id: item.id_coprodutor,
        original: item
      }));

      setListaCoprodutor(listaCoprodutores);
    } catch (error) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  const diretores = async () => {
    try {
      const diretor_response = await axios.get(`${api}diretor`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      const listaDiretores = diretor_response.data.map((item) => ({
        label: item.nome,
        id: item.id_diretor,
        nome_interno: item.nome_interno,
        identificador_lancamento: item.identificador_lancamento,
        original: item
      }));

      setListaDiretores(listaDiretores);
    } catch (error) {
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

  useEffect(() => {
    const listarCadastro = async () => {
      try {
        const response_cadastro = await axios.get(`${api}cadastro/list`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        const listaFormatada = response_cadastro.data.map((item) => ({
          label: item.nome_fantasia, // ou razao_social, se preferir
          id: item.id_cadastro,
          original: item // se quiser guardar o objeto todo
        }));

        setListaCadastro(listaFormatada);
      } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
      }
    };

    const numeroOrcamento = async () => {
      try {
        const response_number_orcamento = await axios.get(`${api}projetos/next_orc_number`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        setState((prevState) => ({
          ...prevState,
          numerOrcamento: response_number_orcamento.data.number_orc
        }));
      } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
      }
    };

    listarCadastro();
    numeroOrcamento();
    coprodutores();
    diretores();
    centro_custo();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/projetos/listar-projetos");
    console.log("submitted");
    console.log(event);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
    onChange({ ...values, [e.target.name]: e.target.value });
  };

  const handleCloseCentroCusto = () => {
    setNameCentroCusto(null);
    setOpenCentroCusto(false);
  };

  const handleSaveCentroCusto = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${api}centro-de-custo/create`,
        {
          centro_custo: nameCentroCusto
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      centro_custo();

      handleCloseCentroCusto();

      Swal.fire({
        title: "",
        text: "Centro de custo cadastrado com sucesso",
        icon: "success"
      });
    } catch (error) {
      console.error("Erro ao criar centro de custo:", error.response?.data || error.message);
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
                options={listaCadastro}
                onChange={(e, newVal) => onChange({ ...values, empresaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Projeto (JOB) *" />}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="titulo"
                onChange={(e) => onChange({ ...values, titulo: e.target.value })}
                label="Valor"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data de Faturamento *"
                  // value={values.validadeOrcamento ? dayjs(values.validadeOrcamento) : null}
                  onChange={(newValue) => onChange({ ...values, validadeOrcamento: newValue })}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCadastro}
                onChange={(e, newVal) => onChange({ ...values, empresaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Centro de Custo" />}
              />

              <TextField
                rows={3}
                sx={{ width: 474 }}
                type="text"
                name="observacao"
                label="Observação"
                onChange={handleChange}
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
                onChange={(e, newVal) => onChange({ ...values, empresaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Fornecedor *" />}
              />

              <TextField
                required
                sx={{ width: 474 }}
                type="text"
                name="titulo"
                onChange={(e) => onChange({ ...values, titulo: e.target.value })}
                label="Nome do Serviço"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Previsão de Pagamento *"
                  // value={values.validadeOrcamento ? dayjs(values.validadeOrcamento) : null}
                  onChange={(newValue) => onChange({ ...values, validadeOrcamento: newValue })}
                  sx={{ width: 474 }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>

              <AutoComplete
                required
                sx={{ width: 474 }}
                options={listaCadastro}
                onChange={(e, newVal) => onChange({ ...values, empresaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Descrição planilha *" />}
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
              color="primary"
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              // onClick={handleVoltar}
            >
              <Icon>arrow_back</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Voltar</Span>
            </Button>
          </Box>

          <Box>
            <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
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
