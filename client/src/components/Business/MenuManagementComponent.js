import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import groceryStoreList from '../BusinessCategory/groceryStoreList.json';

function MenuManagementComponent() {
    const { userType, userId } = useContext(UserContext);
    const [allUnits, setAllUnits] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        subcategory: '',
        unitOfMeasurement: '',
        allergenInformation: '',
        imageItem: '',
        businessId: userId,
        featured: false,
        discount: 0,
        stockStatus: true,
        customCategory: '',
        customSubcategories: []
    });

    const [businessInfo, setBusinessInfo] = useState({
        businessId: '',
        businessType: ''
    });


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
            console.log('result..!', result)
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
        console.log('Fetching menu items for business ID:', businessId); // Debugging line

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
    stockStatus
    imageItem
    unitOfMeasurement
    allergenInformation
    category
    subcategory
    featured
    discount
    adminApprovalStatus
              }
            }
          `,
                    variables: { businessId },
                }),
            });

            const result = await response.json();
         console.log('getmenu...!!',result);
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Update the state with the fetched menu items
            setMenuItems(result.data.getMenuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }

    }
    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenuItem((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle category change and reset subcategory
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setMenuItem((prevState) => ({
            ...prevState,
            category: selectedCategory,
            subcategory: '', // Reset subcategory when category changes
            customCategory: '' // Reset custom category if another option is selected
        }));

        if (selectedCategory === 'Other') {
            const allUnitsFromJson = [...new Set(groceryStoreList.flatMap(item => item.units))];
            setAllUnits(allUnitsFromJson);
        } else {
            setAllUnits([]); // Clear units if not 'Other'
        }

    };

    // Handle subcategory change
    const handleSubcategoryChange = (e) => {
        setMenuItem((prevState) => ({
            ...prevState,
            subcategory: e.target.value,
        }));
    };

    // Handle adding custom subcategories
    const handleCustomSubcategoryChange = (e) => {
        const { value } = e.target;
        setMenuItem((prevState) => ({
            ...prevState,
            customSubcategories: value.split(',').map(sub => sub.trim()) // Split by comma for multiple subcategories
        }));
    };

    // Handle checkbox toggle for availability status
    const handleCheckboxChange = (e) => {
        console.log('checked..!!',e.target.checked)
        setMenuItem((prevState) => ({
            ...prevState,
            stockStatus: e.target.checked,
        }));
    };


    const handleEdit = (id) => {
        console.log('Edit menu item with ID:', id);
        
    };

    // Function to handle delete action
    const handleDelete = (id) => {
        console.log('Delete menu item with ID:', id);
       
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('menuItem.....!!',menuItem)
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
                        $stockStatus: Boolean!,
                        $imageItem: String,
                        $unitOfMeasurement: String,
                        $allergenInformation: String,
                        $category: String!,
                        $subcategory:String!,
                        $businessId: ID!,
                        $featured: Boolean,
                        $discount: Float,
                    ) {
                        addMenuItem(
                            name: $name,
                            description: $description,
                            price: $price,
                            quantity: $quantity,
                            stockStatus: $stockStatus,
                            imageItem: $imageItem,
                            unitOfMeasurement: $unitOfMeasurement,
                            allergenInformation: $allergenInformation,
                            category: $category,
                            businessId: $businessId,
                            featured: $featured,
                            discount: $discount,
                            subcategory:$subcategory
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
                        stockStatus: menuItem.stockStatus,
                        imageItem: menuItem.imageItem,
                        unitOfMeasurement: menuItem.unitOfMeasurement,
                        allergenInformation: menuItem.allergenInformation,
                        category: menuItem.category === 'Other' ? menuItem.customCategory : menuItem.category,
                        businessId: businessInfo.id,
                        featured: menuItem.featured,
                        discount: parseFloat(menuItem.discount),
                        subcategory: menuItem.subcategory === 'Other' ? menuItem.customSubcategories : menuItem.subcategory,
                    }
                })
            });

            const result = await response.json();
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            console.log('Menu item added successfully:', result.data.addMenuItem);
            fetchMenuItems(result.data.addMenuItem.businessId);

            // Reset form
            setMenuItem({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                subcategory: '',
                unitOfMeasurement: '',
                allergenInformation: '',
                imageItem: '',
                featured: false,
                discount: 0,
                stockStatus: true,
                customCategory: '',
                customSubcategories: ''
            });
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    // Get the list of subcategories for the selected category
    // Get the list of subcategories and units for the selected category
    const getCategoryData = () => {
        return groceryStoreList.find((item) => item.category === menuItem.category);
    };

    const getSubcategories = () => {
        const categoryData = getCategoryData();
        return categoryData ? categoryData.subcategories : [];
    };

    const getUnits = () => {
        if (menuItem.category === 'Other') {
            return allUnits;
        }
        const categoryData = getCategoryData();
        return categoryData ? categoryData.units : [];
    };

    useEffect(() => {

        fetchUserData();

    }, [userId, userType]);


    return (
        <div>
            <h2>{menuItem._id ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={menuItem.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={menuItem.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={menuItem.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={menuItem.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        name="category"
                        value={menuItem.category}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {groceryStoreList.map((categoryItem, index) => (
                            <option key={index} value={categoryItem.category}>
                                {categoryItem.category}
                            </option>
                        ))}
                        <option value="Other">Other</option> {/* Other option */}
                    </select>
                </div>

                {/* Show input for custom category if "Other" is selected */}
                {menuItem.category === 'Other' && (
                    <div>
                        <label>Custom Category:</label>
                        <input
                            type="text"
                            name="customCategory"
                            value={menuItem.customCategory}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div>
                    <label>Subcategory:</label>
                    <select
                        name="subcategory"
                        value={menuItem.subcategory}
                        onChange={handleSubcategoryChange}
                        required
                    >
                        <option value="">Select Subcategory</option>
                        {getSubcategories().map((subcategory, index) => (
                            <option key={index} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                </div>

                {menuItem.subcategory === 'Other' && (
                    <div>
                        <label>Custom Subcategories (comma separated):</label>
                        <input
                            type="text"
                            name="customSubcategories"
                            value={menuItem.customSubcategories}
                            onChange={handleCustomSubcategoryChange}
                        />
                    </div>
                )}

                <div>
                    <label>Unit of Measurement:</label>
                    <select
                        name="unitOfMeasurement"
                        value={menuItem.unitOfMeasurement}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Unit</option>
                        {getUnits().map((unit, index) => (
                            <option key={index} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Allergen Information:</label>
                    <input
                        type="text"
                        name="allergenInformation"
                        value={menuItem.allergenInformation}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        name="imageItem"
                        value={menuItem.imageItem}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Discount:</label>
                    <input
                        type="number"
                        name="discount"
                        value={menuItem.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                    />
                </div>
                <div>
                    <label>Featured:</label>
                    <input
                        type="checkbox"
                        name="featured"
                        checked={menuItem.featured}
                        onChange={(e) =>
                            setMenuItem({ ...menuItem, featured: e.target.checked })
                        }
                    />
                </div>
                <div>
                    <label>Availability Status:</label>
                    <input
                        type="checkbox"
                        name="stockStatus"
                        checked={menuItem.stockStatus}
                        onChange={handleCheckboxChange}
                    />
                </div>

                <button type="submit">
                    {menuItem._id ? 'Update' : 'Add'} Menu Item
                </button>
            </form>

            <h2>Menu Items</h2>
            <table border="1">
                <thead>
                    <tr>
                    <th>Item ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Stock Status</th>
                        <th>Image</th>
                        <th>Unit of Measurement</th>
                        <th>Allergen Info</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Featured</th>
                        <th>Discount</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(menuItems) && menuItems.length > 0 ? (
                        menuItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.itemId}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.stockStatus ?'Available':'UnAvailable'}</td>
                                <td><img src={item.imageItem} alt={item.name} width="100" height="100" /></td>
                                <td>{item.unitOfMeasurement}</td>
                                <td>{item.allergenInformation}</td>
                                <td>{item.category}</td>
                                <td>{item.subcategory}</td>
                                <td>{item.featured ? 'Yes' : 'No'}</td>
                                <td>{item.discount}</td>
                                <td>{item.adminApprovalStatus ? 'Approved' : 'Pending'}</td>
                                <td>
                                    <button onClick={() => handleEdit(item.id)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="14">No menu items available</td>
                        </tr>
                    )}
                </tbody>
            </table>


        </div>
    );
}

export default MenuManagementComponent;
