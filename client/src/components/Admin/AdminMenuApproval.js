import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Checkbox,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

const AdminMenuApproval = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all menu items
    const fetchMenuItems = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
                        query {
                            getMenuItemsList{
                                id
                                itemId
                                name
                                description
                                price
                                quantity
                                stockStatus
                                imageItem
                                unitOfMeasurement
                                allergenInformation
                                category
                                adminApprovalStatus
                                businessType
                                businessId
                            }
                        }
                    `
                })
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            console.log('result...!!', result)
            setMenuItems(result.data.getMenuItemsList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Handle admin approval change for a menu item
    const handleApprovalChange = async (id, approvedStatus) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        try {
            setApproving(true);
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
                        mutation UpdateAdminApprovalStatus($id: ID!, $adminApprovalStatus: Boolean!) {
                            updateAdminApprovalStatus(id: $id, adminApprovalStatus: $adminApprovalStatus) {
                                id
                                adminApprovalStatus
                            }
                        }
                    `,
                    variables: { id, adminApprovalStatus: approvedStatus },
                }),
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Update local state to reflect the change
            setMenuItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id
                        ? { ...item, adminApprovalStatus: approvedStatus }
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating admin approval status:', error);
            setError(error.message);
        } finally {
            setApproving(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Menu Items Approval
            </Typography>
            {menuItems.length === 0 ? (
                <Typography>No menu items found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {menuItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="500"
                                    image={item.imageItem}
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Price:</strong> ${item.price}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Quantity:</strong> {item.quantity}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Category:</strong> {item.category}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Available:</strong> {item.stockStatus ? "Yes" : "No"}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Business Type:</strong> {item.businessType}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Typography variant="body1">
                                            <strong>Admin Approval Status:</strong>
                                        </Typography>
                                        <Checkbox
                                            checked={item.adminApprovalStatus}
                                            onChange={(e) => handleApprovalChange(item.id, e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            {approving && (
                <Box mt={2} display="flex" justifyContent="center">
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default AdminMenuApproval;
