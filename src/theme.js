import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#060644',
    },
    secondary: {
      main: '#f5842c',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
