import axios from "axios";

// Middleware to parse JSON request bodies
export const getProducts = async (req, res) => {
  try {
    // Fetch data from multiple APIs (e.g., FakeStore, Open Food Facts, Grocery API)
    const [fakeStore, openFood, grocery] = await Promise.all([
      axios.get("https://fakestoreapi.com/products"),
      axios.get("https://world.openfoodfacts.org/api/v0/product/737628064502.json"),
      axios.get('https://grocery-api-example.com/products'),
    ]);

    // Combine the data from all APIs into a single array
    const combinedData = [
      ...fakeStore.data,
      ...openFood.data.products, // Adjust based on API response structure
      ...grocery.data,
    ];

    // Sort the combined data by price in ascending order
    res.status(200).json(combinedData);
  } catch (error) {

    // Handle error if any API request fails
    console.error("Error fetching product data:", error);

    // Return a generic error message to the client
    res.status(500).json({ error: "Failed to fetch product data" });
  }
};
