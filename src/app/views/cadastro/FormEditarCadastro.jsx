import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Tab, Tabs, Snackbar, Alert } from "@mui/material";

const FormEditarCadastro = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [definirComissao, setDefinirComissao] = useState("none");
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
  const [tipoComissao, setTipoComissao] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API_FLOWSUITE;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar tags disponíveis
        const response_tag = await axios.get(`${api}tag/list`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        setTags(response_tag.data);

        // Buscar dados do cadastro
        const response_cadastro = await axios.get(`${api}cadastro/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        const cadastroData = response_cadastro.data[0];

        // Preencher o estado com os dados do cadastro
        setState({
          nome: cadastroData.razao_social || "",
          nomeFantasia: cadastroData.nome_fantasia || "",
          documento: cadastroData.documento || "",
          email: cadastroData.email || "",
          telefone: cadastroData.telefone || "",
          responsavel: cadastroData.responsavel_contato || "",
          observacao: cadastroData.observacao || "",
          comissao: cadastroData.comissao || "",
          endereco: cadastroData.endereco || "",
          numeroEndereco: cadastroData.numero || "",
          bairro: cadastroData.bairro || "",
          complemento: cadastroData.complemento || "",
          estado: cadastroData.estado || "",
          cidade: cadastroData.cidade || "",
          cep: cadastroData.cep || "",
          webSite: cadastroData.web_site || "",
          banco: cadastroData.banco || "",
          agencia: cadastroData.agencia || "",
          contaCorrente: cadastroData.conta_corrente || "",
          inscricaoEstadual: cadastroData.inscricao_estadual || "",
          inscricaoMunicipal: cadastroData.inscricao_municipal || "",
          tipo_comissao: cadastroData.tipo_comissao || ""
        });

        const tipo_comissao_id = cadastroData.tipo_comissao_id || "";

        // Configurar tags selecionadas
        if (cadastroData.ids_tags) {
          const tagIds = cadastroData.ids_tags.split(",").map((id) => parseInt(id.trim()));
          setSelectedTags(tagIds);

          // Verificar se tem tag de Vendedor para mostrar comissão
          const hasVendedorTag = tagIds.some((tagId) => {
            const tag = response_tag.data.find((t) => t.id_tag === tagId);
            return tag && tag.tag === "Vendedor";
          });

          if (hasVendedorTag) {
            setShowComissao(true);
            setDefinirComissao("block");
          }
        }

        setTipoComissao(cadastroData.tipo_comissao_id || "");
      } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, api]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let tipoComissaoId = tipoComissao;
    if (tipoComissao === "") {
      tipoComissaoId = 0;
    }

    const payload = {
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
      comissao: state.comissao,
      tipo_comissao: tipoComissaoId,
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

    try {
      const response = await axios.put(`${api}cadastro/atualizar/${id}`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setOpen(true);
      navigate("/cadastro/listar-cadastrados");
    } catch (error) {
      console.error("Erro ao atualizar cadastro:", error.response?.data || error.message);
    }
  };

  const handleChangeTipoComissao = (event) => {
    setTipoComissao(event.target.value);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
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

  const handleChangeAbas = (event, newValue) => {
    setTab(newValue);
  };

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

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
                required
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
          name="tipo_comissao"
          value={tipoComissao}
          onChange={handleChangeTipoComissao}
          sx={{ display: definirComissao, mt: 2 }}
        >
          <TextField
            fullWidth
            type="number"
            name="comissao"
            onChange={handleChange}
            label="Comissão (%)"
            value={comissao}
            sx={{ mb: 2 }}
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
                  label="Agência"
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

        <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
          <Icon>save</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Atualizar</Span>
        </Button>
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
        <Alert onClose={handleClose} severity="success" variant="filled">
          Cadastro atualizado com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FormEditarCadastro;
