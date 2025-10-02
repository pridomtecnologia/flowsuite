import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { Span } from "app/components/Typography";
import Swal from "sweetalert2";

import axios from "axios";
import useAuth from "app/hooks/useAuth";
import { Tab, Tabs, Snackbar, Alert } from "@mui/material";

import InputMask from "react-input-mask";

const GreenRadio = styled(Radio)(() => ({
  color: green[400],
  "&$checked": { color: green[600] }
}));

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
    inscricaoMunicipal: "",
    tipo_comissao: ""
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showComissao, setShowComissao] = useState(false);
  const [tipoComissao, seTipoComissa] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [messageAlert, setMessageAlert] = useState("");
  const [corAlert, setCorAlert] = useState("");
  const [selectedValue, setSelectedValue] = useState(1);
  const [tipoDocumento, setTipoDocumento] = useState("CNPJ");

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedTags.length == 0) {
      Swal.fire({
        title: "Atenção",
        text: "Obrigatório selecionar o perfil de cadastro",
        icon: "warning",
        confirmButtonText: "Fechar"
      });
      return;
    }

    let tipoComissaoId = tipoComissao;

    if (tipoComissao == "") {
      tipoComissaoId = 0.0;
    }

    const payload = {
      id_user: user.id_user,
      tag_id: selectedTags,
      razao_social: state.nome,
      nome_fantasia: state.nomeFantasia,
      documento: state.documento,
      email: state.email,
      telefone: state.telefone,
      responsavel_contato: state.responsavel,
      observacao: state.observacao,
      banco: state.banco,
      agencia: state.agencia,
      conta_corrente: state.contaCorrente,
      inscricao_estadual: state.inscricaoEstadual,
      inscricao_municipal: state.inscricaoMunicipal,
      web_site: state.webSite,
      comissao: String(state.comissao),
      tipo_comissao: parseInt(tipoComissaoId),
      address: [
        {
          address: state.endereco,
          bairro: state.bairro,
          numero: state.numeroEndereco,
          estado: state.estado,
          cidade: state.cidade,
          cep: state.cep,
          complemento: state.complemento
        }
      ]
    };

    // console.log("Payload enviado:", payload);
    // return;
    try {
      const response_cadastro = await axios.post(`${api}cadastro/create`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      Swal.fire({
        title: "",
        text: "Cadastro realizado com sucesso",
        icon: "success"
      });

      setTimeout(() => {
        navigate("/cadastro/listar-cadastrados");
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao realizar o cadastro",
        icon: "error",
        confirmButtonText: "Fechar"
      });
      // console.error("Erro ao enviar cadastro:", error.response?.data || error.message);
    }
  };

  const handleChangeTipoComissao = (event) => {
    seTipoComissa(event.target.value);
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

  const handleChangeAbas = (event, newValue) => {
    setTab(newValue);
  };

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  const handleVoltar = () => {
    navigate("/cadastro/listar-cadastrados");
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
                value={telefone}
                onChange={handleChange}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Box>
                  <Radio
                    value="CNPJ"
                    onChange={() => setTipoDocumento("CNPJ")}
                    checked={tipoDocumento === "CNPJ"}
                  />
                  {"CNPJ"}
                </Box>
                <Box>
                  <Radio
                    value="CPF"
                    onChange={() => setTipoDocumento("CPF")}
                    checked={tipoDocumento === "CPF"}
                  />
                  {"CPF"}
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <InputMask
                    mask={tipoDocumento === "CNPJ" ? "99.999.999/9999-99" : "999.999.999-99"}
                    value={documento}
                    onChange={handleChange}
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        fullWidth
                        type="text"
                        name="documento"
                        label="Documento"
                        required
                      />
                    )}
                  </InputMask>

                  {/* <TextField
                    fullWidth
                    type="text"
                    name="documento"
                    value={documento}
                    label="Documento"
                    required
                    onChange={handleChange}
                  /> */}
                </Box>
              </Box>

              <TextField
                fullWidth
                required
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
                value={responsavel}
              />
            </Stack>
          </Grid>
        </Grid>

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
          name="comissao"
          value={tipoComissao}
          onChange={handleChangeTipoComissao}
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

        <Tabs
          value={tab}
          onChange={handleChangeAbas}
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: "divider"
          }}
        >
          <Tab label="Endereço" />
          <Tab label="Dados Bancários" />
          <Tab label="Inscrições, CNAE e Outros" />
        </Tabs>

        {/* endereço */}
        {tab === 0 && (
          <Grid container spacing={6}>
            {/* <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}></Grid> */}
            <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
              <Stack spacing={3}>
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
                  name="bairro"
                  label="Bairro"
                  value={bairro}
                  onChange={handleChange}
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
                  name="numeroEndereco"
                  label="Número"
                  value={numeroEndereco}
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
                  name="estado"
                  onChange={handleChange}
                  label="Estado"
                  value={estado}
                />
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* dados bancários */}
        {tab === 1 && (
          <Grid container spacing={6}>
            {/* <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}></Grid> */}
            <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
              <Stack spacing={3}>
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
                  name="contaCorrente"
                  onChange={handleChange}
                  label="Conta Corrente"
                  value={contaCorrente}
                />
              </Stack>
            </Grid>

            <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="text"
                  name="agencia"
                  label="Agencia"
                  value={agencia}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* inscrição */}
        {tab === 2 && (
          <Grid container spacing={6}>
            {/* <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}></Grid> */}
            <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
              <Stack spacing={3}>
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
                  name="webSite"
                  label="WebSite"
                  value={webSite}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>

            <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="text"
                  name="inscricaoMunicipal"
                  onChange={handleChange}
                  label="Inscrição Municipal"
                  value={inscricaoMunicipal}
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
              </Stack>
            </Grid>
          </Grid>
        )}

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box>
            <Button
              color="primary"
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
            <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar</Span>
            </Button>
          </Box>
        </Box>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        sx={{
          position: "relative",
          left: "50%"
        }}
      >
        <Alert onClose={handleClose} severity={corAlert} variant="filled">
          {messageAlert}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FormCadastro;
