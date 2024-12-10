import React from 'react';
import { useSelector } from 'react-redux';

const ProductList = () => {
    const products = useSelector(state => state.products);

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product.id} className="product">
                    <img src={product.imageItem || 'https://via.placeholder.com/150'} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <span>${product.price}</span>
                    <button>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
