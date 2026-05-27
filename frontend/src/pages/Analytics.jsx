import { useEffect } from 'react';
import useAnalyticsStore from '../store/useAnalyticsStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Container, Typography, Grid, Card, CardContent, Box, Avatar, useTheme } from '@mui/material';
import { Assessment, Warning, CheckCircle, Assignment } from '@mui/icons-material';

const Analytics = () => {
    const { stats, fetchStats, loading } = useAnalyticsStore();
    const theme = useTheme();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading || !stats) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading Analytics...</Typography></Box>;

    const COLORS = ['#D90429', '#EF233C', '#8D99AE', '#2B2D42', '#EDF2F4'];

    const categoryData = stats.byCategory.map(item => ({
        name: item.category,
        value: parseInt(item.count)
    }));

    const priorityData = stats.byPriority.map(item => ({
        name: item.priority,
        value: parseInt(item.count)
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, boxShadow: 3 }}>
                    <Typography variant="body2" fontWeight="bold">{label ? `${label} :` : ''} {payload[0].value}</Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment color="primary" fontSize="large" /> System Analytics
            </Typography>

            {/* Scorecards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                <Assignment fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Total Issues</Typography>
                                <Typography variant="h4" fontWeight="bold">{stats.totalIssues}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                                <Warning fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Open Issues</Typography>
                                <Typography variant="h4" fontWeight="bold" color="error.main">{stats.openIssues}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                <CheckCircle fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Resolved</Typography>
                                <Typography variant="h4" fontWeight="bold" color="success.main">{stats.resolvedIssues}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>Issues by Category</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>Issues by Priority</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analytics;
