import React from "react";
import { Box, Button, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditarUploaDocumentosPlanilha({
  arquivos,
  setArquivos,
  id,
  statusProjeto
}) {
  // 🔥 Adicione o id como prop
  const api = import.meta.env.VITE_API_FLOWSUITE;

  const handleUpload = (event) => {
    if (event.target.files) {
      const novosArquivos = Array.from(event.target.files);
      const arquivosFiltrados = novosArquivos.filter((novo) => {
        return !arquivos.some((existente) => existente.nome_arquivo == novo.name);
      });

      setArquivos([...arquivos, ...arquivosFiltrados]);
    }
  };

  const handleRemoveArquivo = async (arquivo, index) => {
    // 🔥 Recebe o index também
    try {
      const token = localStorage.getItem("accessToken");

      // Se o arquivo já foi enviado para o backend (tem id_arquivo)
      if (arquivo.id_arquivo) {
        const url = `${api}projetos/delete/arquivos/${arquivo.id_arquivo}`;

        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      // 🔥 ATUALIZA A LISTA REMOVENDO O ARQUIVO
      setArquivos(arquivos.filter((_, i) => i !== index));

      Swal.fire({
        title: "Atenção",
        text: "Arquivo excluído com sucesso",
        icon: "success",
        confirmButtonText: "Fechar"
      });
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
      Swal.fire({
        title: "Atenção",
        text: "Erro ao excluir arquivo",
        icon: "error",
        confirmButtonText: "Fechar"
      });
    }
  };

  const handleVisualizar = async (arquivo) => {
    if (arquivo.id_arquivo) {
      try {
        const token = localStorage.getItem("accessToken");
        const url = `${api}projetos/arquivos/${arquivo.id_arquivo}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: "blob"
        });

        const fileName = arquivo.nome_arquivo || arquivo.name || "";
        const fileExtension = fileName.split(".").pop().toLowerCase();

        const mimeTypes = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          bmp: "image/bmp",
          webp: "image/webp",
          txt: "text/plain",
          html: "text/html",
          htm: "text/html",
          xml: "application/xml",
          json: "application/json",
          csv: "text/csv"
        };

        const mimeType =
          mimeTypes[fileExtension] ||
          response.headers["content-type"] ||
          "application/octet-stream";

        const blob = new Blob([response.data], { type: mimeType });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      } catch (error) {
        Swal.fire({
          title: "Atenção",
          text: "Erro ao visualizar arquivo",
          icon: "warning",
          confirmButtonText: "Fechar"
        });
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
        Selecionar Documentos
        <input
          hidden
          type="file"
          multiple
          onChange={handleUpload}
          style={{
            background: statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "blue"
          }}
          disabled={statusProjeto == 2 || statusProjeto == 3}
        />
      </Button>

      {arquivos.length > 0 && (
        <List>
          {arquivos.map((file, index) => (
            <ListItem
              key={index}
              sx={{ border: "0.5px solid #6c721681", borderRadius: 2, mb: 1 }}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    color="primary"
                    sx={{
                      backgroundColor:
                        statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
                    }}
                    onClick={() => handleVisualizar(file)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleRemoveArquivo(file, index)}
                    sx={{
                      backgroundColor:
                        statusProjeto == 2 || statusProjeto == 3 ? "#d4d2d05b" : "#ffffff"
                    }}
                    disabled={statusProjeto == 2 || statusProjeto == 3}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={file.nome_arquivo || file.name}
                secondary={
                  file.size
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : file.created_at
                    ? new Date(file.created_at).toLocaleString()
                    : ""
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
