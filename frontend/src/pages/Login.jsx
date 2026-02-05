import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, InputAdornment, IconButton, Alert, Fade } from '@mui/material';
import { Email, Lock, Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 50%, #1a0505 0%, #050505 100%)'
            }}
        >
            <Container maxWidth="xs">
                <Fade in={true} timeout={1000}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 4,
                            border: '1px solid rgba(217, 4, 41, 0.2)',
                            boxShadow: '0 0 40px rgba(217, 4, 41, 0.1)'
                        }}
                    >
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight={900} letterSpacing="-1px">
                                HOSTEL<span style={{ color: '#D90429' }}>ISSUE</span>
                            </Typography>
                            <Typography variant="overline" color="text.secondary" letterSpacing={2}>
                                System Access
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ width: '100%', mb: 3 }} variant="outlined">
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                endIcon={<LoginIcon />}
                                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                            >
                                {loading ? 'Verifying...' : 'Sign In'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link to="/register" style={{ color: '#D90429', textDecoration: 'none', fontWeight: 'bold' }}>
                                        Create one
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Login;
