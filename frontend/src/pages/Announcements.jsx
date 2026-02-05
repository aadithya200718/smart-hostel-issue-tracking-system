import { useEffect, useState } from 'react';
import useAuxStore from '../store/useAuxStore';
import useAuthStore from '../store/useAuthStore';
import {
    Container, Typography, Box, Button, Card, CardContent, TextField, Select, MenuItem, Chip, IconButton, Paper, Fab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Campaign, Add, Close, AccessTime, PriorityHigh } from '@mui/icons-material';

const Announcements = () => {
    const { announcements, fetchAnnouncements, createAnnouncement, loading } = useAuxStore();
    const { user } = useAuthStore();
    const [openDialog, setOpenDialog] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('NORMAL');

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleSubmit = async () => {
        await createAnnouncement({ title, content, priority });
        setOpenDialog(false);
        setTitle('');
        setContent('');
    };

    const isAdmin = ['warden', 'admin'].includes(user?.role);

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Campaign color="primary" fontSize="large" /> Announcements
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Official updates and notices from hostel management.</Typography>
                </Box>

                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                    >
                        New Announcement
                    </Button>
                )}
            </Box>

            {/* Creations Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Draft New Announcement</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="NORMAL">Normal Priority</MenuItem>
                        <MenuItem value="HIGH">High Priority</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Post</Button>
                </DialogActions>
            </Dialog>

            {/* Feed */}
            {loading ? (
                <Typography textAlign="center">Loading updates...</Typography>
            ) : announcements.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                    <Typography color="text.secondary">No announcements yet.</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {announcements.map(ann => (
                        <Card
                            key={ann.id}
                            sx={{
                                position: 'relative',
                                borderLeft: ann.priority === 'HIGH' ? '4px solid #D90429' : '1px solid rgba(255,255,255,0.12)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateX(4px)' }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">{ann.title}</Typography>
                                    {ann.priority === 'HIGH' && (
                                        <Chip
                                            icon={<PriorityHigh sx={{ fontSize: 14 }} />}
                                            label="HIGH PRIORITY"
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                                    {ann.content}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                        {ann.author?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AccessTime fontSize="small" /> {new Date(ann.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
};
import { Divider } from '@mui/material'; // Forgot import

export default Announcements;
