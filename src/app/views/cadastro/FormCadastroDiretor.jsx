import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { Span } from "app/components/Typography";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "app/hooks/useAuth";

const FormCadastroDiretor = ({ onSuccess, onClose }) => {
  const [state, setState] = useState({
    nomeInterno: "",
    nome: "",
    identificador_lancamento: ""
  });

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        nome_interno: nomeInterno,
        nome: nome,
        identificador_lancamento: identificador_lancamento
      };

      const response_diretor = await axios.post(`${api}diretor/create`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      Swal.fire({
        title: "",
        text: "Diretor cadastrado com sucesso",
        icon: "success"
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao cadastrar o Diretor",
        icon: "error"
      });
    }
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { nomeInterno, nome, identificador_lancamento } = state;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="nomeInterno"
                label="Nome Interno"
                required
                onChange={handleChange}
                value={nomeInterno}
              />

              <TextField
                fullWidth
                type="text"
                name="identificador_lancamento"
                value={identificador_lancamento}
                onChange={handleChange}
                required
                label="Identificador Lançamento"
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="nome"
                value={nome}
                label="Nome Diretor"
                required
                onChange={handleChange}
              />
            </Stack>
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar Diretor</Span>
        </Button>
      </form>
    </div>
  );
};

export default FormCadastroDiretor;
