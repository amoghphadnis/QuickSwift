import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const OrdersHistory = () => {
  const orders = [
    { id: '12345678', status: 'Completed', date: '1/10/2024', time: '5:12 PM', amount: '$32.85' },
    { id: '12345677', status: 'Pending', date: '1/10/2024', time: '3:24 PM', amount: '$12' },
    { id: '12345676', status: 'Failed', date: '1/10/2024', time: '2:00 PM', amount: '$21.99' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Orders History</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{`${order.date} ${order.time}`}</TableCell>
                <TableCell>{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersHistory;
