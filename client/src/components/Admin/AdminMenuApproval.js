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
                                availabilityStatus
                                imageUrl
                                unitOfMeasurement
                                allergenInformation
                                bakedGoodsType
                                category
                                businessId
                                adminApprovalStatus
                                businessType
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
        // const token = localStorage.getItem('token');

        // try {
        //     const response = await fetch('http://localhost:5000/graphql', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`,
        //         },
        //         body: JSON.stringify({
        //             query: APPROVE_MENU_ITEM.loc.source.body,
        //             variables: { id, adminApprovalStatus: approvedStatus },
        //         }),
        //     });

        //     const result = await response.json();
        //     if (result.errors) {
        //         console.error('Error approving item:', result.errors);
        //     } else {
        //         console.log('Item approved successfully:', result.data.approveMenuItem);
        //         fetchMenuItems(); // Refetch items to update the list
        //     }
        // } catch (err) {
        //     console.error('Error approving item:', err);
        // } 
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
                        <p><strong>Available:</strong> {item.availabilityStatus ? 'Yes' : 'No'}</p>
                        <p><strong>Business Type:</strong> {item.businessType}</p>

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
