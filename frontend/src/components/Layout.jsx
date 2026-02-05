import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Chip, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu as MenuIcon, Home, List as ListIcon, Campaign, Search as SearchIcon, Assessment, Logout, Close } from '@mui/icons-material';

const Layout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
        { text: 'Issues', icon: <ListIcon />, path: '/issues' },
        { text: 'Updates', icon: <Campaign />, path: '/announcements' },
        { text: 'Lost & Found', icon: <SearchIcon />, path: '/lost-found' },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ text: 'Analytics', icon: <Assessment />, path: '/analytics' });
    }

    const drawerContent = (
        <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    HOSTEL<span style={{ color: theme.palette.primary.main }}>ISSUE</span>
                </Typography>
                {isMobile && <IconButton onClick={handleDrawerToggle}><Close /></IconButton>}
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={Link}
                        to={item.path}
                        onClick={() => isMobile && setMobileOpen(false)}
                        selected={location.pathname === item.path}
                        sx={{
                            borderRadius: '0 24px 24px 0',
                            mr: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                                '& .MuiListItemIcon-root': {
                                    color: 'white',
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-0.5px' }}>
                        HOSTEL<span style={{ color: theme.palette.primary.main }}>ISSUE</span>
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle2" fontWeight="bold">{user?.name}</Typography>
                                <Chip label={user?.role} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                            </Box>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.name?.charAt(0)}</Avatar>
                            <IconButton color="inherit" onClick={handleLogout} title="Logout">
                                <Logout />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Sidebar (Desktop & Mobile) */}
            <Box component="nav" sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderRight: '1px solid rgba(255,255,255,0.08)', top: 64, height: 'calc(100% - 64px)' },
                        }}
                        open
                    >
                        {drawerContent}
                    </Drawer>
                )}
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` }, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
