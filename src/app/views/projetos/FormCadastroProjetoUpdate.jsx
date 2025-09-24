import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormCadastroCoprodutor from "../cadastro/FormCadastroCoprodutor";
import FormCadastroDiretor from "../cadastro/FormCadastroDiretor";
import dayjs from "dayjs";

import axios from "axios";
import useAuth from "app/hooks/useAuth";

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const FormCadastroProjetoUpdate = ({ values, onChange }) => {
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
  const [openDiretor, setOpenDiretor] = useState(false);

  const [listaCadastro, setListaCadastro] = useState([]);
  const [listaCoprodutor, setListaCoprodutor] = useState([]);
  const [statusProjeto, setStatusProjeto] = useState(0);
  const [listaDiretores, setListaDiretores] = useState([]);
  const [listaCentroCusto, setListaCentroCusto] = useState([]);

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

    listarCadastro();
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

  const {
    numerOrcamento,
    empresaId,
    clienteId,
    centroCustoId,
    agenciaId,
    titulo,
    coprodutorId,
    diretorId,
    tipoJobId,
    validadeOrcamento
  } = state;

  const handleOpenCoprodutor = () => setOpen(true);
  const handleCloseCoprodutor = () => setOpen(false);

  const handleOpenDiretor = () => setOpenDiretor(true);
  const handleCloseDiretor = () => setOpenDiretor(false);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                type="text"
                name="numerOrcamento"
                label="Número do Orçamento"
                disabled="true"
                value={values.numerOrcamento || ""}
                onChange={handleChange}
                InputProps={{
                  readOnly: true
                }}
                sx={{
                  background: statusProjeto == 2 || statusProjeto == 3 ? "#d3d3d3" : ""
                }}
              />

              <AutoComplete
                options={listaCentroCusto}
                value={values.centroCustoId || null}
                disabled={statusProjeto == 2 || statusProjeto == 3 ? true : true}
                onChange={(e, newVal) => onChange({ ...values, centroCustoId: newVal })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Centro de Custo"
                    sx={{
                      background: statusProjeto == 2 || statusProjeto == 3 ? "#d3d3d3" : ""
                    }}
                  />
                )}
              />

              <AutoComplete
                required
                options={listaCadastro}
                value={values.clienteId || null}
                onChange={(e, newVal) => onChange({ ...values, clienteId: newVal })}
                renderInput={(params) => <TextField {...params} label="Cliente" />}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box>
                  <AutoComplete
                    required
                    options={listaCoprodutor}
                    value={values.coprodutorId || null}
                    onChange={(e, newVal) => onChange({ ...values, coprodutorId: newVal })}
                    renderInput={(params) => <TextField {...params} label="Coprodutor" />}
                  />
                </Box>
                <Box>
                  <IconButton sx={{ cursor: "pointer" }} onClick={handleOpenCoprodutor}>
                    <Icon title="Adicionar Coprodutor">person_add</Icon>
                  </IconButton>
                </Box>
              </Box>

              <AutoComplete
                required
                options={listaCentroCusto}
                value={values.tipoJobId || null}
                onChange={(e, newVal) => onChange({ ...values, tipoJobId: newVal })}
                renderInput={(params) => <TextField {...params} label="Tipo de Job" />}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                required
                type="text"
                name="titulo"
                value={values.titulo || ""}
                onChange={(e) => onChange({ ...values, titulo: e.target.value })}
                label="Título do Projeto"
              />

              <AutoComplete
                required
                options={listaCadastro}
                value={values.empresaId || null}
                onChange={(e, newVal) => onChange({ ...values, empresaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Empresa" />}
              />

              <AutoComplete
                required
                options={listaCadastro}
                value={values.agenciaId || null}
                onChange={(e, newVal) => onChange({ ...values, agenciaId: newVal })}
                renderInput={(params) => <TextField {...params} label="Agência" />}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Box>
                  <AutoComplete
                    options={listaDiretores}
                    value={values.diretorId || null}
                    onChange={(e, newVal) => onChange({ ...values, diretorId: newVal })}
                    renderInput={(params) => <TextField {...params} label="Diretor" />}
                  />
                </Box>

                <Box>
                  <IconButton sx={{ cursor: "pointer" }} onClick={handleOpenDiretor}>
                    <Icon title="Adicionar Diretor">person_add</Icon>
                  </IconButton>
                </Box>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Validade Orçamento"
                  value={
                    values.validadeOrcamento ? dayjs(values.validadeOrcamento, "DD-MM-YYYY") : null
                  }
                  onChange={(newValue) => onChange({ ...values, validadeOrcamento: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <Dialog open={open} onClose={handleCloseCoprodutor} fullWidth maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Box>
            <DialogTitle>Novo Coprodutor</DialogTitle>
          </Box>
          <Box>
            <IconButton sx={{ cursor: "pointer" }} onClick={handleCloseCoprodutor}>
              <Icon title="Fechar">cancel</Icon>
            </IconButton>
          </Box>
        </Box>
        <DialogContent>
          <FormCadastroCoprodutor onSuccess={coprodutores} onClose={handleCloseCoprodutor} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDiretor} onClose={handleCloseDiretor} fullWidth maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
          <Box>
            <DialogTitle>Novo Diretor</DialogTitle>
          </Box>
          <Box>
            <IconButton sx={{ cursor: "pointer" }} onClick={handleCloseDiretor}>
              <Icon title="Fechar">cancel</Icon>
            </IconButton>
          </Box>
        </Box>
        <DialogContent>
          <FormCadastroDiretor onSuccess={diretores} onClose={handleCloseDiretor} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormCadastroProjetoUpdate;
