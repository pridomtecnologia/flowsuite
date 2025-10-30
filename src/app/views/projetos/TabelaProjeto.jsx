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
  TablePagination
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
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

const subscribarList = [
  {
    name: "5151",
    date: "magazilete",
    amount: 1000,
    status: "close",
    company: "ABC Fintech LTD."
  },
  {
    name: "+561",
    date: "coca",
    amount: 9000,
    status: "open",
    company: "My Fintech LTD."
  },
  {
    name: "15615",
    date: "gr6",
    amount: 9000,
    status: "open",
    company: "My Fintech LTD."
  }
];

export default function TabelaProjeto() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listOrcamentoCadastrado, setListOrcamentoCadastrado] = useState([]);

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const navigate = useNavigate();

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditarOrcamento = (id_projeto) => {
    navigate(`/projeto/${id_projeto}/1/0`);
  };

  const handleExcluirOrcamento = async (id_projeto) => {
    try {
      const response_exclusao_cadastro = await axios.delete(`${api}projetos/delete/${id_projeto}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      });

      setListOrcamentoCadastrado((prev) => prev.filter((item) => item.id_projeto !== id_projeto));

      Swal.fire({
        title: "",
        text: "Orçamento excluído com sucesso!",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "",
        text: "Erro ao excluir orçamento!",
        icon: "error"
      });
      // console.error("Erro ao enviar cadastro:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const listOrcamentoProjeto = async () => {
      try {
        const response_lista_orcamento_projeto_create = await axios.get(`${api}projetos/listar`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        console.log(response_lista_orcamento_projeto_create.data);
        setListOrcamentoCadastrado(response_lista_orcamento_projeto_create.data);
      } catch (error) {
        console.log(error);
        alert(error.response.data.detail);
      }
    };

    listOrcamentoProjeto();
  }, []);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">Número Orçamento</TableCell>
            <TableCell align="center">Projeto</TableCell>
            <TableCell align="center">Cliente</TableCell>
            <TableCell align="center">Valor Geral</TableCell>
            <TableCell align="center">Status Orçamento</TableCell>
            <TableCell align="center">Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOrcamentoCadastrado != "" ? (
            <>
              {listOrcamentoCadastrado
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((listar_orcamento, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{listar_orcamento.numero_orcamento}</TableCell>
                    <TableCell align="center">{listar_orcamento.titulo}</TableCell>
                    <TableCell align="center">{listar_orcamento.cliente}</TableCell>
                    <TableCell align="center">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(listar_orcamento.total_orcamento)}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          background:
                            listar_orcamento.status_projeto == "Em Andamento"
                              ? "#0000ff7e"
                              : listar_orcamento.status_projeto === "Aprovado"
                              ? "#5CCB5F"
                              : "#FF2C2C",
                          padding: "4px 15px",
                          color: "#ffffff",
                          fontWeight: "bold",
                          borderRadius: "50px"
                        }}
                      >
                        {listar_orcamento.status_projeto}
                      </span>
                    </TableCell>
                    <TableCell align="center" sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        onClick={() => handleEditarOrcamento(listar_orcamento.id_projeto)}
                        title="Visualizar Orçamento"
                        sx={{
                          display:
                            listar_orcamento.id_status_projeto == 3 ||
                            listar_orcamento.id_status_projeto == 2
                              ? "flex"
                              : "none"
                        }}
                      >
                        <Icon color="blue">visibility</Icon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditarOrcamento(listar_orcamento.id_projeto)}
                        title="Editar Orçamento"
                        sx={{
                          display:
                            listar_orcamento.id_status_projeto == 3 ||
                            listar_orcamento.id_status_projeto == 2
                              ? "none"
                              : "flex"
                        }}
                      >
                        <Icon color="blue">edit</Icon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleExcluirOrcamento(listar_orcamento.id_projeto)}
                        title="Excluir Orçamento"
                        sx={{
                          display:
                            listar_orcamento.id_status_projeto == 3 ||
                            listar_orcamento.id_status_projeto == 2
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
        count={listOrcamentoCadastrado.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
}
