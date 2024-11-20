import React, { useEffect, useState } from 'react';

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
             console.log('result...!!',result)
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
        <div>
            <h2>Menu Items Approval</h2>
            {menuItems.length === 0 ? (
                <p>No menu items found.</p>
            ) : (
                menuItems.map((item) => (
                    <div key={item.id}>
                        <h3>{item.name}</h3>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Price:</strong> ${item.price}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Category:</strong> {item.category}</p>
                        <p><strong>Available:</strong> {item.stockStatus ? 'Yes' : 'No'}</p>
                        <p><strong>Business Type:</strong> {item.businessType}</p>
                        <p><img src={item.imageItem} alt={item.name} width="100" height="100" /></p>
                        <label>
                            <strong>Admin Approval Status:</strong>
                            <input
                                type="checkbox"
                                checked={item.adminApprovalStatus}
                                onChange={(e) => handleApprovalChange(item.id, e.target.checked)}
                            />
                        </label>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminMenuApproval;
