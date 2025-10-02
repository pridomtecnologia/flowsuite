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
    name: "john doe",
    date: "46.555.888/0001-99",
    company: "john rap"
  },
  {
    name: "kessy bryan",
    date: "46.555.888/0001-99",
    company: "kessy music"
  },
  {
    name: "joão silva",
    date: "46.555.888/0001-99",
    company: "joao som"
  }
];

export default function TabelaTags() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listTags, setListTags] = useState([]);

  const api = import.meta.env.VITE_API_FLOWSUITE;

  useEffect(() => {
    const ListarTags = async () => {
      try {
        const response_list_tags = await axios.get(`${api}tag/list`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        setListTags(response_list_tags.data);
      } catch (error) {
        console.error("Erro ao listar tags:", error);
        Swal.fire({
          title: "Atenção",
          text: "Erro ao listar tags!",
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    };

    ListarTags();
  }, []);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Tag</TableCell>
            <TableCell align="center">Situação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTags != "" ? (
            <>
              {listTags
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tag, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{tag.id_tag}</TableCell>
                    <TableCell align="center">{tag.tag}</TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          background: tag.active == 1 ? "#5CCB5F" : "#FF2C2C",
                          padding: "4px 15px",
                          color: "#252323ff",
                          fontWeight: "bold",
                          borderRadius: "50px"
                        }}
                      >
                        {tag.active == 1 ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    {/* <TableCell align="center">
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
                    </TableCell> */}
                  </TableRow>
                ))}
            </>
          ) : (
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Sem registro</TableCell>
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
        count={listTags.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
}
