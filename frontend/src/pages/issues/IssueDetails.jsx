import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useIssueStore from '../../store/useIssueStore';
import useAuthStore from '../../store/useAuthStore';
import {
    Container, Grid, Paper, Typography, Chip, Box, Button, TextField, MenuItem, Avatar, Divider, Select, FormControl, InputLabel
} from '@mui/material';
import { ArrowBack, Send, AccessTime, Person, Engineering } from '@mui/icons-material';

const IssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        currentIssue: issue,
        fetchIssue,
        updateIssueStatus,
        assignIssue,
        staffMembers,
        fetchStaff,
        loading
    } = useIssueStore();

    const [statusRemark, setStatusRemark] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');

    useEffect(() => {
        fetchIssue(id);
        if (['warden', 'admin'].includes(user?.role)) {
            fetchStaff();
        }
    }, [id, fetchIssue, fetchStaff, user?.role]);

    const handleStatusUpdate = async () => {
        if (!selectedStatus) return;
        await updateIssueStatus(id, selectedStatus, statusRemark);
        setStatusRemark('');
        setSelectedStatus('');
    };

    const handleAssign = async () => {
        if (!selectedAssignee) return;
        await assignIssue(id, selectedAssignee);
    };

    if (loading || !issue) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading details...</Typography></Box>;

    const isStaffOrAdmin = ['maintenance', 'warden', 'admin'].includes(user?.role);
    const canAssign = ['warden', 'admin'].includes(user?.role);

    return (
        <Container maxWidth="lg">
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
                color="inherit"
            >
                Back to Issues
            </Button>

            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h4" fontWeight="bold">{issue.title}</Typography>
                            <Chip
                                label={issue.status}
                                color={issue.status === 'RESOLVED' ? 'success' : issue.status === 'OPEN' ? 'info' : 'default'}
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 4, color: 'text.secondary' }}>
                            <Typography variant="subtitle2" sx={{ color: 'error.main', fontWeight: 'bold' }}>{issue.priority} Priority</Typography>
                            <Typography variant="subtitle2">•</Typography>
                            <Typography variant="subtitle2">{issue.category}</Typography>
                            <Typography variant="subtitle2">•</Typography>
                            <Typography variant="subtitle2">{issue.location}</Typography>
                        </Box>

                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Description</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: 'action.hover' }}>
                            <Typography variant="body1">{issue.description}</Typography>
                        </Paper>

                        {issue.images && issue.images.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Evidence</Typography>
                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                                    {issue.images.map((img, idx) => (
                                        <Box
                                            component="img"
                                            key={idx}
                                            src={`http://localhost:5000/${img}`}
                                            sx={{ height: 150, width: 200, objectFit: 'cover', borderRadius: 2, border: '1px solid #444' }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {/* Timeline */}
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Activity Log</Typography>
                        <Box sx={{ position: 'relative', ml: 1, pl: 3, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                            {issue.logs && issue.logs.map(log => (
                                <Box key={log.id} sx={{ mb: 3, position: 'relative' }}>
                                    <Box sx={{
                                        position: 'absolute', left: -32, top: 4, width: 12, height: 12, borderRadius: '50%',
                                        bgcolor: 'background.paper', border: '2px solid gray'
                                    }} />
                                    <Typography variant="body2" fontWeight="bold">
                                        {log.remark || 'Status Update'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">{log.changedBy?.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">•</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTime sx={{ fontSize: 10, mr: 0.5 }} /> {new Date(log.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    {log.statusFrom !== log.statusTo && (
                                        <Typography variant="caption" color="error">
                                            {log.statusFrom || 'New'} &rarr; {log.statusTo}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Engineering fontSize="small" /> Assignee
                            </Typography>
                            {issue.assignee ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                                    <Avatar sx={{ bgcolor: 'error.main' }}>{issue.assignee.name.charAt(0)}</Avatar>
                                    <Typography>{issue.assignee.name}</Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">No staff assigned.</Typography>
                            )}

                            {canAssign && (
                                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <InputLabel>Assign Staff</InputLabel>
                                        <Select
                                            value={selectedAssignee}
                                            label="Assign Staff"
                                            onChange={(e) => setSelectedAssignee(e.target.value)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {staffMembers.map(staff => (
                                                <MenuItem key={staff.id} value={staff.id}>{staff.name} ({staff.role})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button fullWidth variant="contained" onClick={handleAssign}>Assign</Button>
                                </Box>
                            )}
                        </Paper>

                        {isStaffOrAdmin && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Send fontSize="small" /> Update Status
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={selectedStatus}
                                            label="Status"
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                                            <MenuItem value="CLOSED">Closed (Verified)</MenuItem>
                                            <MenuItem value="REJECTED">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        multiline
                                        rows={3}
                                        placeholder="Add a remark..."
                                        fullWidth
                                        value={statusRemark}
                                        onChange={(e) => setStatusRemark(e.target.value)}
                                    />
                                    <Button fullWidth variant="outlined" color="primary" onClick={handleStatusUpdate}>
                                        Update Issue
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default IssueDetails;
