import React from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UploaDocumentosPlanilha({ arquivos, setArquivos }) {
  const handleUpload = (event) => {
    if (event.target.files) {
      const novosArquivos = Array.from(event.target.files);
      const arquivosFiltrados = novosArquivos.filter((novo) => {
        return !arquivos.some((existente) => existente.nome_arquivo == novo.name);
      });

      setArquivos([...arquivos, ...arquivosFiltrados]);
    }
  };

  const handleRemove = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* <Typography variant="p" gutterBottom>
        Anexar Documentos
      </Typography> */}

      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
        Selecionar Documentos
        <input hidden type="file" multiple onChange={handleUpload} />
      </Button>

      {arquivos.length > 0 && (
        <List>
          {arquivos.map((file, index) => (
            <ListItem
              sx={{ border: "0.5px solid #6c721681", borderRadius: 2, mb: 1 }}
              key={index}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => handleRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(1)} KB`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
