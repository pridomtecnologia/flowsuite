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
  const [listarFechamentoProjeto, setListarFechamentoProjeto] = useState([]);

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const navigate = useNavigate();

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleVisualizarFechamentoProjeto = (id_fechamento_projeto) => {
    navigate(`/projetos/fechamento/editar-fechamento-projeto/${id_fechamento_projeto}/0`);
  };

  const handleEditarFechamentoProjeto = (id_fechamento_projeto) => {
    navigate(`/projetos/fechamento/editar-fechamento-projeto/${id_fechamento_projeto}/1`);
  };

  const handleExcluirFechamentoProjeto = async (id_fechamento_projeto) => {
    try {
      const response_exclusao_cadastro = await axios.delete(
        `${api}projetos/delete-fechamento-projeto/${id_fechamento_projeto}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      );

      setListarFechamentoProjeto((prev) =>
        prev.filter((item) => item.id_fechamento_orcamento !== id_fechamento_projeto)
      );

      Swal.fire({
        title: "",
        text: "Fechamento do projeto excluído com sucesso",
        icon: "success"
      });
    } catch (error) {
      if (error.response?.status === 401) return;
      Swal.fire({
        title: "",
        text: "Erro ao excluír o Fechamento do projeto",
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
    const listFechamentoProjeto = async () => {
      try {
        const response_list_fecharmento_projeto = await axios.get(
          `${api}projetos/listar-fechamento-projeto/0`,
          {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("accessToken")
            }
          }
        );

        setListarFechamentoProjeto(response_list_fecharmento_projeto.data);
      } catch (error) {
        if (error.response?.status === 401) return;
        Swal.fire({
          title: "Atenção",
          text: error.response.data.detail.message,
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    };

    listFechamentoProjeto();
  }, []);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">Projeto</TableCell>
            <TableCell align="center">Fornecedor</TableCell>
            <TableCell align="center">Descrição</TableCell>
            <TableCell align="center">Valor</TableCell>
            <TableCell align="center">Status Pagamento</TableCell>
            <TableCell align="center">Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listarFechamentoProjeto != "" ? (
            <>
              {listarFechamentoProjeto
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((listar_fechamento_projeto_cadastrado, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {listar_fechamento_projeto_cadastrado.titulo}
                    </TableCell>
                    <TableCell align="center">
                      {listar_fechamento_projeto_cadastrado.fornecedor}
                    </TableCell>
                    <TableCell align="center">
                      {listar_fechamento_projeto_cadastrado.descricao_planilha_custo_projeto}
                    </TableCell>
                    <TableCell align="center">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(listar_fechamento_projeto_cadastrado.valor)}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          background:
                            listar_fechamento_projeto_cadastrado.status_job == "Pendente"
                              ? "#5CCB5F"
                              : listar_fechamento_projeto_cadastrado.status_job == "Aprovado" ||
                                listar_fechamento_projeto_cadastrado.status_job == "Agendado" ||
                                listar_fechamento_projeto_cadastrado.status_job == "Pago"
                              ? "#0000ff7e"
                              : "#FF2C2C",
                          padding: "4px 15px",
                          color: "#ffffff",
                          fontWeight: "bold",
                          borderRadius: "50px"
                        }}
                      >
                        {listar_fechamento_projeto_cadastrado.status_job}
                      </span>
                    </TableCell>

                    <TableCell align="center" sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        onClick={() =>
                          handleVisualizarFechamentoProjeto(
                            listar_fechamento_projeto_cadastrado.id_fechamento_orcamento
                          )
                        }
                        title="Visualizar Fechamento Projeto"
                        sx={{
                          display: ["Aprovado", "Pago", "Reprovado"].includes(
                            listar_fechamento_projeto_cadastrado.status_job
                          )
                            ? "flex"
                            : "none"
                        }}
                      >
                        <Icon color="blue">visibility</Icon>
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          handleEditarFechamentoProjeto(
                            listar_fechamento_projeto_cadastrado.id_fechamento_orcamento
                          )
                        }
                        // title="Editar Fechamento Projeto"
                        title={listar_fechamento_projeto_cadastrado.status_job}
                        sx={{
                          display: ["Aprovado", "Pago", "Reprovado"].includes(
                            listar_fechamento_projeto_cadastrado.status_job
                          )
                            ? "none"
                            : "flex"
                        }}
                      >
                        <Icon color="blue">edit</Icon>
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          handleExcluirFechamentoProjeto(
                            listar_fechamento_projeto_cadastrado.id_fechamento_orcamento
                          )
                        }
                        title="Excluir Fechamento Projeto"
                        sx={{
                          display: ["Aprovado", "Pago", "Reprovado"].includes(
                            listar_fechamento_projeto_cadastrado.status_job
                          )
                            ? "none"
                            : "flex"
                        }}
                      >
                        <Icon color="error">delete_forever</Icon>
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
        count={listarFechamentoProjeto.length}
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
