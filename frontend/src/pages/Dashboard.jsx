import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Grid, Card, CardContent, Typography, Box, Chip, Avatar, Container } from '@mui/material';
import { AddCircle, List, Campaign, Search, BarChart, TrendingUp, AccessTime, Security } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Dashboard = () => {
    const { user } = useAuthStore();
    const theme = useTheme();

    const StatCard = ({ icon, label, value, color }) => (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', right: -10, top: -10, opacity: 0.1 }}>
                {icon}
            </Box>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar variant="rounded" sx={{ bgcolor: `${color}22`, color: color }}>
                        {icon}
                    </Avatar>
                </Box>
                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                    {label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">{value}</Typography>
            </CardContent>
        </Card>
    );

    const ModuleCard = ({ to, title, desc, icon }) => (
        <Card
            component={Link}
            to={to}
            sx={{
                textDecoration: 'none',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' }
            }}
        >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {desc}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight={800} gutterBottom>
                    Welcome back, {user?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Here's what's happening in your hostel today.
                </Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<TrendingUp sx={{ fontSize: 80 }} />}
                        label="System Status"
                        value="Online"
                        color={theme.palette.success.main} // Green
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<AccessTime sx={{ fontSize: 80 }} />}
                        label="Next Maintenance"
                        value="Sunday, 10 AM"
                        color={theme.palette.warning.main} // Orange
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<Security sx={{ fontSize: 80 }} />}
                        label="Your Role"
                        value={<span style={{ textTransform: 'uppercase' }}>{user?.role}</span>}
                        color={theme.palette.primary.main}
                    />
                </Grid>
            </Grid>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                Access Modules
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <ModuleCard
                        to="/report-issue"
                        title="Report Issue"
                        desc="Found a problem? Submit a report instantly."
                        icon={<AddCircle sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ModuleCard
                        to="/issues"
                        title="View Issues"
                        desc="Track status of reported issues and log."
                        icon={<List sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ModuleCard
                        to="/announcements"
                        title="Announcements"
                        desc="Check latest hostel updates and notices."
                        icon={<Campaign sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ModuleCard
                        to="/lost-found"
                        title="Lost & Found"
                        desc="Report or find lost items in campus."
                        icon={<Search sx={{ fontSize: 40 }} />}
                    />
                </Grid>

                {/* Conditional Admin/Staff Cards */}
                {['warden', 'maintenance', 'admin'].includes(user?.role) && (
                    <Grid item xs={12} sm={6} md={4}>
                        <ModuleCard
                            to="/staff-dashboard"
                            title="Staff Tasks"
                            desc="Manage your assigned maintenance work."
                            icon={<List sx={{ fontSize: 40 }} />}
                        />
                    </Grid>
                )}

                {user?.role === 'admin' && (
                    <Grid item xs={12} sm={6} md={4}>
                        <ModuleCard
                            to="/analytics"
                            title="Analytics"
                            desc="View system statistics and reports."
                            icon={<BarChart sx={{ fontSize: 40 }} />}
                        />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Dashboard;
