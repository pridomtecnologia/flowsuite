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
import { Box, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormCadastroCoprodutor from "../cadastro/FormCadastroCoprodutor";
import FormCadastroDiretor from "../cadastro/FormCadastroDiretor";
import dayjs from "dayjs";
import axios from "axios";
import useAuth from "app/hooks/useAuth";
import Swal from "sweetalert2";

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const FormCadastroProjetoUpdate = ({ values, onChange, idForm, onIdChange }) => {
  const [open, setOpen] = useState(false);
  const [openDiretor, setOpenDiretor] = useState(false);
  const [openCentroCusto, setOpenCentroCusto] = useState(false);

  const [listaCadastro, setListaCadastro] = useState([]);
  const [listaCoprodutor, setListaCoprodutor] = useState([]);
  const [listaDiretores, setListaDiretores] = useState([]);
  const [listaCentroCusto, setListaCentroCusto] = useState([]);

  const [nameCentroCusto, setNameCentroCusto] = useState(null);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_FLOWSUITE;
  const { user } = useAuth();

  // --- Listagens ---
  const coprodutores = async () => {
    try {
      const { data } = await axios.get(`${api}coprodutor`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setListaCoprodutor(
        data.map((item) => ({
          label: item.nome,
          id: item.id_coprodutor,
          original: item
        }))
      );
    } catch (error) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  const diretores = async () => {
    try {
      const { data } = await axios.get(`${api}diretor`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setListaDiretores(
        data.map((item) => ({
          label: item.nome,
          id: item.id_diretor,
          nome_interno: item.nome_interno,
          identificador_lancamento: item.identificador_lancamento,
          original: item
        }))
      );
    } catch (error) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  const centro_custo = async () => {
    try {
      const { data } = await axios.get(`${api}centro-de-custo`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setListaCentroCusto(
        data.map((item) => ({
          label: item.centro_custo,
          id: item.id_centro_custo,
          original: item
        }))
      );
    } catch (error) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const listarCadastro = async () => {
      try {
        const { data } = await axios.get(`${api}cadastro/list`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        setListaCadastro(
          data.map((item) => ({
            label: item.nome_fantasia,
            id: item.id_cadastro,
            original: item
          }))
        );
      } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
      }
    };

    const numeroOrcamento = async () => {
      try {
        const { data } = await axios.get(`${api}projetos/next_orc_number`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        onChange({ ...values, numerOrcamento: data.number_orc });
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
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  const handleOpenCoprodutor = () => setOpen(true);
  const handleCloseCoprodutor = () => setOpen(false);

  const handleOpenDiretor = () => setOpenDiretor(true);
  const handleCloseDiretor = () => setOpenDiretor(false);

  const handleOpenCentroCusto = () => {
    setNameCentroCusto(null);
    setOpenCentroCusto(true);
  };

  const handleCloseCentroCusto = () => {
    setNameCentroCusto(null);
    setOpenCentroCusto(false);
  };

  const handleSaveCentroCusto = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${api}centro-de-custo/create`,
        { centro_custo: nameCentroCusto },
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
        text: "Centro de custo cadastrado com sucesso",
        icon: "success"
      });
    } catch (error) {
      console.error("Erro ao criar centro de custo:", error.response?.data || error.message);
    }
  };

  const handleAutoCompleteChange = (fieldName, newVal) => {
    onChange({
      ...values,
      [fieldName]: newVal
    });

    if (onIdChange) {
      onIdChange({
        ...idForm,
        [`${fieldName.toLowerCase()}`]: newVal?.id || null
      });
    }
  };

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
                variant="outlined"
                value={values.numerOrcamento ? String(values.numerOrcamento) : ""}
                onChange={handleChange}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AutoComplete
                  required
                  options={listaCentroCusto}
                  value={values.centroCustoId || null}
                  onChange={(e, newVal) => handleAutoCompleteChange("centro_custo_id", newVal)}
                  renderInput={(params) => <TextField {...params} label="Centro de Custo *" />}
                />
                <IconButton
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={handleOpenCentroCusto}
                >
                  <Icon>person_add</Icon>
                </IconButton>
              </Box>

              <AutoComplete
                required
                options={listaCadastro}
                value={values.clienteId || null}
                onChange={(e, newVal) => handleAutoCompleteChange("cliente_id", newVal)}
                renderInput={(params) => <TextField {...params} label="Cliente *" />}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AutoComplete
                  required
                  options={listaCoprodutor}
                  value={values.coprodutorId || null}
                  onChange={(e, newVal) => handleAutoCompleteChange("coprodutor_id", newVal)}
                  renderInput={(params) => <TextField {...params} label="Coprodutor *" />}
                />
                <IconButton
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={handleOpenCoprodutor}
                >
                  <Icon>person_add</Icon>
                </IconButton>
              </Box>

              <AutoComplete
                required
                options={listaCentroCusto}
                value={values.tipoJobId || null}
                onChange={(e, newVal) => handleAutoCompleteChange("tipo_job_id", newVal)}
                renderInput={(params) => <TextField {...params} label="Tipo de Job *" />}
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
                onChange={handleChange}
                label="Título do Projeto"
              />

              <AutoComplete
                required
                options={listaCadastro}
                value={values.empresaId || null}
                onChange={(e, newVal) => handleAutoCompleteChange("empresa_id", newVal)}
                renderInput={(params) => <TextField {...params} label="Empresa *" />}
              />

              <AutoComplete
                required
                options={listaCadastro}
                value={values.agenciaId || null}
                onChange={(e, newVal) => handleAutoCompleteChange("agencia_id", newVal)}
                renderInput={(params) => <TextField {...params} label="Agência *" />}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AutoComplete
                  options={listaDiretores}
                  value={values.diretorId || null}
                  onChange={(e, newVal) => handleAutoCompleteChange("diretor_id", newVal)}
                  renderInput={(params) => <TextField {...params} label="Diretor *" />}
                />
                <IconButton sx={{ cursor: "pointer", color: "blue" }} onClick={handleOpenDiretor}>
                  <Icon>person_add</Icon>
                </IconButton>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Validade Orçamento *"
                  value={values.validadeOrcamento ? dayjs(values.validadeOrcamento) : null}
                  onChange={(newValue) => onChange({ ...values, validadeOrcamento: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
        </Grid>
      </form>

      {/* Dialogs */}
      <Dialog open={open} onClose={handleCloseCoprodutor} fullWidth maxWidth="sm">
        <DialogTitle>Novo Coprodutor</DialogTitle>
        <DialogContent>
          <FormCadastroCoprodutor onSuccess={coprodutores} onClose={handleCloseCoprodutor} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDiretor} onClose={handleCloseDiretor} fullWidth maxWidth="sm">
        <DialogTitle>Novo Diretor</DialogTitle>
        <DialogContent>
          <FormCadastroDiretor onSuccess={diretores} onClose={handleCloseDiretor} />
        </DialogContent>
      </Dialog>

      <Dialog open={openCentroCusto} onClose={handleCloseCentroCusto} fullWidth maxWidth="sm">
        <DialogTitle>Novo Centro de Custo</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSaveCentroCusto}>
            <TextField
              required
              type="text"
              name="nameCentroCusto"
              label="Centro de Custo"
              onChange={(e) => setNameCentroCusto(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" sx={{ mt: 2 }} type="submit">
                Salvar
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormCadastroProjetoUpdate;
