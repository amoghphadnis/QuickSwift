import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Grid, Card, CardContent, Typography, Box, Button, Switch, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
// import MenuIcon from '@mui/icons-material/Menu';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(false);

  // Data for charts
  const doughnutData = {
    labels: ['Central Area', 'South-Western Area', 'Eastern Area'],
    datasets: [
      {
        data: [52, 15, 33],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB99', '#FF638499', '#FFCE5699'],
      },
    ],
  };

  const barData = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Sales',
        data: [3, 2, 1],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />

        {/* Dashboard Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />
          <Grid container spacing={2}>
            {/* Overview Cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Monthly Deliveries</Typography>
                  <Typography variant="h4">857 orders</Typography>
                  <Typography color="error">-10% vs past month</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Monthly Work Hours</Typography>
                  <Typography variant="h4">158 hours</Typography>
                  <Typography color="success">+20% vs past month</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Earned Funds</Typography>
                  <Typography variant="h4">$1,500</Typography>
                  <Typography color="success">+5% vs past month</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Statistics Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Statistics</Typography>
                  <Doughnut data={doughnutData} />
                </CardContent>
              </Card>
            </Grid>

            {/* Orders History */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Orders History</Typography>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>12345678</td>
                        <td>Completed</td>
                        <td>1/10/2024 5:12 PM</td>
                        <td>$32.85</td>
                      </tr>
                      <tr>
                        <td>12345677</td>
                        <td>Pending</td>
                        <td>1/10/2024 3:24 PM</td>
                        <td>$12</td>
                      </tr>
                      <tr>
                        <td>12345676</td>
                        <td>Failed</td>
                        <td>1/10/2024 2:00 PM</td>
                        <td>$21.99</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
  );
};

export default Dashboard;
