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

    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
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
       console.log('businessId....!!',businessId)
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
                                businessId
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
                        businessId: businessInfo.id,
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
            fetchMenuItems(result.data.addMenuItem.businessId);
            setMenuItem({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                availabilityStatus: false,
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

    const handleDelete = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
                        mutation DeleteMenuItem($itemId: String!) {
                            deleteMenuItem(itemId: $itemId) {
                                success
                                message
                            }
                        }
                    `,
                    variables: { itemId }
                })
            });

            const result = await response.json();
            console.log('result..delete..!!',result)
            console.log('businessInfo..!!',businessInfo)
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
           if(result.data.deleteMenuItem.success === true){
               console.log('message...',result.message)
               fetchMenuItems(businessInfo.id)
           }
            // After deleting, refresh the list
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };


const clearForm = () => {
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
        setIsEditing(false);
        setEditItemId(null);
    };


   const handleEditItem = (item) => {
    console.log('item..!!',item)
        setMenuItem(item);
        setIsEditing(true);
        setEditItemId(item.id);
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
                        mutation UpdateMenuItem($id: ID!, $input: MenuItemInput!) {
                            updateMenuItem(id: $id, input: $input) {
                                id
                                itemId
                                name
                                description
                                price
                                quantity
                                category
                                availabilityStatus
                                imageUrl
                                unitOfMeasurement
                                allergenInformation
                                bakedGoodsType
                            }
                        }
                    `,
                    variables: {
                        id: editItemId,
                        input: {  
                             name: menuItem.name,
                            description: menuItem.description,
                            price: parseFloat(menuItem.price), 
                            quantity: parseInt(menuItem.quantity, 10),
                            category: menuItem.category,
                            availabilityStatus: menuItem.availabilityStatus,
                            imageUrl: menuItem.imageUrl,
                            unitOfMeasurement: menuItem.unitOfMeasurement,
                            allergenInformation: menuItem.allergenInformation,
                            bakedGoodsType: menuItem.bakedGoodsType}
                    },
                }),
            });

            const result = await response.json();
            console.log('result...!!',result)
             if (result.data && result.data.updateMenuItem) {
            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item.id === editItemId ? result.data.updateMenuItem : item
                )
            );
            clearForm();
        } else {
            console.error('Error response:', result.errors);
        }
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    return (
        <div>
            <h1>Menu Management for {businessInfo.businessType}</h1>
            <h2>Business ID: {businessInfo.businessId}</h2>
            <form onSubmit={isEditing ? handleUpdateItem : handleSubmit}>
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
                <button type="submit">{isEditing ? 'Update Menu Item' : 'Add Menu Item'}</button>
                </div>
            </form>

            <h2>Menu Items</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Availability Status</th>
            <th>Image</th>
            <th>Unit of Measurement</th>
            <th>Allergen Information</th>
            <th>Baked Goods Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.availabilityStatus ? 'Available' : 'Unavailable'}</td>
              <td>
                {/* Display image if available */}
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} width="50" height="50" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{item.unitOfMeasurement}</td>
              <td>{item.allergenInformation || 'N/A'}</td>
              <td>{item.bakedGoodsType || 'N/A'}</td>
              <td>{item.category}</td>
              <td>
                 <button onClick={() => handleEditItem(item)}>Edit</button>
                <button onClick={() => handleDelete(item.itemId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    );
}

export default MenuManagementComponent;
