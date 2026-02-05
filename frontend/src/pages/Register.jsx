import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, InputAdornment, Alert, Fade, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Email, Lock, Person, HowToReg, School, Security, Build } from '@mui/icons-material';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');

    const { register, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await register({ name, email, password, role });
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registration failed. Try again.');
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
                            <Typography variant="h4" fontWeight={900} letterSpacing="-0.5px">
                                JOIN <span style={{ color: '#D90429' }}>HOSTEL ISSUE</span>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your account to get started
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
                                label="Full Name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
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

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Select Role (For Testing)</InputLabel>
                                <Select
                                    value={role}
                                    label="Select Role (For Testing)"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <MenuItem value="student">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <School fontSize="small" /> Student
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="staff">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Build fontSize="small" /> Staff
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="warden">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Security fontSize="small" /> Warden
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="admin">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Security color="error" fontSize="small" /> Admin
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                endIcon={<HowToReg />}
                                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link to="/login" style={{ color: '#D90429', textDecoration: 'none', fontWeight: 'bold' }}>
                                        Sign In
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

export default Register;
