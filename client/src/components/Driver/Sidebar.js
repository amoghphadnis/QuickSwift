import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Switch } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

const Sidebar = () => {
  return (
    <Box sx={{ width: 240, bgcolor: 'background.paper', height: '100vh' }}>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" color="primary">QuickSwift</Typography>
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><PieChartIcon /></ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="body2">Dark Mode</Typography>
          <Switch />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
