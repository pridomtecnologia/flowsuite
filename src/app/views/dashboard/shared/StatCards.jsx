import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import AttachMoney from "@mui/icons-material/AttachMoney";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { Small } from "app/components/Typography";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

export default function StatCards() {
  const cardList = [
    { name: "Projetos Ativos", amount: 0, Icon: FolderIcon },
    { name: "Orçamentos Pendentes", amount: 0, Icon: DescriptionIcon },
    { name: "Tarefas Concluídas", amount: 0, Icon: CheckBoxIcon },
    { name: "Rentabilidade Média", amount: 0, Icon: AttachMoney }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name }) => (
        <Grid size={{ md: 3, xs: 12 }} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" />

              <Box ml="5px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton>{/* <ArrowRightAlt /> */}</IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
