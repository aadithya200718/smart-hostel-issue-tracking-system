import { useEffect, useState } from 'react';
import useAuxStore from '../store/useAuxStore';
import useAuthStore from '../store/useAuthStore';
import {
    Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, Chip, TextField, Select, MenuItem, Tabs, Tab, Paper
} from '@mui/material';
import { Search, Add, LocationOn, Phone, CheckCircle, CloudUpload } from '@mui/icons-material';

const LostFound = () => {
    const { lostItems, fetchLostItems, reportLostItem, markAsClaimed, loading } = useAuxStore();
    const { user } = useAuthStore();
    const [tab, setTab] = useState(0); // 0: Browse, 1: Report

    // Form State
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('LOST');
    const [contactInfo, setContactInfo] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchLostItems();
    }, [fetchLostItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('category', category);
        formData.append('contactInfo', contactInfo);
        if (image) formData.append('image', image);

        await reportLostItem(formData);
        setTab(0);
        setItemName(''); setDescription(''); setLocation('');
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Search sx={{ color: '#9c27b0', fontSize: 40 }} /> Lost & Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Report lost items or find what you're missing.</Typography>
                </Box>

                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Tab label="Browse Items" />
                    <Tab label="Report Item" />
                </Tabs>
            </Box>

            {tab === 1 ? (
                <Container maxWidth="sm">
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Report Item</Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="LOST">I Lost Something</MenuItem>
                                    <MenuItem value="FOUND">I Found Something</MenuItem>
                                </Select>
                            </Box>
                            <TextField label="Item Name" fullWidth required value={itemName} onChange={(e) => setItemName(e.target.value)} />
                            <TextField label="Description" fullWidth multiline rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField label="Location" fullWidth required value={location} onChange={(e) => setLocation(e.target.value)} />
                                <TextField label="Contact Info" fullWidth value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                            </Box>

                            <Button component="label" variant="outlined" startIcon={<CloudUpload />}>
                                Upload Image
                                <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button onClick={() => setTab(0)}>Cancel</Button>
                                <Button type="submit" variant="contained">Submit Report</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            ) : (
                <Grid container spacing={3}>
                    {loading ? <Typography sx={{ m: 4 }}>Loading...</Typography> : lostItems.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {item.image && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:5000/${item.image}`}
                                        alt={item.itemName}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Chip
                                            label={item.category}
                                            color={item.category === 'LOST' ? 'error' : 'success'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                        {item.status === 'CLAIMED' && (
                                            <Chip icon={<CheckCircle />} label="CLAIMED" size="small" />
                                        )}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{item.itemName}</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>{item.description}</Typography>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOn fontSize="inherit" /> {item.location}
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Phone fontSize="inherit" /> Contact: {item.contactInfo || 'N/A'}
                                        </Typography>

                                        {item.status === 'OPEN' && (user.id === item.reporterId || user.role === 'admin') && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="success"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                onClick={() => markAsClaimed(item.id)}
                                            >
                                                Mark as Claimed
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default LostFound;
