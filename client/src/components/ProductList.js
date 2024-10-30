import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product.id} className="product">
                    <img src={product.imageUrl} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span>${product.price}</span>
                    <button>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
