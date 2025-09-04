import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Span } from "app/components/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import axios from "axios";
import useAuth from "app/hooks/useAuth";

const AutoComplete = styled(Autocomplete)({
  width: 300,
  marginBottom: "16px"
});

const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" }
];

const FormJobsProjeto = () => {
  const [definirComissao, setDefinirComissao] = useState(null);
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

  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const { user } = useAuth();

  useEffect(() => {
    setDefinirComissao("none");

    const fetchTags = async () => {
      try {
        const response_tag = await axios.get(`${api}tag/list`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        setTags(response_tag.data);
      } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
      }
    };

    fetchTags();
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
                required
                onChange={handleChange}
                value={numerOrcamento}
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Centro de Custo" variant="outlined" fullWidth />
                )}
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" variant="outlined" fullWidth />
                )}
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Coprodutor" variant="outlined" fullWidth />
                )}
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Job" variant="outlined" fullWidth />
                )}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                required
                type="text"
                name="titulo"
                value={titulo}
                onChange={handleChange}
                label="Título do Projeto"
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Empresa" variant="outlined" fullWidth />
                )}
              />

              <AutoComplete
                required
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Agência" variant="outlined" fullWidth />
                )}
              />

              <AutoComplete
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Diretor" variant="outlined" fullWidth />
                )}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Validade Orçamento"
                  value={state.validadeOrcamento || null}
                  onChange={(newValue) => setState({ ...state, validadeOrcamento: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar Projeto</Span>
        </Button>
      </form>
    </div>
  );
};

export default FormJobsProjeto;
