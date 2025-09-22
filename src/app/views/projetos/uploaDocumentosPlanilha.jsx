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
      setArquivos([...arquivos, ...novosArquivos]);
    }
  };

  const handleRemove = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Envie o documento
      </Typography>

      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
        Selecionar Arquivos
        <input hidden type="file" multiple onChange={handleUpload} />
      </Button>

      {arquivos.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <List>
            {arquivos.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
