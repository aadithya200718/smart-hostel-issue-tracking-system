import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#050505',
            paper: '#121212',
        },
        primary: {
            main: '#D90429', // Red
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#2B2D42', // Grayish Blue
        },
        text: {
            primary: '#EDF2F4',
            secondary: '#8D99AE',
        },
        error: {
            main: '#EF233C',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(217, 4, 41, 0.4)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #D90429 30%, #EF233C 90%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#121212',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 16,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(5, 5, 5, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: 'none',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#0a0a0a',
                }
            }
        }
    },
});

export default theme;
