import { useState } from 'react';
import useIssueStore from '../../store/useIssueStore';
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Alert, IconButton } from '@mui/material';
import { ArrowBack, CloudUpload, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
    const { reportIssue, loading } = useIssueStore();
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Electrical');
    const [priority, setPriority] = useState('LOW');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('priority', priority);
        formData.append('location', location);

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        const success = await reportIssue(formData);
        if (success) {
            setMessage('success');
            setTimeout(() => navigate('/issues'), 1500);
        } else {
            setMessage('error');
        }
    };

    return (
        <Container maxWidth="md">
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
                color="inherit"
            >
                Back to Dashboard
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Report an Issue</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Please provide detailed information to help us resolve the issue quickly.
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {message === 'success' && <Alert severity="success" sx={{ mb: 3 }}>Issue reported successfully!</Alert>}
                {message === 'error' && <Alert severity="error" sx={{ mb: 3 }}>Failed to report issue.</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Issue Title"
                                fullWidth
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Location"
                                fullWidth
                                required
                                placeholder="e.g. Room 304"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Category"
                                fullWidth
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {['Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Other'].map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Priority"
                                fullWidth
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High (Urgent)</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                sx={{ height: 100, width: '100%', borderStyle: 'dashed' }}
                            >
                                Upload Images
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {images.length > 0 && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{images.length} files selected</Typography>}
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};
import { Grid, Divider } from '@mui/material'; // Forgot to import Grid earlier

export default ReportIssue;
