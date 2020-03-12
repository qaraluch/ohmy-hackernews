import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["BlinkMacSystemFont", "Roboto", "Arial", "sans-serif"].join(
      ","
    )
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  palette: {
    primary: {
      main: "#ff6f00"
    },
    secondary: {
      main: "#37474f"
    }
  }
});

export { theme };
