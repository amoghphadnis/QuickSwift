import React, { useState, useEffect ,useContext} from 'react';
import { UserContext }  from '../context/UserContext';

function MenuManagementComponent() {
    const { userType, userId } = useContext(UserContext);
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        availabilityStatus: true,
        imageUrl: '',
        unitOfMeasurement: '',
        allergenInformation: '',
        size: '',
        expiryDate: '',
        specialInstructions: '',
        bakedGoodsType: ''
    });

    const [businessInfo, setBusinessInfo] = useState({
        businessId: '',
        businessType: ''
    });

    const [menuItems, setMenuItems] = useState([]);

    // Define categories based on business type
    const categories = {
        restaurant: ['Veg', 'Non-Veg', 'Beverages', 'Sweets'],
        grocery_store: ['Fruits', 'Vegetables', 'Dairy', 'Snacks'],
        cafe: ['Coffee', 'Tea', 'Pastries'],
        bakery: ['Bread', 'Cakes', 'Pastries'],
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
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
                        query GetUser($id: ID!, $userType: String!) {
                            getUser(id: $id, userType: $userType) {
                                username
                                email
                                userType
                                businessInfo {
                                    id
                                    businessType
                                }
                            }
                        }
                    `,
                    variables: { id: userId, userType: userType }
                })
            });

            const result = await response.json();
            console.log('result..!',result)
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const userData = result.data.getUser;
            
            setBusinessInfo(userData.businessInfo);
            fetchMenuItems(userData.businessInfo.id);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchMenuItems = async (businessId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
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
                        query GetMenuItems($businessId: ID!) {
                            getMenuItems(businessId: $businessId) {
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
                            }
                        }
                    `,
                    variables: { businessId }
                })
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            setMenuItems(result.data.getMenuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    useEffect(() => {
        
            fetchUserData();
       
    }, [userId,userType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
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
                        mutation AddMenuItem(
                            $name: String!,
                            $description: String,
                            $price: Float!,
                            $quantity: Int!,
                            $availabilityStatus: Boolean!,
                            $imageUrl: String,
                            $unitOfMeasurement: String,
                            $allergenInformation: String,
                            $category: String!,
                            $businessId: ID!,
                            $bakedGoodsType: String,
                            $size: String,
                            $expiryDate: String,
                            $specialInstructions: String
                        ) {
                            addMenuItem(
                                name: $name,
                                description: $description,
                                price: $price,
                                quantity: $quantity,
                                availabilityStatus: $availabilityStatus,
                                imageUrl: $imageUrl,
                                unitOfMeasurement: $unitOfMeasurement,
                                allergenInformation: $allergenInformation,
                                category: $category,
                                businessId: $businessId,
                                bakedGoodsType: $bakedGoodsType,
                                size: $size,
                                expiryDate: $expiryDate,
                                specialInstructions: $specialInstructions
                            ) {
                                id
                                name
                                category
                                price
                            }
                        }
                    `,
                    variables: {
                        name: menuItem.name,
                        description: menuItem.description,
                        price: parseFloat(menuItem.price),
                        quantity: parseInt(menuItem.quantity, 10),
                        availabilityStatus: menuItem.availabilityStatus,
                        imageUrl: menuItem.imageUrl,
                        unitOfMeasurement: menuItem.unitOfMeasurement,
                        allergenInformation: menuItem.allergenInformation,
                        category: menuItem.category,
                        businessId: businessInfo.businessId,
                        bakedGoodsType: menuItem.bakedGoodsType,
                        size: menuItem.size,
                        expiryDate: menuItem.expiryDate,
                        specialInstructions: menuItem.specialInstructions
                    }
                })
            });

            const result = await response.json();
            console.log('result...!!',result)
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            console.log('Menu item added successfully:', result.data.addMenuItem);
            fetchMenuItems(businessInfo.businessId);
            setMenuItem({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                availabilityStatus: true,
                imageUrl: '',
                unitOfMeasurement: '',
                allergenInformation: '',
                size: '',
                expiryDate: '',
                specialInstructions: '',
                bakedGoodsType: ''
            });
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <div>
            <h1>Menu Management for {businessInfo.businessType}</h1>
            <h2>Business ID: {businessInfo.businessId}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Menu Item Name:
                        <input
                            type="text"
                            value={menuItem.name}
                            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Description:
                        <textarea
                            value={menuItem.description}
                            onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                            placeholder="Brief description of the item"
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={menuItem.price}
                            onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={menuItem.quantity}
                            onChange={(e) => setMenuItem({ ...menuItem, quantity: e.target.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Availability Status:
                        <select
                            value={menuItem.availabilityStatus}
                            onChange={(e) => setMenuItem({ ...menuItem, availabilityStatus: e.target.value === 'true' })}
                        >
                            <option value={true}>In Stock</option>
                            <option value={false}>Out of Stock</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Image URL:
                        <input
                            type="text"
                            value={menuItem.imageUrl}
                            onChange={(e) => setMenuItem({ ...menuItem, imageUrl: e.target.value })}
                            placeholder="URL for the menu item image"
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Unit of Measurement:
                        <input
                            type="text"
                            value={menuItem.unitOfMeasurement}
                            onChange={(e) => setMenuItem({ ...menuItem, unitOfMeasurement: e.target.value })}
                            placeholder="e.g., kg, lbs, each"
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Allergen Information:
                        <textarea
                            value={menuItem.allergenInformation}
                            onChange={(e) => setMenuItem({ ...menuItem, allergenInformation: e.target.value })}
                            placeholder="Any allergen information"
                        />
                    </label>
                </div>

                {businessInfo.businessType === 'bakery' && (
                    <div>
                        <label>
                            Baked Goods Type:
                            <input
                                type="text"
                                value={menuItem.bakedGoodsType}
                                onChange={(e) => setMenuItem({ ...menuItem, bakedGoodsType: e.target.value })}
                                placeholder="Type of baked goods (e.g., bread, cake)"
                                required
                            />
                        </label>
                    </div>
                )}

                <div>
                    <label>
                        Category:
                        <select
                            value={menuItem.category}
                            onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories[businessInfo.businessType]?.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Other fields can be conditionally rendered based on businessType as needed */}

                <div>
                    <button type="submit">Add Menu Item</button>
                </div>
            </form>

            <h2>Menu Items</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.itemId}>
                        {item.name} - {item.price} - {item.category}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MenuManagementComponent;
