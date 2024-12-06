import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/productsSlice';
import axios from 'axios';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            dispatch(setProducts(response.data));
        } catch (error) {
            console.error('Error fetching food products:', error);
        }
    };
    fetchProducts();
}, [dispatch]);

return (
  <div>
      {products.map((product) => (
          <div key={product.id}>
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
              <p>{product.description}</p>
              <p>{product.price}</p>
          </div>
      ))}
  </div>
);
};

export default Products;
