import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { Span } from "app/components/Typography";

import axios from "axios";
import useAuth from "app/hooks/useAuth";

const FormCadastroCoprodutor = () => {
  const [definirComissao, setDefinirComissao] = useState(null);
  const [state, setState] = useState({
    nomeFantasia: "",
    nome: "",
    cnpj: "",
    cpf: "",
    identificador_lancamento: "",
    nome_artistico: ""
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showComissao, setShowComissao] = useState(false);

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
    navigate("/cadastro/listar-coprodutor");
    console.log("submitted");
    console.log(event);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { nomeFantasia, nome, identificador_lancamento, cnpj, cpf, nome_artistico } = state;

  const handleChangeComissao = (event) => {
    if (event.target.checked) {
      setDefinirComissao("flex");
    } else {
      setDefinirComissao("none");
    }
  };

  const handleTagChange = (event, tag) => {
    const isChecked = event.target.checked;

    if (tag.tag === "Vendedor") {
      setShowComissao(isChecked);
      setDefinirComissao(isChecked ? "block" : "none");
    }

    if (isChecked) {
      setSelectedTags((prev) => [...prev, tag.id_tag]);
    } else {
      setSelectedTags((prev) => prev.filter((id) => id !== tag.id_tag));
    }
  };

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
                required
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
                required
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
