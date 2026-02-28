import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    board: {
      bg: string;
      grid: string;
    };
  }
  interface PaletteOptions {
    board?: {
      bg?: string;
      grid?: string;
    };
  }
}