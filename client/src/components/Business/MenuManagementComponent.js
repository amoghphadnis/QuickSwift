import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import groceryStoreList from '../BusinessCategory/groceryStoreList.json';
import {
    Typography,
    TextField,
    Checkbox,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Container,
    Box,
    FormGroup,
    FormControlLabel,
} from '@mui/material';

function MenuManagementComponent() {
    const { userType, userId } = useContext(UserContext);
    const [allUnits, setAllUnits] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [categoryList, setCategoryList] = useState([]);


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
        customSubcategories: '',
        customUnitofMeasurements: '',
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
            console.log('getmenu...!!', result);
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Update the state with the fetched menu items
            setMenuItems(result.data.getMenuItems);
            if (businessInfo.businessType === 'grocery') {
                const categoriesFromMenu = result.data.getMenuItems
                    .map(item => item.category)
                    .filter(category => !groceryStoreList.some(existingItem => existingItem.category === category));

                const subcategoriesFromMenu = result.data.getMenuItems
                    .map(item => item.subcategory)
                    .filter(subcategory => {
                        // Check if subcategory exists in any of the groceryStoreList items
                        return !groceryStoreList.some(existingItem => existingItem.subcategories.includes(subcategory));
                    });

                // Update groceryStoreList with new categories and subcategories
                if (categoriesFromMenu.length > 0 || subcategoriesFromMenu.length > 0) {
                    updateGroceryStoreList(categoriesFromMenu, subcategoriesFromMenu);
                }
            } else {
                const uniqueCategories = Array.from(
                    new Set(result.data.getMenuItems.map(item => item.category))
                ).map(category => ({ category }));
                setCategoryList(uniqueCategories);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }

    }


    const updateGroceryStoreList = (newCategories, newSubcategories) => {
        // Add new categories if not already in groceryStoreList
        newCategories.forEach(category => {
            // Check if the category already exists in the groceryStoreList
            if (!groceryStoreList.some(item => item.category === category)) {
                // If not, add it with empty subcategories and default units
                groceryStoreList.push({ category, subcategories: [], units: [...new Set(groceryStoreList.flatMap(item => item.units))] });
            }
        });

        // Add new subcategories to existing categories or create new ones
        groceryStoreList.forEach(item => {
            // Only add subcategories to items where the category exists in the new categories
            if (newCategories.includes(item.category)) {
                newSubcategories.forEach(subcategory => {
                    // Add the subcategory if it's not already in the subcategories array
                    if (!item.subcategories.includes(subcategory)) {
                        item.subcategories.push(subcategory);
                    }
                });
            }
        });

    };

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
            customSubcategories: value // Split by comma for multiple subcategories
        }));
    };

    // Handle checkbox toggle for availability status
    const handleCheckboxChange = (e) => {
        console.log('checked..!!', e.target.checked)
        setMenuItem((prevState) => ({
            ...prevState,
            stockStatus: e.target.checked,
        }));
    };


    const handleEdit = (item) => {
        console.log('item..!!', item);
        setMenuItem(item);
        setIsEditing(true);
        setEditItemId(item.id);

    };


    const clearForm = () => {
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
            businessId: userId,
            featured: false,
            discount: 0,
            stockStatus: true,
            customCategory: '',
            customSubcategories: ''
        });
        setIsEditing(false);
        setEditItemId(null);
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
                                unitOfMeasurement
                                allergenInformation
                                stockStatus
                                imageItem
                                businessId
                                featured
                                discount
                                subcategory
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
                            category: menuItem.category === 'Other' ? menuItem.customCategory : menuItem.category,
                            unitOfMeasurement: menuItem.unitOfMeasurement,
                            allergenInformation: menuItem.allergenInformation,
                            stockStatus: menuItem.stockStatus,
                            imageItem: menuItem.imageItem,
                            businessId: businessInfo.id,
                            featured: menuItem.featured,
                            discount: parseFloat(menuItem.discount),
                            subcategory: menuItem.subcategory === 'Other' ? menuItem.customSubcategories : menuItem.subcategory,
                        }
                    },
                }),
            });

            const result = await response.json();
            console.log('result:', result);

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



    // Function to handle delete action
    const handleDelete = async (itemId) => {
        console.log('itemId...!!', itemId)
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

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            if (result.data.deleteMenuItem.success === true) {
                console.log('message...', result.message)
                fetchMenuItems(businessInfo.id)
            }
            // After deleting, refresh the list
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };


    // Handle form submission
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
                        $quantity: Int,
                        $stockStatus: Boolean!,
                        $imageItem: String,
                        $unitOfMeasurement: String,
                        $allergenInformation: String,
                        $category: String!,
                        $subcategory:String,
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
                        quantity: parseInt(menuItem.quantity || '0', 10),
                        stockStatus: menuItem.stockStatus,
                        imageItem: menuItem.imageItem,
                        unitOfMeasurement: menuItem.unitOfMeasurement === 'Other' ? menuItem.customUnitOfMeasurement : menuItem.unitOfMeasurement,
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const maxSize = 10 * 1024 * 1024; // 10MB limit

        if (files && files[0].size > maxSize) {
            // Display a toast message  
            toast.error('File size exceeds the maximum limit of 10MB.', {
                position: 'bottom-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuItem(prevData => ({
                    ...prevData,
                    [name]: reader.result // Store the base64 string
                }));
                // Display a toast message  
                toast.success('File uploaded successfully!', {
                    position: 'bottom-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            };
            reader.readAsDataURL(files[0]); // Convert file to base64
        }
    };


    const getFilteredCategories = () => {
        if (businessInfo.businessType === 'grocery_store') {
            // Return groceryStoreList directly if business type is 'grocery'
            return groceryStoreList;
        } else {
            // Return hardcoded categories for other business types
            return [
                { category: 'Appetizers', subcategories: ['Salads', 'Soup', 'Finger Foods'] },
                { category: 'Main Course', subcategories: ['Pasta', 'Burgers', 'Pizza'] },
                { category: 'Desserts', subcategories: ['Cakes', 'Ice Cream', 'Pastries'] },
                { category: 'Beverages', subcategories: ['Coffee', 'Juices', 'Smoothies'] },
            ];
        }
    };

    const getCategoryData = () => {
        return getFilteredCategories().find((item) => item.category === menuItem.category);
    };

    const getSubcategories = () => {
        const categoryData = getCategoryData();
        console.log('categoryData...!!', categoryData)

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
        <Container>
            {/* Form Section */}
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
                </Typography>
                <form onSubmit={isEditing ? handleUpdateItem : handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={menuItem.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={menuItem.price}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={menuItem.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        {businessInfo.businessType === "grocery_store" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={menuItem.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                fullWidth
                                name="category"
                                value={menuItem.category}
                                onChange={handleCategoryChange}
                                required
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {(businessInfo.businessType === "grocery_store"
                                    ? groceryStoreList
                                    : categoryList
                                ).map((categoryItem, index) => (
                                    <MenuItem key={index} value={categoryItem.category}>
                                        {categoryItem.category}
                                    </MenuItem>
                                ))}
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </Grid>
                        {menuItem.category === "Other" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Custom Category"
                                    name="customCategory"
                                    value={menuItem.customCategory}
                                    onChange={handleChange}
                                />
                            </Grid>
                        )}
                        {businessInfo.businessType === "grocery_store" && (
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Subcategory</InputLabel>
                                <Select
                                    fullWidth
                                    name="subcategory"
                                    value={menuItem.subcategory}
                                    onChange={handleSubcategoryChange}
                                    required
                                >
                                    <MenuItem value="">Select Subcategory</MenuItem>
                                    {getSubcategories().map((subcategory, index) => (
                                        <MenuItem key={index} value={subcategory}>
                                            {subcategory}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </Grid>
                        )}
                        {menuItem.subcategory === "Other" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Custom Subcategories (comma separated)"
                                    name="customSubcategories"
                                    value={menuItem.customSubcategories}
                                    onChange={handleCustomSubcategoryChange}
                                />
                            </Grid>
                        )}
                        {businessInfo.businessType === "grocery_store" && (
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Unit of Measurement</InputLabel>
                                <Select
                                    fullWidth
                                    name="unitOfMeasurement"
                                    value={menuItem.unitOfMeasurement}
                                    onChange={(e) => {
                                        const selectedUnit = e.target.value;
                                        setMenuItem((prevState) => ({
                                            ...prevState,
                                            unitOfMeasurement: selectedUnit,
                                            customUnitOfMeasurement: selectedUnit === 'Other' ? '' : prevState.customUnitOfMeasurement,
                                        }));
                                    }}
                                    required
                                >
                                    <MenuItem value="" label="Select Unit of Measurement">Select Unit</MenuItem>
                                    {getUnits().map((unit, index) => (
                                        <MenuItem key={index} value={unit}>
                                            {unit}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </Grid>
                        )}
                        {menuItem.unitOfMeasurement === 'Other' && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Custom Unit of Measurement"
                                    name="customUnitOfMeasurement"
                                    value={menuItem.customUnitOfMeasurement}
                                    onChange={(e) =>
                                        setMenuItem((prevState) => ({
                                            ...prevState,
                                            customUnitOfMeasurement: e.target.value,
                                        }))
                                    }
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Allergen Information"
                                name="allergenInformation"
                                value={menuItem.allergenInformation}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Discount"
                                name="discount"
                                type="number"
                                value={menuItem.discount}
                                onChange={handleChange}
                                inputProps={{ min: 0, max: 100 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                            >
                                Upload your product Image
                                <input
                                    type="file"
                                    name="imageItem"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {menuItem.imageItem && (
                                <img
                                    src={menuItem.imageItem}
                                    alt="Uploaded Image"
                                    style={{ width: '200px', height: 'auto' }} // adjust size as needed  
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={menuItem.featured}
                                        onChange={(e) =>
                                            setMenuItem({
                                                ...menuItem,
                                                featured: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Featured"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={menuItem.stockStatus}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Available"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit">
                                {isEditing ? "Update Menu Item" : "Add Menu Item"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Table Section */}
            <Typography variant="h4" gutterBottom>
                Menu Items
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Stock Status</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Unit of Measurement</TableCell>
                            <TableCell>Allergen Info</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Subcategory</TableCell>
                            <TableCell>Featured</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Approval Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(menuItems) && menuItems.length > 0 ? (
                            menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.itemId}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        {item.stockStatus ? "Available" : "Unavailable"}
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={item.imageItem}
                                            alt={item.name}
                                            width="100"
                                            height="100"
                                        />
                                    </TableCell>
                                    <TableCell>{item.unitOfMeasurement}</TableCell>
                                    <TableCell>{item.allergenInformation}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.subcategory}</TableCell>
                                    <TableCell>
                                        {item.featured ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell>{item.discount}</TableCell>
                                    <TableCell>
                                        {item.adminApprovalStatus ? "Approved" : "Pending"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(item)}
                                            startIcon={<FontAwesomeIcon icon={faEdit} />}
                                        >
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(item.itemId)}
                                            startIcon={<FontAwesomeIcon icon={faTrash} />}
                                            style={{ marginTop: "5px" }}
                                        >
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={15} align="center">
                                    No menu items available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default MenuManagementComponent;
