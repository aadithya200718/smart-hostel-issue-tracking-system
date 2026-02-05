import { useEffect, useState } from 'react';
import useIssueStore from '../../store/useIssueStore';
import {
    Grid, Card, CardContent, Typography, Box, Chip, FormControl, Select, MenuItem, InputLabel, CircularProgress, Container
} from '@mui/material';
import { LocationOn, AccessTime, ArrowForward, PriorityHigh } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const IssueList = () => {
    const { issues, fetchIssues, loading } = useIssueStore();
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        const filters = {};
        if (statusFilter) filters.status = statusFilter;
        if (priorityFilter) filters.priority = priorityFilter;
        fetchIssues(filters);
    }, [fetchIssues, statusFilter, priorityFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'info';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'REJECTED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">All Issues</Typography>
                    <Typography variant="body1" color="text.secondary">Track and manage reported facility problems.</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priorityFilter}
                            label="Priority"
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <MenuItem value="">All Priorities</MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : issues.length === 0 ? (
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>No issues found matching your filters.</Typography>
                    <Link to="/report-issue" style={{ textDecoration: 'none', color: '#D90429', fontWeight: 'bold' }}>
                        Report a new issue &rarr;
                    </Link>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {issues.map(issue => (
                        <Grid item xs={12} md={6} lg={4} key={issue.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s, transform 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)'
                                    },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onClick={() => window.location.href = `/issues/${issue.id}`}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={issue.status}
                                            color={getStatusColor(issue.status)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                        {issue.priority === 'HIGH' && (
                                            <PriorityHigh color="error" />
                                        )}
                                    </Box>

                                    <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
                                        {issue.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <LocationOn fontSize="small" /> {issue.location}
                                    </Typography>

                                    <Box sx={{ pt: 2, mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTime fontSize="small" /> {new Date(issue.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <ArrowForward fontSize="small" color="primary" />
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

export default IssueList;
