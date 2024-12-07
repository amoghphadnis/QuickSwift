import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Statistics = () => {
  // Data for the Doughnut Chart
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

  // Data for the Bar Chart
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
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Statistics
        </Typography>
        {/* Doughnut Chart */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Area Distribution
        </Typography>
        <Doughnut data={doughnutData} />

        {/* Bar Chart */}
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
          Monthly Sales
        </Typography>
        <Bar data={barData} options={barOptions} />
      </CardContent>
    </Card>
  );
};

export default Statistics;
