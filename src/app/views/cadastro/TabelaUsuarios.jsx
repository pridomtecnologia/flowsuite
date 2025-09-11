import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Icon,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  Snackbar,
  Alert,
  Typography
} from "@mui/material";
import axios from "axios";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

export default function TabelaUsuarios() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listCadastrado, setListCadastrado] = useState([]);

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const navigate = useNavigate();

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditarCadastro = (id_cadastro) => {
    navigate(`/cadastro/editar/${id_cadastro}`);
  };

  const handleExcluirCadastro = async (id_cadastro) => {
    try {
      const response_exclusao_cadastro = await axios.delete(
        `${api}cadastro/delete/${id_cadastro}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      setListCadastrado((prev) => prev.filter((item) => item.id_cadastro !== id_cadastro));

      setOpen(true);
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error.response?.data || error.message);
    }
  };

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  useEffect(() => {
    const listCadastro = async () => {
      try {
        const response_list_cadastro = await axios.get(`${api}cadastro/list`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });

        setListCadastrado(response_list_cadastro.data);
      } catch (error) {
        alert(error.response.data.detail.message);
      }
    };

    listCadastro();
  }, []);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">Situação</TableCell>
            <TableCell align="center">Tag</TableCell>
            <TableCell align="center">Razão Social</TableCell>
            <TableCell align="center">CNPJ / CPF</TableCell>
            <TableCell align="center">E-mail</TableCell>
            <TableCell align="center">Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listCadastrado != "" ? (
            <>
              {listCadastrado
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((subscriber, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          background:
                            subscriber.situacao_cadastro == "Ativo" ? "#8fa5c7ff" : "#a3a3a3ff",
                          padding: "2px 5px",
                          color: "#252323ff",
                          fontWeight: "bold"
                        }}
                      >
                        {subscriber.situacao_cadastro}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {subscriber.tags.split(" ").map((word, i) => (
                        <span
                          key={i}
                          style={{
                            background: i % 2 === 0 ? "#8fa5c7ff" : "#a3a3a3ff",
                            margin: "1px",
                            padding: "2px 5px",
                            color: "#302f2fff",
                            fontWeight: "bold"
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell align="center">{subscriber.razao_social}</TableCell>
                    <TableCell align="center">{subscriber.documento}</TableCell>
                    <TableCell align="center">{subscriber.email}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditarCadastro(subscriber.id_cadastro)}>
                        <Icon color="blue" title="Editar">
                          edit
                        </Icon>
                      </IconButton>
                      <IconButton onClick={() => handleExcluirCadastro(subscriber.id_cadastro)}>
                        <Icon color="error" title="Excluir">
                          delete_forever
                        </Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </>
          ) : (
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Sem registro</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          )}
        </TableBody>
      </StyledTable>
      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={listCadastrado.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />

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
          Cadastro excluído com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}
