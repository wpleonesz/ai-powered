import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#6A0DAD', // Púrpura elegante
      dark: '#4A0082', // Índigo profundo
      light: '#9370DB', // Púrpura medio
    },
    secondary: {
      main: '#FF7F50', // Coral para acentos
      dark: '#E65C3E',
      light: '#FFA07A',
    },
    inherit: {
      backgroundColor: '#EF4444',
      color: '#fff',
    },
    default: {
      backgroundColor: '#F8F9FA',
      color: '#495057',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
      dark: '#343A40',
    },
    show: {
      backgroundColor: '#20C997',
      color: '#fff',
    },
    success: {
      main: '#20C997', // Verde turquesa
      dark: '#198754',
      light: '#4DD4AC',
    },
    info: {
      main: '#0DCAF0', // Celeste
      dark: '#0B9ED7',
      light: '#4DDAF4',
    },
    warning: {
      main: '#FFC107', // Ámbar
      dark: '#EAAD00',
      light: '#FFCD39',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#B7B7B7 transparent',
          '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 6,
            backgroundColor: '#B7B7B7',
            minHeight: 24,
            minWidth: 24,
          },
          '&::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#adadad',
          },
          '&::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#adadad',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#adadad',
          },
          '&::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 8,
        textTransform: 'uppercase',
        fontWeight: 500,
        boxShadow: 'none',
        padding: '8px 16px',
      },
      contained: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #6A0DAD 30%, #8A2BE2 90%)',
      },
      containedSecondary: {
        background: 'linear-gradient(45deg, #FF7F50 30%, #FFA07A 90%)',
      },
    },
    MuiCard: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.09)',
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      },
      elevation2: {
        boxShadow: '0 3px 15px rgba(0,0,0,0.07)',
      },
    },
    MuiTableCell: {
      head: {
        fontWeight: 600,
        backgroundColor: '#F8F9FA',
      },
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: '#FFFFFF',
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#FFFFFF',
        borderRight: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      },
    },
    MuiListItem: {
      button: {
        '&:hover': {
          backgroundColor: 'rgba(106, 13, 173, 0.04)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
    MuiTooltip: {
      arrow: true,
    },
    MuiTabs: {
      indicatorColor: 'primary',
    },
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 3px 6px rgba(0,0,0,0.07)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 5px 10px rgba(0,0,0,0.09)',
    '0 6px 12px rgba(0,0,0,0.10)',
    '0 7px 14px rgba(0,0,0,0.11)',
    '0 8px 16px rgba(0,0,0,0.12)',
    '0 9px 18px rgba(0,0,0,0.13)',
    '0 10px 20px rgba(0,0,0,0.14)',
    '0 11px 22px rgba(0,0,0,0.15)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 13px 26px rgba(0,0,0,0.17)',
    '0 14px 28px rgba(0,0,0,0.18)',
    '0 15px 30px rgba(0,0,0,0.19)',
    '0 16px 32px rgba(0,0,0,0.20)',
    '0 17px 34px rgba(0,0,0,0.21)',
    '0 18px 36px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.23)',
    '0 20px 40px rgba(0,0,0,0.24)',
    '0 21px 42px rgba(0,0,0,0.25)',
    '0 22px 44px rgba(0,0,0,0.26)',
    '0 23px 46px rgba(0,0,0,0.27)',
    '0 24px 48px rgba(0,0,0,0.28)',
  ],
});

export default theme;
