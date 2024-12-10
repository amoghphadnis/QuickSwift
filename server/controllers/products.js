import Product from "../model/product.model"; // Import the Product model

// Fetch products from MongoDB
export const getProducts = async (req, res) => {
    try {
        // Fetch all products from the MongoDB database
        const products = await Product.find();

        // Respond with the products
        res.status(200).json(products);
    } catch (error) {
        // Handle error
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products from the database" });
    }
};
