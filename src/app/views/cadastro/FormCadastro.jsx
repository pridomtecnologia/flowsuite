import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { Span } from "app/components/Typography";

import axios from "axios";
import useAuth from "app/hooks/useAuth";

const FormCadastro = () => {
  const [definirComissao, setDefinirComissao] = useState(null);
  const [state, setState] = useState({
    nome: "",
    nomeFantasia: "",
    documento: "",
    email: "",
    telefone: "",
    responsavel: "",
    observacao: "",
    comissao: "",
    endereco: "",
    numeroEndereco: "",
    bairro: "",
    complemento: "",
    estado: "",
    cidade: "",
    cep: "",
    webSite: "",
    banco: "",
    agencia: "",
    contaCorrente: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: ""
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showComissao, setShowComissao] = useState(false);

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

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/cadastro/listar-cadastrados");
    console.log("submitted");
    console.log(event);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const {
    nome,
    nomeFantasia,
    documento,
    email,
    telefone,
    responsavel,
    observacao,
    comissao,
    endereco,
    numeroEndereco,
    bairro,
    complemento,
    estado,
    cidade,
    cep,
    webSite,
    banco,
    agencia,
    contaCorrente,
    inscricaoEstadual,
    inscricaoMunicipal
  } = state;

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
                name="nome"
                value={nome}
                onChange={handleChange}
                required
                label="Razão Social / Nome Completo"
              />

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
                name="telefone"
                label="Telefone"
                required
                value={telefone}
                onChange={handleChange}
              />

              <TextField
                sx={{ mb: 4 }}
                rows={3}
                fullWidth
                type="text"
                name="observacao"
                label="Observação"
                onChange={handleChange}
                value={observacao}
                multiline
              />

              <TextField
                fullWidth
                type="text"
                name="endereco"
                label="Endereço"
                value={endereco}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="numeroEndereco"
                label="Número"
                value={numeroEndereco}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="bairro"
                label="Bairro"
                value={bairro}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="estado"
                onChange={handleChange}
                label="Estado"
                value={estado}
              />

              <TextField
                fullWidth
                type="text"
                name="cidade"
                label="Cidade"
                value={cidade}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="complemento"
                onChange={handleChange}
                label="Complemento"
                value={complemento}
              />

              <TextField
                fullWidth
                type="text"
                name="cep"
                onChange={handleChange}
                label="CEP"
                value={cep}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="documento"
                value={documento}
                label="CNPJ / CPF"
                required
                onChange={handleChange}
              />

              <TextField
                fullWidth
                name="email"
                type="email"
                label="E-mail"
                value={email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="responsavel"
                onChange={handleChange}
                label="Responsável Contato"
                required
                value={responsavel}
              />

              <TextField
                fullWidth
                type="text"
                name="banco"
                label="Banco"
                value={banco}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="agencia"
                label="Agencia"
                value={agencia}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="text"
                name="contaCorrente"
                onChange={handleChange}
                label="Conta Corrente"
                value={contaCorrente}
              />

              <TextField
                fullWidth
                type="text"
                name="inscricaoEstadual"
                onChange={handleChange}
                label="Inscrição Estadual"
                value={inscricaoEstadual}
              />
              <TextField
                fullWidth
                type="text"
                name="inscricaoMunicipal"
                onChange={handleChange}
                label="Inscrição Municipal"
                value={inscricaoMunicipal}
              />

              <TextField
                fullWidth
                type="text"
                name="webSite"
                label="WebSite"
                value={webSite}
                onChange={handleChange}
              />

              <Grid size={{ md: 12, xs: 12 }} sx={{ mt: 2 }}>
                {tags.map((tagItem) => (
                  <FormControlLabel
                    key={tagItem.id_tag}
                    control={
                      <Checkbox
                        onChange={(e) => handleTagChange(e, tagItem)}
                        checked={selectedTags.includes(tagItem.id_tag)}
                      />
                    }
                    label={tagItem.tag}
                  />
                ))}
              </Grid>

              <RadioGroup
                row
                name="documento"
                value={documento}
                onChange={handleChange}
                sx={{ display: definirComissao }}
              >
                <TextField
                  fullWidth
                  type="text"
                  name="comissao"
                  onChange={handleChange}
                  label="Comissão (%)"
                  value={comissao}
                />

                <FormControlLabel
                  value="1"
                  label="Bruto"
                  labelPlacement="end"
                  control={<Radio color="secondary" />}
                />

                <FormControlLabel
                  value="2"
                  label="Líquido"
                  labelPlacement="end"
                  control={<Radio color="secondary" />}
                />
              </RadioGroup>
            </Stack>
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar</Span>
        </Button>
      </form>
    </div>
  );
};

export default FormCadastro;
