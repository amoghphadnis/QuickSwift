import axios from "axios";

// Middleware to parse JSON request bodies
export const getProducts = async (req, res) => {
  try {
    // Fetch data from multiple APIs (e.g., FakeStore, Open Food Facts, Grocery API)
    const [fakeStore, openFood, grocery] = await Promise.all([
      axios.get('https://api.yelp.com/v3/businesses/search?categories=restaurants&location=your_location', {
        headers: { Authorization: `Bearer ${YOUR_YELP_API_KEY}` },
    }),
    axios.get('https://world.openfoodfacts.org/category/ready-meals.json'),
    ]);

    // Combine the data from all APIs into a single array
    const combinedData = [
      ...yelp.data.businesses.map((biz) => ({
        id: biz.id,
        name: biz.name,
        price: biz.price,
        image: biz.image_url,
        description: biz.categories.map((cat) => cat.title).join(', '),
    })),
    ...openFood.data.products.map((product) => ({
        id: product.code,
        name: product.product_name,
        price: product.price || 'N/A',
        image: product.image_url,
        description: product.categories_tags.join(', '),
    })),
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
