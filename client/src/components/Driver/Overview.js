import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const Overview = () => {
  const data = [
    { title: 'Monthly Deliveries', value: '857 orders', trend: '-10%' },
    { title: 'Monthly Work Hours', value: '158 hours', trend: '+20%' },
    { title: 'Earned Funds', value: '$1,500', trend: '+5%' },
  ];

  return (
    <Grid container spacing={3}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="h5" sx={{ my: 1 }}>{item.value}</Typography>
              <Typography variant="caption" color="textSecondary">{item.trend}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Overview;
