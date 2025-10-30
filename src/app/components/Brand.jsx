import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 29px"
}));

const BrandText = styled(Box)(({ mode, theme }) => ({
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  display: mode === "compact" ? "none" : "flex",
  alignItems: "center",
  gap: 4,
  color: theme.palette.text.primary
}));

const FlowPart = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main
}));

const SuitePart = styled("span")(({ theme }) => ({
  color: theme.palette.grey[300]
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <BrandText mode={mode}>
        <SuitePart>FLOW</SuitePart>
        <SuitePart>SUITE</SuitePart>
      </BrandText>

      {/* <Box className="sidenavHoverShow" sx={{ display: mode === "compact" ? "none" : "block" }}>
        {children || null}
      </Box> */}
    </BrandRoot>
  );
}
