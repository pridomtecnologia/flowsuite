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

const FormCadastroTags = ({ onSuccess, onClose }) => {
  const [state, setState] = useState({
    tag: ""
  });

  const api = import.meta.env.VITE_API_FLOWSUITE;
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { tag } = state;

    try {
      const payload = {
        tag: tag
      };

      const response_tag = await axios.post(`${api}tag/create`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      Swal.fire({
        title: "",
        text: "Tag cadastrada com sucesso",
        icon: "success"
      });

      navigate("/cadastro/listar-tags");
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao cadastrar a Tag",
        icon: "error"
      });
    }
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { tag } = state;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="tag"
                label="tag"
                required
                onChange={handleChange}
                value={tag}
              />
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Stack spacing={3}>
              <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
                <Icon>save</Icon>
                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cadastrar Tag</Span>
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default FormCadastroTags;
