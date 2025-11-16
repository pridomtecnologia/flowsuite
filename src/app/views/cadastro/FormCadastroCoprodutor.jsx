import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { Span } from "app/components/Typography";
import Swal from "sweetalert2";

import axios from "axios";
import useAuth from "app/hooks/useAuth";

const FormCadastroCoprodutor = ({ onSuccess, onClose }) => {
  const [state, setState] = useState({
    nomeFantasia: "",
    nome: "",
    cnpj: "",
    cpf: "",
    identificador_lancamento: "",
    nome_artistico: ""
  });

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        nome_fantasia: nomeFantasia,
        nome: nome,
        nome_artistico: nome_artistico,
        identificador: identificador_lancamento,
        cnpj: cnpj,
        cpf: cpf
      };

      const response_coprodutor = await axios.post(`${api}coprodutor/create`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      Swal.fire({
        title: "",
        text: "Coprodutor cadastrado com sucesso",
        icon: "success"
      });

      if (onSuccess) onSuccess(); // chama a função para atualizar lista
      if (onClose) onClose();
    } catch (error) {
      if (error.response?.status === 401) return;
      Swal.fire({
        title: "",
        text: "Erro ao cadastrar o Coprodutor",
        icon: "error"
      });
    }
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { nomeFantasia, nome, identificador_lancamento, cnpj, cpf, nome_artistico } = state;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="nomeFantasia"
                label="Nome Fantasia"
                required
                onChange={handleChange}
                value={nomeFantasia}
              />

              <TextField
                fullWidth
                type="text"
                name="nome_artistico"
                value={nome_artistico}
                onChange={handleChange}
                required
                label="Nome Artístico"
              />

              <TextField
                fullWidth
                type="text"
                name="cnpj"
                value={cnpj}
                onChange={handleChange}
                label="CNPJ"
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
                label="Nome Coprodutor"
                required
                onChange={handleChange}
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

              <TextField
                fullWidth
                type="text"
                name="cpf"
                value={cpf}
                onChange={handleChange}
                label="CPF"
              />
            </Stack>
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar Coprodutor</Span>
        </Button>
      </form>
    </div>
  );
};

export default FormCadastroCoprodutor;
