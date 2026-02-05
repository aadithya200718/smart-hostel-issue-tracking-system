import { useEffect } from 'react';
import useIssueStore from '../store/useIssueStore';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Chip, Button, Avatar } from '@mui/material';
import { AssignmentTurnedIn, LocationOn, ArrowForward, PriorityHigh } from '@mui/icons-material';

const StaffDashboard = () => {
    const { issues, fetchIssues, loading } = useIssueStore();

    useEffect(() => {
        // Fetch issues assigned to me
        fetchIssues({ assignedToMe: 'true', status: 'IN_PROGRESS' });
    }, [fetchIssues]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar variant="rounded" sx={{ bgcolor: 'error.main' }}>
                    <AssignmentTurnedIn />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold">My Tasks</Typography>
                    <Typography variant="body1" color="text.secondary">Issues assigned to you that need attention.</Typography>
                </Box>
            </Box>

            {loading ? (
                <Typography textAlign="center">Loading tasks...</Typography>
            ) : issues.length === 0 ? (
                <Card variant="outlined" sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>All Caught Up!</Typography>
                    <Typography color="text.secondary">You have no pending tasks assigned at the moment.</Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {issues.map(issue => (
                        <Card key={issue.id} sx={{ '&:hover': { borderColor: 'primary.main' } }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <Chip
                                            label={`${issue.priority} PRIORITY`}
                                            color={issue.priority === 'HIGH' ? 'error' : 'info'}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, borderRadius: 1 }}>
                                            {issue.category}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">{issue.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationOn fontSize="small" /> {issue.location}
                                    </Typography>
                                </Box>

                                <Button
                                    component={Link}
                                    to={`/issues/${issue.id}`}
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                >
                                    Update Status
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default StaffDashboard;
