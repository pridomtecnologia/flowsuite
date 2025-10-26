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
  Alert
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } }
  }
}));

export default function TabelaFechamentOrcamento() {
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

      Swal.fire({
        title: "",
        text: "Cadastro excluído com sucesso",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao excluír o cadastro",
        icon: "error",
        confirmButtonText: "Fechar"
      });
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
        Swal.fire({
          title: "Atenção",
          text: error.response.data.detail.message,
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    };

    listCadastro();
  }, []);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">Número Orçamento</TableCell>
            <TableCell align="center">Projeto</TableCell>
            <TableCell align="center">Cliente</TableCell>
            <TableCell align="center">Valor Orçado</TableCell>
            <TableCell align="center">Valor Realizado</TableCell>
            <TableCell align="center">Valor Líquido</TableCell>
            <TableCell align="center">Status Orçamento</TableCell>
            <TableCell align="center">Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Sem registro</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
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
